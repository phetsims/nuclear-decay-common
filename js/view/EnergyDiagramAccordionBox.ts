// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the EnergyDiagram title as well as the alpha particle energy diagram.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type EnergyDiagramAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

// Graph dimensions (adjust these to tune the layout)
const GRAPH_WIDTH = 575;    // length of the horizontal distance axis
const GRAPH_HEIGHT = 140;    // height of the vertical energy axis

// Left margin: room for the rotated "Energy" label
const GRAPH_X_OFFSET = 15;

// Legend
const LEGEND_LINE_LENGTH = 22;
const LEGEND_X = GRAPH_X_OFFSET + 10;
const LEGEND_Y = 14;
const LEGEND_LINE_SPACING = 18;
const LEGEND_TEXT_OFFSET = LEGEND_LINE_LENGTH + 6;

// Potential energy curve parameters (screen coordinates: negative Y = higher energy)
const WELL_CENTER_X = GRAPH_X_OFFSET + GRAPH_WIDTH * 0.5; // horizontal center of the nuclear well
const WELL_HALF_WIDTH = 45; // half-width of the flat-bottomed well
const COULOMB_MIN_Y = -5; // asymptotic Coulomb energy at large distance (just above x-axis)
const POTENTIAL_PEAK_Y = -GRAPH_HEIGHT * 0.43; // top of the Coulomb barrier (above initial energy line)
const WELL_BOTTOM_Y = GRAPH_HEIGHT * 0.38; // bottom of the nuclear potential well (below x-axis)
const POTENTIAL_POINTINESS_FACTOR = 25; // sharpness of the quadratic curve at the barrier peak. 0 = max pointiness, 100 least.

export default class EnergyDiagramAccordionBox extends NuclearDecayAccordionBox {
  public constructor( providedOptions?: EnergyDiagramAccordionBoxOptions ) {
    const options = optionize<EnergyDiagramAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      contentAlign: 'left',
      contentXMargin: 50
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

    const initialEnergyLine = new Path(
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
      centerY: initialEnergyLine.centerY,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const potentialEnergyLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( LEGEND_LINE_LENGTH, 0 ),
      {
        stroke: NuclearDecayCommonColors.finalEnergyColorProperty,
        lineWidth: 4,
        left: LEGEND_X,
        centerY: initialEnergyLine.centerY + LEGEND_LINE_SPACING
      }
    );

    const potentialEnergyLabel = new Text( NuclearDecayCommonFluent.potentialEnergyStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      left: LEGEND_X + LEGEND_TEXT_OFFSET,
      centerY: potentialEnergyLine.centerY,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Graph lines

    // Potential energy curve: Coulomb asymptote → quadratic up to barrier peak → straight down into well →
    // flat bottom → straight up → quadratic back down to Coulomb asymptote. Mirrors the Java AlphaDecayEnergyChart.
    const potentialEnergyGraphCurve = new Path(
      new Shape()
        .moveTo( GRAPH_X_OFFSET, COULOMB_MIN_Y )
        .quadraticCurveTo(
          WELL_CENTER_X - WELL_HALF_WIDTH - POTENTIAL_POINTINESS_FACTOR, 0.5 * POTENTIAL_PEAK_Y,
          WELL_CENTER_X - WELL_HALF_WIDTH, POTENTIAL_PEAK_Y
        )
        .lineTo( WELL_CENTER_X - WELL_HALF_WIDTH, WELL_BOTTOM_Y )
        .lineTo( WELL_CENTER_X + WELL_HALF_WIDTH, WELL_BOTTOM_Y )
        .lineTo( WELL_CENTER_X + WELL_HALF_WIDTH, POTENTIAL_PEAK_Y )
        .quadraticCurveTo(
          WELL_CENTER_X + WELL_HALF_WIDTH + POTENTIAL_POINTINESS_FACTOR, 0.5 * POTENTIAL_PEAK_Y,
          GRAPH_X_OFFSET + GRAPH_WIDTH, COULOMB_MIN_Y
        ),
      {
        stroke: NuclearDecayCommonColors.finalEnergyColorProperty,
        lineWidth: 4
      }
    );

    const initialEnergyGraphLine = new Path(
      new Shape().moveTo( -GRAPH_X_OFFSET, -GRAPH_HEIGHT / 4 ).lineTo( GRAPH_X_OFFSET + GRAPH_WIDTH, -GRAPH_HEIGHT / 4 ),
      {
        stroke: NuclearDecayCommonColors.initialEnergyColorProperty,
        lineWidth: 2
      }
    );

    // Assemble

    const contentsNode = new Node( {
      children: [
        yAxis,
        xAxis,
        energyAxisLabel,
        distanceAxisLabel,
        subtitleText,
        initialEnergyLine,
        initialEnergyLabel,
        potentialEnergyLine,
        potentialEnergyLabel,
        potentialEnergyGraphCurve,
        initialEnergyGraphLine
      ]
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'EnergyDiagramAccordionBox', EnergyDiagramAccordionBox );
