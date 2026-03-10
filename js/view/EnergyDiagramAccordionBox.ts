// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the EnergyDiagram title as well as the alpha particle energy diagram.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type EnergyDiagramAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

// Fonts
const AXIS_FONT = new PhetFont( 14 );
const SUBTITLE_FONT = new PhetFont( { size: 14, weight: 'bold' } );
const LEGEND_FONT = new PhetFont( 14 );

// Graph dimensions (adjust these to tune the layout)
const GRAPH_WIDTH = 400;    // length of the horizontal distance axis
const GRAPH_HEIGHT = 140;    // height of the vertical energy axis

// Left margin: room for the rotated "Energy" label
const GRAPH_X_OFFSET = 15;

// Legend
const LEGEND_LINE_LENGTH = 22;
const LEGEND_X = GRAPH_X_OFFSET + 10;
const LEGEND_Y = 14;
const LEGEND_LINE_SPACING = 18;
const LEGEND_TEXT_OFFSET = LEGEND_LINE_LENGTH + 6;

export default class EnergyDiagramAccordionBox extends NuclearDecayAccordionBox {
  public constructor( providedOptions?: EnergyDiagramAccordionBoxOptions ) {
    const options = optionize<EnergyDiagramAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      // Default options go here
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
      font: AXIS_FONT,
      rotation: -Math.PI / 2,
      centerX: GRAPH_X_OFFSET - 15,
      centerY: GRAPH_HEIGHT / 2 - 20
    } );

    const distanceAxisLabel = new Text( NuclearDecayCommonFluent.distanceStringProperty, {
      font: AXIS_FONT,
      right: GRAPH_X_OFFSET + GRAPH_WIDTH - 15,
      centerY: 10
    } );

    // Subtitle: "Alpha Particle Energy"

    const subtitleText = new Text( NuclearDecayCommonFluent.alphaParticleEnergyStringProperty, {
      font: SUBTITLE_FONT,
      left: LEGEND_X,
      top: LEGEND_Y
    } );

    // Legend lines and labels

    const initialEnergyLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( LEGEND_LINE_LENGTH, 0 ),
      {
        stroke: NuclearDecayCommonColors.pinkProperty,
        lineWidth: 2,
        left: LEGEND_X,
        centerY: LEGEND_Y + LEGEND_LINE_SPACING + subtitleText.height
      }
    );

    const initialEnergyLabel = new Text( NuclearDecayCommonFluent.initialEnergyStringProperty, {
      font: LEGEND_FONT,
      left: LEGEND_X + LEGEND_TEXT_OFFSET,
      centerY: initialEnergyLine.centerY
    } );

    const potentialEnergyLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( LEGEND_LINE_LENGTH, 0 ),
      {
        stroke: NuclearDecayCommonColors.blueProperty,
        lineWidth: 2,
        left: LEGEND_X,
        centerY: initialEnergyLine.centerY + LEGEND_LINE_SPACING
      }
    );

    const potentialEnergyLabel = new Text( NuclearDecayCommonFluent.finalEnergyStringProperty, {
      font: LEGEND_FONT,
      left: LEGEND_X + LEGEND_TEXT_OFFSET,
      centerY: potentialEnergyLine.centerY
    } );

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
        potentialEnergyLabel
      ]
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'EnergyDiagramAccordionBox', EnergyDiagramAccordionBox );
