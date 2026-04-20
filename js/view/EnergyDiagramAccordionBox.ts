// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the EnergyDiagram title as well as the alpha particle energy diagram.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VSlider from '../../../sun/js/VSlider.js';
import SingleAtomDecayModel from '../model/SingleAtomDecayModel.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type EnergyDiagramAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

// Graph dimensions (adjust these to tune the layout)
const GRAPH_WIDTH = 500;    // length of the horizontal distance axis
const GRAPH_HEIGHT = 160;    // height of the vertical energy axis

// Left margin: room for the rotated "Energy" label
const GRAPH_X_OFFSET = 15;

// Legend
const LEGEND_LINE_LENGTH = 22;
const LEGEND_X = GRAPH_X_OFFSET + 10;
const LEGEND_Y = 14;
const LEGEND_LINE_SPACING = 18;
const LEGEND_TEXT_OFFSET = LEGEND_LINE_LENGTH + 6;

const MAX_INITIAL_ENERGY_HEIGHT = GRAPH_HEIGHT * 0.3;

// Potential energy curve parameters (screen coordinates: negative Y = higher energy)
const WELL_CENTER_X = GRAPH_X_OFFSET + GRAPH_WIDTH * 0.5 - 5; // horizontal center of the nuclear well
const WELL_HALF_WIDTH = 45; // half-width of the flat-bottomed well
const COULOMB_MIN_Y = -5; // asymptotic Coulomb energy at large distance (just above x-axis)
const POTENTIAL_PEAK_Y = -GRAPH_HEIGHT * 0.4; // top of the Coulomb barrier (above initial energy line)
const WELL_BOTTOM_Y = GRAPH_HEIGHT * 0.4; // bottom of the nuclear potential well (below x-axis)
const POINTINESS_FACTOR = 25; // sharpness of the quadratic curve at the barrier peak. 0 = max pointiness, 100 least.
const CURVINESS_FACTOR = 0; // how curvy the potential energy curve is at the barrier peak. 0 = very curvy, rapid falloff, 1 = closer to a straight line.

