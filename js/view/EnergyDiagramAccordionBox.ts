// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the EnergyDiagram title as well as the alpha particle energy diagram.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Multilink from '../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import { clamp } from '../../../dot/js/util/clamp.js';
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

const CONTENT_X_MARGIN = 50;
const CONTENT_Y_MARGIN = 20;

// Height of the graph region (y-axis length). Kept constant; width is derived from provided bounds.
const GRAPH_HEIGHT = 160;

// Left margin inside the content: room for the rotated "Energy" label and the left side of the x-axis arrow.
const GRAPH_X_OFFSET = 15;

// Legend
const LEGEND_LINE_LENGTH = 22;
const LEGEND_X = GRAPH_X_OFFSET + 10;
const LEGEND_Y = 14;
const LEGEND_LINE_SPACING = 18;
const LEGEND_TEXT_OFFSET = LEGEND_LINE_LENGTH + 6;

const MAX_INITIAL_ENERGY_HEIGHT = GRAPH_HEIGHT * 0.3;

// Potential energy curve parameters (screen coordinates: negative Y = higher energy)
const WELL_HALF_WIDTH = 45; // half-width of the flat-bottomed well
const COULOMB_MIN_Y = -5; // asymptotic Coulomb energy at large distance (just above x-axis)
const POTENTIAL_PEAK_Y = -GRAPH_HEIGHT * 0.4; // top of the Coulomb barrier (above initial energy line)
const WELL_BOTTOM_Y = GRAPH_HEIGHT * 0.4; // bottom of the nuclear potential well (below x-axis)
const POINTINESS_FACTOR = 25; // sharpness of the quadratic curve at the barrier peak. 0 = max pointiness, 100 least.
const CURVINESS_FACTOR = 0; // how curvy the potential energy curve is at the barrier peak. 0 = very curvy, rapid falloff, 1 = closer to a straight line.

export default class EnergyDiagramAccordionBox extends NuclearDecayAccordionBox {
  public constructor(
    model: SingleAtomDecayModel,
    bounds: Bounds2,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: EnergyDiagramAccordionBoxOptions
  ) {
    const options = optionize<EnergyDiagramAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      contentAlign: 'left',
      contentVerticalAlign: 'top',
      contentXMargin: CONTENT_X_MARGIN,
      contentYMargin: CONTENT_Y_MARGIN,
      allowContentToOverlapTitle: true,
      left: bounds.left,
      bottom: bounds.bottom,
      resize: false,
      accessibleName: NuclearDecayCommonFluent.a11y.energyDiagram.accessibleNameStringProperty,
      accessibleHelpTextCollapsed: NuclearDecayCommonFluent.a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty
    }, providedOptions );

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
      accessibleName: NuclearDecayCommonFluent.initialEnergyStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.initialEnergySlider.accessibleHelpTextStringProperty
    } );

    const potentialEnergySlider = new VSlider( model.potentialEnergyProperty, model.potentialEnergyProperty.range, {
      trackSize: sliderTrackSize,
      thumbSize: sliderThumbSize,
      enabledProperty: slidersEnabledProperty,
      tandem: options.tandem.createTandem( 'potentialEnergySlider' ),
      accessibleName: NuclearDecayCommonFluent.a11y.potentialEnergyBarrierHeightStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.potentialEnergySlider.accessibleHelpTextStringProperty
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
      right: bounds.right - CONTENT_X_MARGIN,
      centerY: 0,
      visibleProperty: model.selectedIsotopeProperty.derived( isotope => isotope === 'custom' )
    } );

    // Graph width is derived from the provided bounds so the box fits between the screen's left edge and the
    // time controls on the bottom-right. In custom mode, reserve SLIDER_REGION_WIDTH on the right for the
    // vertical sliders; otherwise the chart extends to fill that space.
    const fullGraphRightX = bounds.right - CONTENT_X_MARGIN;
    const customGraphRightX = slidersBox.left - CONTENT_X_MARGIN;

    const graphRightXProperty = model.selectedIsotopeProperty.derived(
      isotope => isotope === 'custom' ? customGraphRightX : fullGraphRightX
    );

    // Left edge inside which WELL_CENTER_X can sit without pushing the curve out of the graph region.
    const wellCenterMinX = WELL_HALF_WIDTH + POINTINESS_FACTOR;

    // Y-axis: upward arrow

    const yAxis = new ArrowNode( GRAPH_X_OFFSET, GRAPH_HEIGHT / 2, GRAPH_X_OFFSET, -GRAPH_HEIGHT / 2, {
      stroke: 'black',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1
    } );

    // X-axis: rightward arrow (long); extended to match graphRightXProperty below.

    const xAxis = new ArrowNode( -GRAPH_X_OFFSET, 0, fullGraphRightX, 0, {
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
    // Well center is driven by the MVT so that it stays aligned with model x=0 (the atom position). The barrier
    // peak Y is driven by potentialEnergyProperty so only the tip of the curve rises/falls; the well bottom and
    // Coulomb asymptotes stay fixed.
    const potentialEnergyGraphCurve = new Path( null, {
      stroke: NuclearDecayCommonColors.potentialEnergyProperty,
      lineWidth: 4,
      visibleProperty: model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty )
    } );

    Multilink.multilink(
      [ modelViewTransformProperty, model.potentialEnergyProperty, graphRightXProperty ],
      ( mvt, value, graphRightX ) => {

        // Convert model x=0 into the content's local coordinate system: box.left + contentXMargin positions the
        // content, and the leftmost drawn element (x-axis) starts at local -GRAPH_X_OFFSET, so local x=0 is
        // (CONTENT_X_MARGIN + GRAPH_X_OFFSET) to the right of bounds.left. Clamp so the curve stays within graph.
        const wellCenterMaxX = graphRightX - WELL_HALF_WIDTH - POINTINESS_FACTOR;
        const wellCenterX = clamp(
          mvt.modelToViewX( 0 ) - bounds.left - CONTENT_X_MARGIN - GRAPH_X_OFFSET,
          wellCenterMinX, wellCenterMaxX
        );

        const peakY = POTENTIAL_PEAK_Y * value / model.potentialEnergyProperty.range.max + COULOMB_MIN_Y;
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
      }
    );

    const initialEnergyGraphLine = new Path( null, {
      stroke: NuclearDecayCommonColors.initialEnergyColorProperty,
      lineWidth: 2,
      visibleProperty: model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty )
    } );

    // Rebuild the x-axis, distance label position, and initial-energy line when the chart width changes.
    graphRightXProperty.link( graphRightX => {
      xAxis.setTailAndTip( -GRAPH_X_OFFSET, 0, graphRightX, 0 );
      distanceAxisLabel.right = graphRightX - 15;
      initialEnergyGraphLine.shape = new Shape().moveTo( -GRAPH_X_OFFSET, 0 ).lineTo( graphRightX, 0 );
    } );

    // Higher initial-energy value raises the line (screen-Y is inverted).
    model.initialEnergyProperty.link( value => { initialEnergyGraphLine.y = -value * MAX_INITIAL_ENERGY_HEIGHT; } );

    // Static accessible description, always visible when the accordion box is expanded.
    const staticDescriptionNode = new Node( {
      accessibleParagraph: NuclearDecayCommonFluent.a11y.energyDiagram.staticDescriptionStringProperty
    } );

    // Assemble

    const contentsNode = new Node( {
      children: [
        staticDescriptionNode,
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
