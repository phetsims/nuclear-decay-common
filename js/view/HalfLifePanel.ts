// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays the half-life timeline for the current isotope, including isotope symbols on
 * the Y axis, a green half-life label, a time label, and an eraser button.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../axon/js/DynamicProperty.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../scenery-phet/js/buttons/EraserButton.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Isotope from '../model/Isotope.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = EmptySelfOptions;

export type HalfLifePanelOptions = SelfOptions & NuclearDecayPanelOptions;

// Fonts
const AXIS_FONT = new PhetFont( 14 );
const ISOTOPE_SYMBOL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const HALF_LIFE_FONT = new PhetFont( { size: 14, weight: 'bold' } );

// Graph dimensions (adjust these to tune the layout)
const GRAPH_WIDTH = 380;
const GRAPH_HEIGHT = 80;

// left margin: room for rotated label + isotope symbols
const GRAPH_X_OFFSET = 90;
const HALF_LIFE_X = GRAPH_WIDTH * 0.35; // x position of the half-life dashed line within the graph
const ISOTOPE_SYMBOL_X = 35; // x of the isotope symbol column
const AXIS_LABEL_X = 10; // x center of the rotated "Isotope" label

export default class HalfLifePanel extends NuclearDecayPanel {
  public constructor( model: NuclearDecayModel, providedOptions?: HalfLifePanelOptions ) {
    const options = optionize<HalfLifePanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
    }, providedOptions );

    // Y-axis rotated label: "Isotope"

    const isotopeAxisLabel = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: AXIS_FONT,
      rotation: -Math.PI / 2,
      centerX: AXIS_LABEL_X,
      centerY: GRAPH_HEIGHT / 2
    } );

    // Isotope symbols

    const selectedIsotopeSymbolProperty = new DynamicProperty<string, string, Isotope>(
      model.selectedIsotopeProperty, { derive: 'isotopeSymbolStringProperty' }
    );

    // TODO: Should also react when selectedIsotopeProperty itself changes https://github.com/phetsims/alpha-decay/issues/3
    const isotope = model.selectedIsotopeProperty.value;
    const decayProductSymbolProperty: TReadOnlyProperty<string> = isotope.decaysIntoProperty
      ? isotope.decaysIntoProperty.value.isotopeSymbolStringProperty
      : new Property( '--' );

    const initialIsotopeSymbol = new RichText( selectedIsotopeSymbolProperty, {
      font: ISOTOPE_SYMBOL_FONT,
      fill: NuclearDecayCommonColors.pinkProperty,
      left: ISOTOPE_SYMBOL_X,
      centerY: 0
    } );

    const decayProductSymbol = new RichText( decayProductSymbolProperty, {
      font: ISOTOPE_SYMBOL_FONT,
      left: ISOTOPE_SYMBOL_X,
      centerY: GRAPH_HEIGHT * 0.9
    } );

    // Time axis

    const timeAxis = new ArrowNode( GRAPH_X_OFFSET, GRAPH_HEIGHT, GRAPH_X_OFFSET + GRAPH_WIDTH, GRAPH_HEIGHT, {
      stroke: 'black',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1
    } );

    const timeText = new Text( NuclearDecayCommonFluent.timeStringProperty, {
      font: AXIS_FONT,
      left: GRAPH_X_OFFSET,
      centerY: GRAPH_HEIGHT + 20
    } );

    // Half-life dashed line and label

    const halfLifeLineX = GRAPH_X_OFFSET + HALF_LIFE_X;

    const halfLifeLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( 0, GRAPH_HEIGHT ),
      {
        stroke: NuclearDecayCommonColors.greenProperty,
        lineWidth: 2,
        lineDash: [ 5, 5 ],
        x: halfLifeLineX,
        y: 0
      }
    );

    const halfLifeText = new Text( NuclearDecayCommonFluent.halfLifeStringProperty, {
      font: HALF_LIFE_FONT,
      fill: NuclearDecayCommonColors.greenProperty,
      centerX: halfLifeLineX,
      bottom: -6
    } );

    const halfLifeIndicator = new VBox( {
      children: [ halfLifeText, halfLifeLine ],
      centerX: halfLifeLineX,
      bottom: GRAPH_HEIGHT
    } );

    // Eraser button (top-right corner, aligned with half-life label)

    const eraserButton = new EraserButton( {
      listener: () => {
        // TO BE IMPLEMENTED
      }
    } );
    eraserButton.right = 2 * GRAPH_X_OFFSET + GRAPH_WIDTH;
    eraserButton.top = GRAPH_HEIGHT;

    // Assemble

    const contentsNode = new Node( {
      children: [
        isotopeAxisLabel,
        initialIsotopeSymbol,
        decayProductSymbol,
        timeAxis,
        timeText,
        halfLifeIndicator,
        eraserButton
      ]
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'HalfLifePanel', HalfLifePanel );