export default class EnergyDiagramAccordionBox extends NuclearDecayAccordionBox {
  public constructor(
    model: SingleAtomDecayModel,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: EnergyDiagramAccordionBoxOptions
  ) {
    const options = optionize<EnergyDiagramAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      contentAlign: 'left',
      contentVerticalAlign: 'top',
      contentXMargin: 50,
      contentYMargin: 20,
      allowContentToOverlapTitle: true
    }, providedOptions );

    // Y-axis: upward arrow

    const yAxis = new ArrowNode( GRAPH_X_OFFSET, GRAPH_HEIGHT / 2, GRAPH_X_OFFSET, -GRAPH_HEIGHT / 2, {
      stroke: 'black',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1
    } );

    // X-axis: rightward arrow (long)

    const xAxis = new ArrowNode( -GRAPH_X_OFFSET, 0, GRAPH_X_OFFSET + GRAPH_WIDTH, 0, {
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
      right: GRAPH_X_OFFSET + GRAPH_WIDTH - 15,
      centerY: 10,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Subtitle: "Alpha Particle Energy"

    const subtitleText = new Text( NuclearDecayCommonFluent.alphaParticleEnergyStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_BOLD_FONT,
      left: LEGEND_X,
      top: LEGEND_Y,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Legend lines and labels

    const initialEnergyLegendLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( LEGEND_LINE_LENGTH, 0 ),
      {
        stroke: NuclearDecayCommonColors.initialEnergyColorProperty,
        lineWidth: 2,
        left: LEGEND_X,
        centerY: LEGEND_Y + LEGEND_LINE_SPACING + subtitleText.height
      }
    );

    const initialEnergyLabel = new Text( NuclearDecayCommonFluent.initialEnergyStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      left: LEGEND_X + LEGEND_TEXT_OFFSET,
      centerY: initialEnergyLegendLine.centerY,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const potentialEnergyLegendLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( LEGEND_LINE_LENGTH, 0 ),
      {
        stroke: NuclearDecayCommonColors.potentialEnergyProperty,
        lineWidth: 4,
        left: LEGEND_X,
        centerY: initialEnergyLegendLine.centerY + LEGEND_LINE_SPACING
      }
    );

    const potentialEnergyLabel = new Text( NuclearDecayCommonFluent.potentialEnergyStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      left: LEGEND_X + LEGEND_TEXT_OFFSET,
      centerY: potentialEnergyLegendLine.centerY,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Graph lines

    // Potential energy curve: Coulomb asymptote → quadratic up to barrier peak → straight down into well →
    // flat bottom → straight up → quadratic back down to Coulomb asymptote. Mirrors the Java AlphaDecayEnergyChart.
    // The barrier peak Y is driven by potentialEnergyProperty so only the tip of the curve rises/falls; the
    // well bottom and Coulomb asymptotes stay fixed.
    const potentialEnergyGraphCurve = new Path( null, {
      stroke: NuclearDecayCommonColors.potentialEnergyProperty,
      lineWidth: 4,
      visibleProperty: model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty )
    } );

    model.potentialEnergyProperty.link( value => {
      const peakY = POTENTIAL_PEAK_Y * value / model.potentialEnergyProperty.range.max + COULOMB_MIN_Y;
      potentialEnergyGraphCurve.shape = new Shape()
        .moveTo( -GRAPH_X_OFFSET, COULOMB_MIN_Y )
        .quadraticCurveTo(
          WELL_CENTER_X - WELL_HALF_WIDTH - POINTINESS_FACTOR, CURVINESS_FACTOR * peakY,
          WELL_CENTER_X - WELL_HALF_WIDTH, peakY
        )
        .lineTo( WELL_CENTER_X - WELL_HALF_WIDTH, WELL_BOTTOM_Y )
        .lineTo( WELL_CENTER_X + WELL_HALF_WIDTH, WELL_BOTTOM_Y )
        .lineTo( WELL_CENTER_X + WELL_HALF_WIDTH, peakY )
        .quadraticCurveTo(
          WELL_CENTER_X + WELL_HALF_WIDTH + POINTINESS_FACTOR, CURVINESS_FACTOR * peakY,
          GRAPH_X_OFFSET + GRAPH_WIDTH, COULOMB_MIN_Y
        );
    } );

    const initialEnergyGraphLine = new Path(
      new Shape().moveTo( -GRAPH_X_OFFSET, 0 ).lineTo( GRAPH_X_OFFSET + GRAPH_WIDTH, 0 ),
      {
        stroke: NuclearDecayCommonColors.initialEnergyColorProperty,
        lineWidth: 2,
        visibleProperty: model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty )
      }
    );

    // Higher initial-energy value raises the line (screen-Y is inverted).
    model.initialEnergyProperty.link( value => { initialEnergyGraphLine.y = -value * MAX_INITIAL_ENERGY_HEIGHT; } );

    // Sliders to the right of the graph that drive the vertical position of each energy line.

    const sliderTrackSize = new Dimension2( 4, GRAPH_HEIGHT * 0.75 );
    const sliderThumbSize = new Dimension2( 20, 12 );
    const sliderIconShape = new Shape().moveTo( 0, 0 ).lineTo( LEGEND_LINE_LENGTH, 0 );
    const slidersEnabledProperty = model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty );

    const initialEnergySlider = new VSlider( model.initialEnergyProperty, model.initialEnergyProperty.range, {
      trackSize: sliderTrackSize,
      thumbSize: sliderThumbSize,
      enabledProperty: slidersEnabledProperty,
      tandem: options.tandem.createTandem( 'initialEnergySlider' ),
      accessibleName: NuclearDecayCommonFluent.initialEnergyStringProperty
    } );

    const potentialEnergySlider = new VSlider( model.potentialEnergyProperty, model.potentialEnergyProperty.range, {
      trackSize: sliderTrackSize,
      thumbSize: sliderThumbSize,
      enabledProperty: slidersEnabledProperty,
      tandem: options.tandem.createTandem( 'potentialEnergySlider' ),
      accessibleName: NuclearDecayCommonFluent.potentialEnergyStringProperty
    } );

    const initialEnergySliderControl = new VBox( {
      spacing: 4,
      children: [
        new Path( sliderIconShape, { stroke: NuclearDecayCommonColors.initialEnergyColorProperty, lineWidth: 2 } ),
        initialEnergySlider
      ]
    } );

    const potentialEnergySliderControl = new VBox( {
      spacing: 4,
      children: [
        new Path( sliderIconShape, { stroke: NuclearDecayCommonColors.potentialEnergyProperty, lineWidth: 4 } ),
        potentialEnergySlider
      ]
    } );

    const slidersBox = new HBox( {
      spacing: 15,
      children: [ initialEnergySliderControl, potentialEnergySliderControl ],
      left: GRAPH_X_OFFSET + GRAPH_WIDTH + 25,
      centerY: 0,
      visibleProperty: model.selectedIsotopeProperty.derived( isotope => isotope === 'custom' )
    } );

    // Assemble

    const contentsNode = new Node( {
      children: [
        yAxis,
        xAxis,
        energyAxisLabel,
        distanceAxisLabel,
        subtitleText,
        initialEnergyLegendLine,
        initialEnergyLabel,
        potentialEnergyLegendLine,
        potentialEnergyLabel,
        potentialEnergyGraphCurve,
        initialEnergyGraphLine,
        slidersBox
      ]
    } );

    super( contentsNode, options );
  }
}
