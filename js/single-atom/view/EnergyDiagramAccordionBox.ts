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
import dotRandom from '../../../../dot/js/dotRandom.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import AccessibleList from '../../../../scenery-phet/js/accessibility/AccessibleList.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EjectedDecayParticle from '../../common/model/EjectedDecayParticle.js';
import AlphaParticleNode from '../../common/view/AlphaParticleNode.js';
import DynamicNucleusNode from '../../common/view/DynamicNucleusNode.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from '../../common/view/NuclearDecayAccordionBox.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import SingleAtomModel from '../model/SingleAtomModel.js';
import EnergyDiagramLegendNode from './EnergyDiagramLegendNode.js';
import EnergyGrabberNode from './EnergyGrabberNode.js';

type SelfOptions = {
  nucleonRadius?: number; // radius of the nucleons that dance on the energy line
};

export type EnergyDiagramAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

const CONTENT_X_MARGIN = 10;
const CONTENT_Y_MARGIN = 20;

// Height of the graph region (y-axis length). Kept constant; width is derived from provided bounds.
const GRAPH_HEIGHT = 160;

// Fraction of GRAPH_HEIGHT that lies above the x-axis (positive-energy region).
// 0.5 → equal split; increase to give more room to the positive region, decrease for more negative room.
const X_AXIS_AT_HEIGHT = 0.4;

// Left margin inside the content: room for the rotated "Energy" label and the left side of the x-axis arrow.
const GRAPH_X_OFFSET = 15;

// Legend
const LEGEND_X = GRAPH_X_OFFSET + 10;
const LEGEND_Y = 25;

// Potential energy curve parameters (screen coordinates: negative Y = higher energy)
export const MAX_ESCAPE_DISTANCE = 1000; // used when alpha particle energy is above the barrier, so the intersection point is off the graph
const INTERSECTION_THRESHOLD = -0.4; // Below this, the intersection between curves might accidentally land in the well
const COULOMB_MIN_Y = 0; // asymptotic Coulomb energy at large distance (just above x-axis)
const ENERGY_PEAK_Y = -GRAPH_HEIGHT * X_AXIS_AT_HEIGHT * 0.8; // top of the Coulomb barrier (above alpha particle energy line)
const WELL_BOTTOM_Y = GRAPH_HEIGHT * ( 1 - X_AXIS_AT_HEIGHT ) * NuclearDecayCommonConstants.WELL_DEPTH; // bottom of the nuclear potential well (below x-axis)
const POINTINESS_FACTOR = 25; // sharpness of the quadratic curve at the barrier peak. 0 = max pointiness, 100 least.
const CURVINESS_FACTOR = 0; // how curvy the potential energy curve is at the barrier peak. 0 = very curvy, rapid falloff, 1 = closer to a straight line.

export default class EnergyDiagramAccordionBox extends NuclearDecayAccordionBox {

  // This property tracks the position where initial and potential energies first intersect to the left of the well.
  // This essentially defines the tunneling radius, and will be used to draw the dotted potential circle around the
  // nucleus (among other things).
  public readonly energyIntersectionPointProperty: Vector2Property;

