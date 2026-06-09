// Copyright 2026, University of Colorado Boulder
/**
 * EnergyDiagramAccordionBox is an accordion box that contains the energy diagram for the alpha particles, including
 * the potential, initial, and final energy. It also includes animations of particles in the potential energy well and
 * exiting the atomic nucleus when the atom decays.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import AccessibleList from '../../../../scenery-phet/js/accessibility/AccessibleList.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from '../../common/view/NuclearDecayAccordionBox.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import SingleAtomModel from '../model/SingleAtomModel.js';
import EnergyDiagramLegendNode from './EnergyDiagramLegendNode.js';
import EnergyGrabberNode from './EnergyGrabberNode.js';

type SelfOptions = EmptySelfOptions;

export type EnergyDiagramAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

const CONTENT_X_MARGIN = 10;
const CONTENT_Y_MARGIN = 20;

// Height of the graph region (y-axis length). Kept constant; width is derived from provided bounds.
const GRAPH_HEIGHT = 160;

// Left margin inside the content: room for the rotated "Energy" label and the left side of the x-axis arrow.
const GRAPH_X_OFFSET = 15;

// Legend
const LEGEND_X = GRAPH_X_OFFSET + 10;
const LEGEND_Y = 25;

// Potential energy curve parameters (screen coordinates: negative Y = higher energy)
export const WELL_HALF_WIDTH = 45; // half-width of the flat-bottomed well
export const MAX_ESCAPE_DISTANCE = 1000; // used when initial energy is above the barrier, so the intersection point is off the graph
const INTERSECTION_THRESHOLD = -0.4; // Below this, the intersection between curves might accidentally land in the well
const COULOMB_MIN_Y = 0; // asymptotic Coulomb energy at large distance (just above x-axis)
const ENERGY_PEAK_Y = -GRAPH_HEIGHT * 0.4; // top of the Coulomb barrier (above initial energy line)
const WELL_BOTTOM_Y = GRAPH_HEIGHT * 0.4; // bottom of the nuclear potential well (below x-axis)
const POINTINESS_FACTOR = 25; // sharpness of the quadratic curve at the barrier peak. 0 = max pointiness, 100 least.
const CURVINESS_FACTOR = 0; // how curvy the potential energy curve is at the barrier peak. 0 = very curvy, rapid falloff, 1 = closer to a straight line.

const FINAL_ENERGY_HEIGHT = 18; // height of the final energy line after decay (below x-axis)

export default class EnergyDiagramAccordionBox extends NuclearDecayAccordionBox {

  // This property tracks the position where initial and potential energies first intersect to the left of the well.
  // This essentially defines the tunneling radius, and will be used to draw the dotted potential circle around the
  // nucleus (among other things).
  public readonly energyIntersectionPointProperty: Vector2Property;

  public constructor(
    model: SingleAtomModel,
    bounds: Bounds2,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: EnergyDiagramAccordionBoxOptions
  ) {

    const titleNode = new Text( NuclearDecayCommonFluent.energyDiagramStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const options = optionize<EnergyDiagramAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      showTitleWhenExpanded: false,
      titleBarExpandCollapse: false,
      contentAlign: 'center',
      contentVerticalAlign: 'top',
      contentXMargin: CONTENT_X_MARGIN,
      contentYMargin: CONTENT_Y_MARGIN,
      allowContentToOverlapTitle: true,
      left: bounds.left,
      bottom: bounds.bottom,
      minWidth: bounds.right - bounds.left,
      resize: false,
      accessibleName: NuclearDecayCommonFluent.a11y.energyDiagram.accessibleNameStringProperty,
      accessibleHelpTextCollapsed: NuclearDecayCommonFluent.a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty
    }, providedOptions );

    // JB REVIEW: This is a hard-coded constant and should be explained.
    const graphRightX = 600;

    // Left edge inside which wellCenterX can sit without pushing the curve out of the graph region.
    const wellCenterMinX = WELL_HALF_WIDTH + POINTINESS_FACTOR;
    const wellCenterMaxX = graphRightX - WELL_HALF_WIDTH - POINTINESS_FACTOR;

    // Y-axis: upward arrow

    const yAxis = new ArrowNode( GRAPH_X_OFFSET, GRAPH_HEIGHT / 2, GRAPH_X_OFFSET, -GRAPH_HEIGHT / 2, {
      stroke: 'black',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1
    } );

    // X-axis: rightward arrow (long); extended to match graphRightXProperty below.

    const xAxis = new ArrowNode( -GRAPH_X_OFFSET, 0, graphRightX, 0, {
      stroke: 'black',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1,
      doubleHead: true
    } );

    // Axis labels

    const energyAxisLabel = new Text( NuclearDecayCommonFluent.energyStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      rotation: -Math.PI / 2,
      centerX: GRAPH_X_OFFSET - 15,
      centerY: GRAPH_HEIGHT / 2 - 20,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const distanceAxisLabel = new Text( NuclearDecayCommonFluent.distanceStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      centerY: 10,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH,
      right: graphRightX - 15
    } );

    const legend = new EnergyDiagramLegendNode( model.hasDecayOccurredProperty, {
      tandem: options.tandem.createTandem( 'legend' ),
      x: LEGEND_X,
      y: LEGEND_Y
    } );

    // Graph lines

    // Potential energy curve: Coulomb asymptote → quadratic up to barrier peak → straight down into well →
    // flat bottom → straight up → quadratic back down to Coulomb asymptote. Mirrors the Java AlphaDecayEnergyChart.
    // Well center is driven by the MVT so that it stays aligned with model x=0 (the atom position). The barrier
    // peak Y is driven by potentialEnergyProperty so only the tip of the curve rises/falls; the well bottom and
    // Coulomb asymptotes stay fixed.
    const potentialEnergyGraphCurve = new Path( null, {
      stroke: NuclearDecayCommonColors.potentialEnergyProperty,
      lineWidth: 4,
      visibleProperty: model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty )
    } );

    // Double-headed vertical arrow for dragging the potential energy barrier height.
    // Only visible in custom isotope mode. Dragging up increases potentialEnergyProperty.
    const potentialEnergyGrabber = new EnergyGrabberNode( model.potentialEnergyProperty, model, {
      x: graphRightX - 120,
      tandem: options.tandem.createTandem( 'potentialEnergyGrabber' ),
      accessibleName: NuclearDecayCommonFluent.potentialEnergyStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.potentialEnergySlider.accessibleHelpTextStringProperty
    } );

    const potentialEnergyHeightIndicator = new Line( 0, 0, 0, 0, {
      lineDash: [ 5, 5 ],
      lineWidth: 2,
      stroke: NuclearDecayCommonColors.potentialEnergyProperty,
      visibleProperty: new DerivedProperty(
        [ model.isPlayAreaEmptyProperty, model.selectedIsotopeProperty ], ( isEmpty, isotope ) => {
          return !isEmpty && isotope === 'custom';
        } )
    } );

    // Double-headed vertical arrow for dragging the initial energy level.
    // Only visible in custom isotope mode. Dragging up increases initialEnergyProperty.
    const initialEnergyGrabber = new EnergyGrabberNode( model.initialEnergyProperty, model, {
      x: graphRightX - 80,
      tandem: options.tandem.createTandem( 'initialEnergyGrabber' ),
      accessibleName: NuclearDecayCommonFluent.initialEnergyStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.initialEnergySlider.accessibleHelpTextStringProperty
    } );

    const initialEnergyGraphLine = new Line( -GRAPH_X_OFFSET, 0, graphRightX, 0, {
      stroke: NuclearDecayCommonColors.initialEnergyColorProperty,
      lineWidth: 2,
      visibleProperty: model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty )
    } );

    const finalEnergyGraphLine = new Line( -GRAPH_X_OFFSET, FINAL_ENERGY_HEIGHT, graphRightX, FINAL_ENERGY_HEIGHT, {
      stroke: NuclearDecayCommonColors.finalEnergyProperty,
      lineWidth: 2,
      lineDash: [ 7, 7 ],
      visibleProperty: model.hasDecayOccurredProperty
    } );

    const energyIntersectionPointProperty = new Vector2Property( Vector2.ZERO, {
      tandem: Tandem.OPT_OUT
    } );

    // Static accessible description, always visible when the accordion box is expanded.
    const staticDescriptionNode = new Node( {
      accessibleParagraph: NuclearDecayCommonFluent.a11y.energyDiagram.staticDescriptionStringProperty
    } );

    // Assemble
    const beforeDecayDescriptionVisibleProperty = new DerivedProperty(
      [ model.hasDecayOccurredProperty, model.isPlayAreaEmptyProperty, model.selectedIsotopeProperty ],
      ( hasDecayOccurred, isPlayAreaEmpty, selectedIsotope ) => {
        return !hasDecayOccurred && !isPlayAreaEmpty && selectedIsotope !== 'custom';
      }
    );
    const afterDecayDescriptionVisibleProperty = new DerivedProperty(
      [ model.hasDecayOccurredProperty, model.isPlayAreaEmptyProperty ],
      ( hasDecayOccurred, isPlayAreaEmpty ) => {
        return hasDecayOccurred && !isPlayAreaEmpty;
      }
    );

    const contentsNode = new Node( {
      children: [
        staticDescriptionNode,
        energyAxisLabel,
        distanceAxisLabel,
        legend,
        initialEnergyGraphLine,
        potentialEnergyGraphCurve,
        yAxis,
        xAxis,
        initialEnergyGrabber,
        potentialEnergyHeightIndicator,
        potentialEnergyGrabber,
        finalEnergyGraphLine
      ],
      accessibleTemplate: AccessibleList.createTemplateProperty( {
        listItems: [

          // BEFORE DECAY
          // Initial energy is ... potential energy barrier height
          {
            stringProperty: NuclearDecayCommonFluent.a11y.energyDiagram.beforeDecay.initialEnergy.createProperty( {
              position: model.initialEnergyProperty
            } ), visibleProperty: beforeDecayDescriptionVisibleProperty
          },
          // Alpha particle escape distance is ...
          {
            stringProperty: NuclearDecayCommonFluent.a11y.energyDiagram.beforeDecay.escapeDistance.createProperty( {
              distance: model.escapeDistanceProperty
            } ), visibleProperty: beforeDecayDescriptionVisibleProperty
          },

          // AFTER DECAY
          // Final energy lower
          {
            stringProperty: NuclearDecayCommonFluent.a11y.energyDiagram.afterDecay.finalEnergyStringProperty,
            visibleProperty: afterDecayDescriptionVisibleProperty
          },
          // Alpha particle escape distance is ...
          {
            stringProperty: NuclearDecayCommonFluent.a11y.energyDiagram.afterDecay.escapeDistance.createProperty( {
              distance: model.escapeDistanceProperty
            } ), visibleProperty: afterDecayDescriptionVisibleProperty
          },
          // Potential well is deeper
          {
            stringProperty: NuclearDecayCommonFluent.a11y.energyDiagram.afterDecay.potentialWellStringProperty,
            visibleProperty: afterDecayDescriptionVisibleProperty
          }
        ]
      } )
    } );

    // --- initialEnergyGrabber interaction ---
    //
    // The initial energy line sits at screen-y = value * ENERGY_PEAK_Y (ENERGY_PEAK_Y is negative, so higher values
    // move the line upward). Inverting: value = localY / ENERGY_PEAK_Y.
    //
    // contentsNode is defined below; safe to reference because these callbacks only fire at runtime.

    // Pointer drag: convert absolute pointer position to an initialEnergyProperty value.
    initialEnergyGrabber.addInputListener( new DragListener( {
      tandem: Tandem.OPT_OUT,
      drag: event => {
        const localY = contentsNode.globalToLocalPoint( event.pointer.point ).y;
        const value = localY / ENERGY_PEAK_Y;
        model.initialEnergyProperty.value = clamp( value, model.initialEnergyProperty.range.min, model.initialEnergyProperty.range.max );
      },
      start: () => {
        model.isUserInteractingProperty.value = true;
      },
      end: () => {
        model.isUserInteractingProperty.value = false;
      }
    } ) );

    // --- potentialEnergyGrabber interaction ---
    //
    // The barrier peak sits at screen-y = ENERGY_PEAK_Y * value / range.max + COULOMB_MIN_Y.
    // Inverting: value = (localY − COULOMB_MIN_Y) / ENERGY_PEAK_Y * range.max.

    // Pointer drag: convert absolute pointer position to a potentialEnergyProperty value.
    potentialEnergyGrabber.addInputListener( new DragListener( {
      tandem: Tandem.OPT_OUT,
      drag: event => {
        const localY = contentsNode.globalToLocalPoint( event.pointer.point ).y;
        const value = ( localY - COULOMB_MIN_Y ) / ENERGY_PEAK_Y * model.potentialEnergyProperty.range.max;
        model.potentialEnergyProperty.value = clamp( value, model.potentialEnergyProperty.range.min, model.potentialEnergyProperty.range.max );
      },
      start: () => {
        model.isUserInteractingProperty.value = true;
      },
      end: () => {
        model.isUserInteractingProperty.value = false;
      }
    } ) );

    super( contentsNode, options );

    this.energyIntersectionPointProperty = energyIntersectionPointProperty;

    // Set the tunneling radius for the atom as the graph changes.
    energyIntersectionPointProperty.link( point => {

      // Convert intersection point x coordinate (view bounds) to model magnitude
      model.atomPool.forEach( atom => {
        const intersectionPointModelDeltaX = modelViewTransformProperty.value.viewToModelDeltaX( point.x );
        atom = model.atomPool[ 0 ];
        affirm( atom, 'there should be an atom' );
        model.atomPool[ 0 ].ejectedParticleTunnelingRadius = intersectionPointModelDeltaX;
      } );
    } );

    const contentOriginX = this.x + contentsNode.x;

    const wellCenterXProperty = modelViewTransformProperty.derived( mvt => {
      return clamp( mvt.modelToViewX( 0 ) - contentOriginX, wellCenterMinX, wellCenterMaxX );
    } );

    // Multilink to update the energy shapes and find their intersection
    Multilink.multilink(
      [ wellCenterXProperty, model.potentialEnergyProperty, model.initialEnergyProperty ],
      ( wellCenterX: number, potentialEnergy: number, initialEnergy: number ) => {

        const peakY = ENERGY_PEAK_Y * potentialEnergy / model.potentialEnergyProperty.range.max + COULOMB_MIN_Y;

        potentialEnergyGrabber.centerY = peakY;

        potentialEnergyHeightIndicator.setLine( wellCenterX + WELL_HALF_WIDTH, peakY, potentialEnergyGrabber.x + 20, peakY );

        potentialEnergyGraphCurve.shape = new Shape()
          .moveTo( -GRAPH_X_OFFSET, COULOMB_MIN_Y )
          .quadraticCurveTo(
            wellCenterX - WELL_HALF_WIDTH - POINTINESS_FACTOR, CURVINESS_FACTOR * peakY,
            wellCenterX - WELL_HALF_WIDTH, peakY
          )
          .lineTo( wellCenterX - WELL_HALF_WIDTH, WELL_BOTTOM_Y )
          .lineTo( wellCenterX + WELL_HALF_WIDTH, WELL_BOTTOM_Y )
          .lineTo( wellCenterX + WELL_HALF_WIDTH, peakY )
          .quadraticCurveTo(
            wellCenterX + WELL_HALF_WIDTH + POINTINESS_FACTOR, CURVINESS_FACTOR * peakY,
            graphRightX, COULOMB_MIN_Y
          );

        // Higher initial-energy value raises the line (screen-Y is inverted).
        const initialEnergyHeight = initialEnergy * ENERGY_PEAK_Y;
        initialEnergyGraphLine.y = initialEnergyHeight;
        initialEnergyGrabber.centerY = initialEnergyHeight;

        // A ray at the height of the initial energy, directed horizontally into the potential energy curve.
        const initialEnergyRay = new Ray2(
          new Vector2( 0, initialEnergyHeight ),
          new Vector2( 1, 0 )
        );

        // Multiple intersections found due to the well shape; only the first (leftmost) is used.
        const intersections = potentialEnergyGraphCurve.shape.intersection( initialEnergyRay );
        if ( intersections.length !== 0 ) {
          const point = intersections[ 0 ].point;
          if ( point.y < INTERSECTION_THRESHOLD ) {

            // Make sure the intersection is above the X axis, otherwise it could be inside the well walls
            energyIntersectionPointProperty.value = new Vector2(
              Math.abs( point.x - wellCenterX ), point.y );
          }
          else {

            // Make the escape distance very huge
            energyIntersectionPointProperty.value = new Vector2( MAX_ESCAPE_DISTANCE, 0 );
          }
        }
        else {
          // No intersection cases

          if ( initialEnergyGraphLine.y < ENERGY_PEAK_Y ) {

            // No intersection and energy above well — dotted circle assumes the size of the well.
            energyIntersectionPointProperty.value = new Vector2( WELL_HALF_WIDTH, 0 );
          }
          else {

            // No intersection and energy is negative — assume max escape distance
            energyIntersectionPointProperty.value = new Vector2( MAX_ESCAPE_DISTANCE, 0 );
          }
        }
      }
    );
  }
}
