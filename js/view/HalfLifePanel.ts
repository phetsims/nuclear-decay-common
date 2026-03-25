// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays the half-life timeline for the current isotope, including isotope symbols on
 * the Y axis, a half-life label, a time label, and an eraser button.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { roundToInterval } from '../../../dot/js/util/roundToInterval.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../scenery-phet/js/buttons/EraserButton.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import NuclearDecayModel, { SelectableIsotopes } from '../model/NuclearDecayModel.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = EmptySelfOptions;

export type HalfLifePanelOptions = SelfOptions & NuclearDecayPanelOptions;

// Graph dimensions (adjust these to tune the layout)
const GRAPH_WIDTH = 530;
const GRAPH_HEIGHT = 80;

// left margin: room for rotated label + isotope symbols
const GRAPH_X_OFFSET = 90;
const HALF_LIFE_X = GRAPH_WIDTH * 0.35; // x position of the half-life dashed line within the graph
const ISOTOPE_SYMBOL_X = 35; // x of the isotope symbol column
const AXIS_LABEL_X = 10; // x center of the rotated "Isotope" label

const TICKS = 4;
const TICK_WIDTH = 0.9 * GRAPH_WIDTH / ( TICKS - 1 );

export default class HalfLifePanel extends NuclearDecayPanel {

  private dataPointsLayer: Node;

  private model: NuclearDecayModel;

  public constructor( model: NuclearDecayModel, providedOptions?: HalfLifePanelOptions ) {
    const options = optionize<HalfLifePanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {}, providedOptions );

    // Y-axis rotated label: "Isotope"

    const isotopeAxisLabel = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      rotation: -Math.PI / 2,
      centerX: AXIS_LABEL_X,
      centerY: GRAPH_HEIGHT / 2,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Isotope symbols

    const selectedIsotopeSymbolProperty = model.selectedIsotopeProperty.derived( ( isotope: SelectableIsotopes ) => {
      return NuclearDecayModel.getIsotopeMassAndSymbolString( isotope, 'A' );

    } );

    const decayProductSymbolProperty = model.selectedIsotopeProperty.derived( ( isotope: SelectableIsotopes ) => {
      const decayProduct = NuclearDecayModel.getDecayProduct( isotope );
      return NuclearDecayModel.getIsotopeMassAndSymbolString( decayProduct, 'B' );
    } );

    const initialIsotopeSymbol = new RichText( selectedIsotopeSymbolProperty, {
      font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
      fill: NuclearDecayCommonColors.pinkProperty,
      left: ISOTOPE_SYMBOL_X,
      centerY: 0,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const decayProductSymbol = new RichText( decayProductSymbolProperty, {
      font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
      left: ISOTOPE_SYMBOL_X,
      centerY: GRAPH_HEIGHT * 0.9,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Time axis

    const timeAxis = new ArrowNode( GRAPH_X_OFFSET, GRAPH_HEIGHT, GRAPH_X_OFFSET + GRAPH_WIDTH, GRAPH_HEIGHT, {
      stroke: 'black',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1
    } );

    const timeText = new Text( NuclearDecayCommonFluent.timeStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      left: 0,
      centerY: GRAPH_HEIGHT + 20,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Time ticks
    _.times( TICKS, ( n: number ) => {
      const tickX = GRAPH_X_OFFSET + ( n ) * TICK_WIDTH;
      const tick = new Path(
        new Shape().moveTo( 0, 0 ).lineTo( 0, 10 ),
        {
          stroke: 'black',
          lineWidth: 1,
          x: tickX,
          y: GRAPH_HEIGHT
        }
      );
      const tickLabel = new Text( n, {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        centerX: tickX,
        top: GRAPH_HEIGHT + 12
      } );
      timeAxis.addChild( tick );
      timeAxis.addChild( tickLabel );
    } );

    // Half-life dashed line and label

    const halfLifeLineX = GRAPH_X_OFFSET + HALF_LIFE_X;

    const halfLifeLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( 0, GRAPH_HEIGHT ),
      {
        stroke: NuclearDecayCommonColors.halfLifeColorProperty,
        lineWidth: 2,
        lineDash: [ 5, 5 ],
        x: halfLifeLineX,
        y: 0
      }
    );

    const halfLifeText = new Text( NuclearDecayCommonFluent.halfLifeStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
      fill: NuclearDecayCommonColors.halfLifeColorProperty,
      centerX: halfLifeLineX,
      bottom: -6,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
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
    eraserButton.bottom = GRAPH_HEIGHT;

    // Assemble

    const dataPointsLayer = new Node( {
      left: GRAPH_X_OFFSET,
      bottom: timeAxis.centerY
    } );

    const contentsNode = new Node( {
      children: [
        isotopeAxisLabel,
        initialIsotopeSymbol,
        decayProductSymbol,
        timeAxis,
        timeText,
        halfLifeIndicator,
        eraserButton,
        dataPointsLayer
      ]
    } );

    super( contentsNode, options );

    this.model = model;
    this.dataPointsLayer = dataPointsLayer;

    this.model.updateEmitter.addListener( () => {
      this.update();
    } );
  }

  /**
   * Updates the half-life panel's display based on the current state of the model.
   */
  public update(): void {
    // TODO: Check out the implementation of HistogramCanvasPainter https://github.com/phetsims/alpha-decay/issues/3
    // TODO: Make sure this is not a memory leak https://github.com/phetsims/alpha-decay/issues/3
    this.dataPointsLayer.removeAllChildren();

    const BOX_SIZE = 10;

    // Since the TICK_WIDTH equals 1s, this division gives us the number of seconds that each box represents
    const BIN_SIZE_TIME = BOX_SIZE / TICK_WIDTH;

    const binsMap = new Map<number, number>();
    this.model.activeAtoms.forEach( ( atom, index ) => {
      let x: number;
      let y = GRAPH_HEIGHT;
      if ( atom.hasDecayed ) {

        // If the atom decayed, round it to bin it on the histogram, otherwise let it have any time value.
        x = roundToInterval( atom.time, BIN_SIZE_TIME );
        if ( binsMap.has( x ) ) {
          binsMap.set( x, binsMap.get( x )! + 1 );
          y -= BOX_SIZE * binsMap.get( x )!;
        }
        else {
          binsMap.set( x, 1 );
          y -= BOX_SIZE;
        }
      }
      else {
        x = atom.time;
        y = 0;
      }

      this.dataPointsLayer.addChild( new Rectangle(
        x * TICK_WIDTH + GRAPH_X_OFFSET, y, BOX_SIZE, BOX_SIZE, {
          fill: atom.hasDecayed ? 'grey' : NuclearDecayCommonColors.pinkProperty,
          stroke: 'black',
          lineWidth: 1
        }
      ) );
    } );

  }
}