  public constructor(
    model: SingleAtomModel,
    dynamicNucleusNode: DynamicNucleusNode,
    bounds: Bounds2,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: EnergyDiagramAccordionBoxOptions
  ) {

    affirm( model.atomPool.length === 1, 'this graph handles only 1 atom' );
    const atom = model.atomPool[ 0 ];

    const titleNode = new Text( NuclearDecayCommonFluent.energyDiagramStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const options = optionize<EnergyDiagramAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      nucleonRadius: 5,
      titleNode: titleNode,
      showTitleWhenExpanded: false,
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

    // JB REVIEW: I don't understand the following comment. Can we improve?
    // Left edge inside which wellCenterX can sit without pushing the curve out of the graph region.
    let wellHalfWidth = modelViewTransformProperty.value.modelToViewDeltaX( NuclearDecayCommonConstants.ATOM_RADIUS );
    const wellCenterMinX = wellHalfWidth + POINTINESS_FACTOR;
    const wellCenterMaxX = graphRightX - wellHalfWidth - POINTINESS_FACTOR;

    // Y-axis: upward arrow

    const yAxis = new ArrowNode( GRAPH_X_OFFSET, GRAPH_HEIGHT * ( 1 - X_AXIS_AT_HEIGHT ), GRAPH_X_OFFSET, -GRAPH_HEIGHT * X_AXIS_AT_HEIGHT, {
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
      centerY: GRAPH_HEIGHT * ( 1 - X_AXIS_AT_HEIGHT ) - 20,
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

    const isAtomInPlayAreaProperty = model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty );

    // Potential energy curve: Coulomb asymptote → quadratic up to barrier peak → straight down into well →
    // flat bottom → straight up → quadratic back down to Coulomb asymptote. Mirrors the Java AlphaDecayEnergyChart.
    // Well center is driven by the MVT so that it stays aligned with model x=0 (the atom position). The barrier
    // peak Y is driven by potentialEnergyProperty so only the tip of the curve rises/falls; the well bottom and
    // Coulomb asymptotes stay fixed.
    const potentialEnergyGraphCurve = new Path( null, {
      stroke: NuclearDecayCommonColors.potentialEnergyProperty,
      lineWidth: 4,
      visibleProperty: isAtomInPlayAreaProperty
    } );

    // Double-headed vertical arrow for dragging the potential energy barrier height.
    // Only visible in custom isotope mode. Dragging up increases potentialEnergyProperty.
    const potentialEnergyGrabber = new EnergyGrabberNode( model.potentialEnergyProperty, model, {
      x: graphRightX - 120,
      tandem: options.tandem.createTandem( 'potentialEnergyGrabber' ),
      accessibleName: NuclearDecayCommonFluent.a11y.potentialEnergySlider.accessibleNameStringProperty,
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

    // Double-headed vertical arrow for dragging the alpha particle energy level.
    // Only visible in custom isotope mode. Dragging up increases alphaParticleEnergyProperty.
    const alphaParticleEnergyGrabber = new EnergyGrabberNode( model.alphaParticleEnergyProperty, model, {
      x: graphRightX - 80,
      tandem: options.tandem.createTandem( 'alphaParticleEnergyGrabber' ),
      accessibleName: NuclearDecayCommonFluent.a11y.alphaParticleEnergySlider.accessibleNameStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.alphaParticleEnergySlider.accessibleHelpTextStringProperty
    } );

    const alphaParticleEnergyGraphLine = new Line( -GRAPH_X_OFFSET, 0, graphRightX, 0, {
      stroke: NuclearDecayCommonColors.alphaParticleEnergyColorProperty,
      lineWidth: 2,
      visibleProperty: isAtomInPlayAreaProperty
    } );

    // Groups each grabber with its dashed/solid guide line so that the entire line is draggable, not just the
    // small grabber arrow. The line stays visible outside of custom isotope mode (as a static indicator), so
    // only the pointer area (set below, once the grabber's visibility is known) is restricted to when the
    // grabber itself is meant to be interactive.
    const potentialEnergyIndicator = new Node( {
      children: [ potentialEnergyHeightIndicator, potentialEnergyGrabber ],
      cursor: 'pointer'
    } );
    const alphaParticleEnergyIndicator = new Node( {
      children: [ alphaParticleEnergyGraphLine, alphaParticleEnergyGrabber ],
      cursor: 'pointer'
    } );

    const updatePotentialEnergyPointerArea = () => {
      const pointerArea = potentialEnergyGrabber.visible ? potentialEnergyIndicator.localBounds.dilated( 5 ) : null;
      potentialEnergyIndicator.mouseArea = pointerArea;
      potentialEnergyIndicator.touchArea = pointerArea;
    };
    potentialEnergyGrabber.visibleProperty.link( updatePotentialEnergyPointerArea );

    const updateAlphaParticleEnergyPointerArea = () => {
      const pointerArea = alphaParticleEnergyGrabber.visible ? alphaParticleEnergyIndicator.localBounds.dilated( 5 ) : null;
      alphaParticleEnergyIndicator.mouseArea = pointerArea;
      alphaParticleEnergyIndicator.touchArea = pointerArea;
    };
    alphaParticleEnergyGrabber.visibleProperty.link( updateAlphaParticleEnergyPointerArea );

    const energyIntersectionPointProperty = new Vector2Property( Vector2.ZERO, {
      tandem: Tandem.OPT_OUT
    } );

    // Static accessible description, always visible when the accordion box is expanded.
    const staticDescriptionNode = new Node( {
      accessibleParagraph: NuclearDecayCommonFluent.a11y.energyDiagram.staticDescriptionStringProperty
    } );

    // Assemble
    const beforeDecayDescriptionVisibleProperty = new DerivedProperty(
      [ model.hasDecayOccurredProperty, model.isPlayAreaEmptyProperty ],
      ( hasDecayOccurred, isPlayAreaEmpty ) => {
        return !hasDecayOccurred && !isPlayAreaEmpty;
      }
    );
    const afterDecayDescriptionVisibleProperty = new DerivedProperty(
      [ model.hasDecayOccurredProperty, model.isPlayAreaEmptyProperty ],
      ( hasDecayOccurred, isPlayAreaEmpty ) => {
        return hasDecayOccurred && !isPlayAreaEmpty;
      }
    );

    // Qualitative string for alpha particle position relative to potential energy barrier.
    const positionStringProperty = new DerivedProperty(
      [
        model.alphaParticleEnergyProperty,
        model.potentialEnergyProperty,
        NuclearDecayCommonFluent.a11y.qualitative.positionAboveStringProperty,
        NuclearDecayCommonFluent.a11y.qualitative.positionBelowStringProperty,
        NuclearDecayCommonFluent.a11y.qualitative.positionEqualToStringProperty
      ],
      ( alphaEnergy, potentialEnergy, above, below, equalTo ) => {
        if ( alphaEnergy > potentialEnergy ) { return above; }
        else if ( alphaEnergy < potentialEnergy ) { return below; }
        else { return equalTo; }
      }
    );

    // Qualitative string for escape distance, using view-space intersection point x as the measure.
    const escapeDistanceStringProperty = new DerivedProperty(
      [
        energyIntersectionPointProperty,
        NuclearDecayCommonFluent.a11y.qualitative.distanceSmallStringProperty,
        NuclearDecayCommonFluent.a11y.qualitative.distanceMediumStringProperty,
        NuclearDecayCommonFluent.a11y.qualitative.distanceLargeStringProperty,
        NuclearDecayCommonFluent.a11y.qualitative.distanceInfiniteStringProperty
      ],
      ( point, small, medium, large, infinite ) => {
        if ( point.x >= MAX_ESCAPE_DISTANCE ) { return infinite; }
        else if ( point.x >= 100 ) { return large; }
        else if ( point.x >= 50 ) { return medium; }
        else { return small; }
      }
    );

    // Before-decay list: single alpha in well, escape distance, and explanation. Visible before a decay occurs.
    const beforeDecayDescriptionNode = new Node( {
      visibleProperty: beforeDecayDescriptionVisibleProperty,
      accessibleTemplate: AccessibleList.createTemplateProperty( {
        leadingParagraphStringProperty: NuclearDecayCommonFluent.a11y.energyDiagram.beforeDecay.leadingParagraphStringProperty,
        listItems: [
          NuclearDecayCommonFluent.a11y.energyDiagram.beforeDecay.alphaParticleInWell.createProperty( {
            position: positionStringProperty
          } ),
          NuclearDecayCommonFluent.a11y.energyDiagram.beforeDecay.escapeDistance.createProperty( {
            distance: escapeDistanceStringProperty
          } ),
          NuclearDecayCommonFluent.a11y.energyDiagram.beforeDecay.escapeDistanceDescriptionStringProperty
        ]
      } )
    } );

    // After-decay paragraph: visible only once decay has occurred.
    const afterDecayDescriptionNode = new Node( {
      visibleProperty: afterDecayDescriptionVisibleProperty,
      accessibleParagraph: NuclearDecayCommonFluent.a11y.energyDiagram.afterDecay.accessibleParagraphStringProperty
    } );

    // Dashed line marking where the well bottom sat before decay; appears after decay so the deepening is apparent.
    const preDecayWellLine = new Line( 0, WELL_BOTTOM_Y, 0, WELL_BOTTOM_Y, {
      lineWidth: 2,
      stroke: 'black',
      visibleProperty: afterDecayDescriptionVisibleProperty
    } );

    const preDecayWellLabel = new Text( NuclearDecayCommonFluent.preDecayWellStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      centerY: WELL_BOTTOM_Y,
      maxWidth: 100,
      visibleProperty: afterDecayDescriptionVisibleProperty
    } );

    // Add the particlesInWell that will move around on the graph.
    const particlesInWell: Node[] = [];
    particlesInWell.push( new AlphaParticleNode( {
      nucleonDiameter: options.nucleonRadius * 2
    } ) );

    // the layer where the particles that move around on the graph will reside
    const particleLayer = new Node( {
      children: [ ...particlesInWell ],
      visibleProperty: isAtomInPlayAreaProperty
    } );

    // All particles start in the well, but some can later move out. This array is used to track that.
    const particlesOutsideWell: Node[] = [];

    const contentsNode = new Node( {
      children: [
        staticDescriptionNode,
        beforeDecayDescriptionNode,
        afterDecayDescriptionNode,
        energyAxisLabel,
        distanceAxisLabel,
        legend,
        potentialEnergyGraphCurve,
        preDecayWellLine,
        preDecayWellLabel,
        yAxis,
        xAxis,
        potentialEnergyIndicator,
        alphaParticleEnergyIndicator,
        particleLayer
      ]
    } );

    // --- alphaParticleEnergyGrabber interaction ---
    //
    // The alpha particle energy line sits at screen-y = value * ENERGY_PEAK_Y (ENERGY_PEAK_Y is negative, so higher values
    // move the line upward). Inverting: value = localY / ENERGY_PEAK_Y.
    //
    // contentsNode is defined below; safe to reference because these callbacks only fire at runtime.

    // Pointer drag: convert absolute pointer position to an alphaParticleEnergyProperty value. Attached to the
    // whole indicator (line and grabber) so the user can grab it anywhere along the line.
    alphaParticleEnergyIndicator.addInputListener( new SoundDragListener( {
      tandem: Tandem.OPT_OUT,
      drag: event => {
        const localY = contentsNode.globalToLocalPoint( event.pointer.point ).y;
        const value = localY / ENERGY_PEAK_Y;
        model.alphaParticleEnergyProperty.value = clamp( value, model.alphaParticleEnergyProperty.range.min, model.alphaParticleEnergyProperty.range.max );
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

    // Pointer drag: convert absolute pointer position to a potentialEnergyProperty value. Attached to the whole
    // indicator (line and grabber) so the user can grab it anywhere along the line.
    potentialEnergyIndicator.addInputListener( new SoundDragListener( {
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

      // Convert intersection point x coordinate (view bounds) to model magnitude.
      atom.ejectedParticleTunnelingRadius = modelViewTransformProperty.value.viewToModelDeltaX( point.x );
    } );

    const contentOriginX = this.x + contentsNode.x;

    const wellCenterXProperty = modelViewTransformProperty.derived( mvt => {
      return clamp( mvt.modelToViewX( 0 ) - contentOriginX, wellCenterMinX, wellCenterMaxX );
    } );

    // The max amount that a particle can move from the center of the well during non-tunneling movement.
    let maxParticleXDelta = wellHalfWidth - 2 * options.nucleonRadius;

    // Multilink to update the energy shapes and find their intersection
    Multilink.multilink(
      [ wellCenterXProperty, model.potentialEnergyProperty, model.alphaParticleEnergyProperty, model.hasDecayOccurredProperty ],
      ( wellCenterX: number, potentialEnergy: number, alphaParticleEnergy: number, hasDecayOccurred: boolean ) => {

        // JB REVIEW: Get rid of tweak factor by addressing root cause.
        const wellWidthTweakFactor = -5;
        wellHalfWidth = modelViewTransformProperty.value.modelToViewDeltaX( NuclearDecayCommonConstants.ATOM_RADIUS ) + wellWidthTweakFactor;

        maxParticleXDelta = wellHalfWidth - 2 * options.nucleonRadius;

        const peakY = ENERGY_PEAK_Y * potentialEnergy / model.potentialEnergyProperty.range.max + COULOMB_MIN_Y;

        // The quadratic curve has a pointy end that extends beyond the actual peak, we have to adjust for that
        const peakCorrection = -7 * potentialEnergy;

        potentialEnergyGrabber.centerY = peakY;
        potentialEnergyHeightIndicator.setLine( wellCenterX + wellHalfWidth, peakY,
          potentialEnergyGrabber.x + 20, peakY );
        updatePotentialEnergyPointerArea();

        // After decay, lower the well bottom proportionally to alpha particle energy (higher energy = deeper well).
        const wellBottomY = hasDecayOccurred
                            ? WELL_BOTTOM_Y + clamp( alphaParticleEnergy, 0, 1 ) * GRAPH_HEIGHT * X_AXIS_AT_HEIGHT
                            : WELL_BOTTOM_Y;

        potentialEnergyGraphCurve.shape = new Shape()
          .moveTo( -GRAPH_X_OFFSET, COULOMB_MIN_Y )
          .quadraticCurveTo(
            wellCenterX - wellHalfWidth - POINTINESS_FACTOR, CURVINESS_FACTOR * peakY,
            wellCenterX - wellHalfWidth, peakY - peakCorrection
          )
          .lineTo( wellCenterX - wellHalfWidth, wellBottomY )
          .lineTo( wellCenterX + wellHalfWidth, wellBottomY )
          .lineTo( wellCenterX + wellHalfWidth, peakY - peakCorrection )
          .quadraticCurveTo(
            wellCenterX + wellHalfWidth + POINTINESS_FACTOR, CURVINESS_FACTOR * peakY,
            graphRightX, COULOMB_MIN_Y
          );

        const preDecayWellLineX = wellCenterX + wellHalfWidth;
        const preDecayWellLineWidth = 15;
        preDecayWellLine.setLine( preDecayWellLineX, WELL_BOTTOM_Y, preDecayWellLineX + preDecayWellLineWidth, WELL_BOTTOM_Y );
        preDecayWellLabel.left = preDecayWellLineX + preDecayWellLineWidth + 10;

        // Higher initial-energy value raises the line (screen-Y is inverted).
        const alphaParticleEnergyHeight = alphaParticleEnergy * ENERGY_PEAK_Y;
        alphaParticleEnergyGraphLine.y = alphaParticleEnergyHeight;
        alphaParticleEnergyGrabber.centerY = alphaParticleEnergyHeight;
        updateAlphaParticleEnergyPointerArea();

        // A ray at the height of the initial energy, directed horizontally into the potential energy curve.
        const alphaParticleEnergyRay = new Ray2(
          new Vector2( 0, alphaParticleEnergyHeight ),
          new Vector2( 1, 0 )
        );

        // Multiple intersections found due to the well shape; only the first (leftmost) is used.
        const intersections = potentialEnergyGraphCurve.shape.intersection( alphaParticleEnergyRay );
        if ( intersections.length !== 0 ) {
          const point = intersections[ 0 ].point;

          // Make sure the intersection is above the X axis, otherwise it could be inside the well walls
          if ( point.y < INTERSECTION_THRESHOLD ) {

            // Since the x-axis is not necessarily at the center of the graph, adjust the intersection height
            const centerCorrection = ( X_AXIS_AT_HEIGHT - 0.5 ) * GRAPH_HEIGHT;

            energyIntersectionPointProperty.value = new Vector2( Math.abs( point.x - wellCenterX ), point.y + centerCorrection );
          }
          else {

            // Make the escape distance very huge.
            energyIntersectionPointProperty.value = new Vector2( MAX_ESCAPE_DISTANCE, 0 );
          }
        }
        else {
          // No intersection cases

          if ( alphaParticleEnergyGraphLine.y < 0 ) {

            // No intersection and energy above well — dotted circle assumes the size of the well.
            energyIntersectionPointProperty.value = new Vector2( wellHalfWidth, 0 );
          }
          else {

            // No intersection and energy is negative — assume max escape distance.
            energyIntersectionPointProperty.value = new Vector2( MAX_ESCAPE_DISTANCE, 0 );
          }
        }

        // Update the Y positions for the particles.
        particlesInWell.forEach( particle => {
          particle.centerY = alphaParticleEnergyHeight;
        } );
      }
    );

    // If the center of the well changes, the particles need to be moved within it.
    wellCenterXProperty.link( wellCenterX => {
      particlesInWell.forEach( particle => {
        particle.centerX = wellCenterX + ( dotRandom.nextDouble() - 0.5 ) * 2 * maxParticleXDelta;
      } );
    } );

    // Now that the lines for the graph are set up, set the initial positions of the particlesInWell.
    const ejectedParticleTweakFactor = -110; // JB REVIEW: Figure out why this is needed and fix the root cause.

    const getParticleX = ( ejectedParticle: EjectedDecayParticle ) => {
      const distanceFromCenter = ejectedParticle.positionProperty.value.getMagnitude();
      const sign = ejectedParticle.positionProperty.value.x > 0 ? 1 : -1;
      return modelViewTransformProperty.value.modelToViewX( sign * distanceFromCenter ) + ejectedParticleTweakFactor;
    };

    model.hasDecayOccurredProperty.link( hasDecayed => {
      particlesInWell.forEach( particle => {
        particle.centerY = alphaParticleEnergyGraphLine.centerY;
        particle.centerX = wellCenterXProperty.value + ( dotRandom.nextDouble() - 0.5 ) * 2 * maxParticleXDelta;
      } );

      if ( hasDecayed ) {

        // JB REVIEW: Does this need to be generalized to handle other types of decay?
        const ejectedParticle = atom.ejectedDecayParticles[ 0 ];
        if ( ejectedParticle ) {

          // Grab an alpha particle from our list.
          const alphaParticleNode = particlesInWell.find( particle => particle instanceof AlphaParticleNode );
          if ( alphaParticleNode ) {
            const index = particlesInWell.indexOf( alphaParticleNode );
            particlesInWell.splice( index, 1 );
            alphaParticleNode.centerX = getParticleX( ejectedParticle );
            alphaParticleNode.centerY = alphaParticleEnergyGraphLine.centerY;
            particlesOutsideWell.push( alphaParticleNode );
          }
        }
      }
      else {

        // Bring back any particles that had previously tunneled.
        if ( particlesOutsideWell.length > 0 ) {
          particlesOutsideWell.forEach( particle => {
            particlesInWell.push( particle );
            particle.center = alphaParticleEnergyGraphLine.center;
          } );
          particlesOutsideWell.length = 0;
        }
      }
    } );

    // Listen to the step emitter of the atom in the model in order to animate the particles.
    let particleAnimationTimeAccumulator = 0;
    const updatePeriod = 4 / 60; // in seconds
    atom.steppedEmitter.addListener( dt => {

      // Update any particles outside the well, which generally will be moving away from the nucleus.
      if ( particlesOutsideWell.length > 0 ) {

        affirm( particlesOutsideWell.length = 1, 'This code currently handles only one tunneled particle' );
        const ejectedParticle = atom.ejectedDecayParticles[ 0 ];
        affirm( ejectedParticle, 'expected an ejected particle' );
        particlesOutsideWell[ 0 ].centerX = getParticleX( ejectedParticle );
        particlesOutsideWell[ 0 ].centerY = alphaParticleEnergyGraphLine.centerY;
      }

      // If there are any alpha particles outside the nucleus but inside the tunneling radius in the dynamic nucleus,
      // represent that on this graph by moving an alpha particle away from center by the same amount.
      const localAlphaParticles: AlphaParticleNode[] = particlesInWell.filter( p => p instanceof AlphaParticleNode );
      localAlphaParticles.forEach( ( localAlpha, index ) => {

        // Is there an almost tunneled alpha in the dynamic nucleus?
        const almostTunnelingAlphaParticle = dynamicNucleusNode.almostTunnelingAlphaParticles[ index ];
        if ( almostTunnelingAlphaParticle ) {

          // Yes there is. Make sure our local alpha is positioned at the same distance from the center as the one in
          // the dynamic nucleus.
          const distanceFromCenter = almostTunnelingAlphaParticle.alphaParticleNode.center.getMagnitude();
          const sign = almostTunnelingAlphaParticle.alphaParticleNode.x > 0 ? 1 : -1;
          localAlpha.x = wellCenterXProperty.value + ( sign * distanceFromCenter );
          localAlpha.opacity = almostTunnelingAlphaParticle.alphaParticleNode.opacity;
        }
        else {

          // There is no almost-tunneled alpha particle that corresponds to this local alpha particle, so make sure it's
          // in the nucleus, i.e. within the well.
          if ( Math.abs( localAlpha.x - wellCenterXProperty.value ) > wellHalfWidth ) {
            localAlpha.x = wellCenterXProperty.value + ( dotRandom.nextDouble() - 0.5 ) * 2 * maxParticleXDelta;
          }
          localAlpha.opacity = 1;
        }
      } );

      particleAnimationTimeAccumulator += dt;

      if ( particleAnimationTimeAccumulator > updatePeriod ) {

        // Randomly move the particles that are inside the well.
        particlesInWell.forEach( particle => {

          // Choose randomly which particles to move, and make sure that we don't mess with alphas that are currently
          // outside the well.
          if ( dotRandom.nextDouble() > 0.25 && Math.abs( particle.x - wellCenterXProperty.value ) < wellHalfWidth ) {
            particle.centerX = wellCenterXProperty.value + ( dotRandom.nextDouble() - 0.5 ) * 2 * maxParticleXDelta;
          }
        } );

        particleAnimationTimeAccumulator = 0;
      }
    } );

    particleLayer.clipArea = Shape.bounds( new Bounds2(
      xAxis.left - CONTENT_X_MARGIN,
      yAxis.top,
      xAxis.right + CONTENT_X_MARGIN,
      yAxis.bottom
    ) );
  }
}
