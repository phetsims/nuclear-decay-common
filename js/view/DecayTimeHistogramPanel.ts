// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays the half-life timeline for the current isotope, including isotope symbols on
 * the Y axis, a half-life label, a time label, and an eraser button.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Range from '../../../dot/js/Range.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../scenery-phet/js/buttons/EraserButton.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import HSlider from '../../../sun/js/HSlider.js';
import HistogramData from '../model/HistogramData.js';
import NuclearDecayModel, { SelectableIsotopes } from '../model/NuclearDecayModel.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';
import Tandem from '../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;

export type DecayTimeHistogramPanelOptions = SelfOptions & WithRequired<NuclearDecayPanelOptions, 'tandem'>;

// Graph dimensions (adjust these to tune the layout)
const GRAPH_WIDTH = 530;
const GRAPH_HEIGHT = 80;

// left margin: room for rotated label + isotope symbols
const GRAPH_X_OFFSET = 90;
const ISOTOPE_SYMBOL_X = 35; // x of the isotope symbol column
const AXIS_LABEL_X = 10; // x center of the rotated "Isotope" label

const TICKS = 4;

// Width of the tick interval. Also represents 1 second on the time axis.
const TICK_INTERVAL_WIDTH = 0.9 * GRAPH_WIDTH / ( TICKS - 1 );

export default class DecayTimeHistogramPanel extends NuclearDecayPanel {

  private dataPointsLayer: Node;

  private model: NuclearDecayModel;

  public constructor( model: NuclearDecayModel, providedOptions?: DecayTimeHistogramPanelOptions ) {
    const options = optionize<DecayTimeHistogramPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {}, providedOptions );

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
      fill: NuclearDecayCommonColors.undecayedProperty,
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
      const tickX = GRAPH_X_OFFSET + ( n ) * TICK_INTERVAL_WIDTH;
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

    const halfLifeLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( 0, GRAPH_HEIGHT ),
      {
        stroke: NuclearDecayCommonColors.halfLifeColorProperty,
        lineWidth: 2,
        lineDash: [ 5, 5 ],
        y: 0
      }
    );

    const halfLifeText = new Text( NuclearDecayCommonFluent.halfLifeStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
      fill: NuclearDecayCommonColors.halfLifeColorProperty,
      bottom: -6,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const halfLifeIndicator = new VBox( {
      children: [ halfLifeText, halfLifeLine ],
      bottom: GRAPH_HEIGHT
    } );

    model.selectedHalfLifeProperty.link( halfLife => {
      halfLifeIndicator.centerX = GRAPH_X_OFFSET + TICK_INTERVAL_WIDTH * halfLife;
    } );

    // eraser button (top-right corner, aligned with half-life label)
    const eraserButton = new EraserButton( {
      listener: () => {
        model.decayedAtoms.length = 0;
      },
      tandem: options.tandem.createTandem( 'eraserButton' )
    } );
    eraserButton.right = 2 * GRAPH_X_OFFSET + GRAPH_WIDTH;
    eraserButton.bottom = GRAPH_HEIGHT;

    // TODO: See https://github.com/phetsims/alpha-decay/issues/3.  This slider is temporary, for debugging purposes,
    //  and should be removed once full support for custom half life is added to this control.
    // half-life slider, visible only for the custom isotope
    const halfLifeSlider = new HSlider(
      model.selectedHalfLifeProperty,
      new Range( 0.1, 4 ), // limit to roughly the graph range for polonium for now.
      {
        trackSize: new Dimension2( 80, 2 ),
        thumbSize: new Dimension2( 10, 18 ),
        right: 2 * GRAPH_X_OFFSET + GRAPH_WIDTH,
        top: 0,
        visibleProperty: new DerivedProperty(
          [ model.selectedIsotopeProperty ],
          selectedIsotope => selectedIsotope === 'custom'
        ),
        tandem: Tandem.OPT_OUT
      }
    );

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
        halfLifeSlider,
        dataPointsLayer
      ]
    } );

    super( contentsNode, options );

    this.model = model;
    this.dataPointsLayer = dataPointsLayer;
  }

  /**
   * Updates the half-life panel's display based on pre-computed histogram data.
   */
  public update( histogramData: HistogramData ): void {

    // TODO: Check out the implementation of HistogramCanvasPainter https://github.com/phetsims/alpha-decay/issues/3
    // TODO: Make sure this is not a memory leak https://github.com/phetsims/alpha-decay/issues/3
    this.dataPointsLayer.removeAllChildren();

    const BOX_WIDTH = 6;

    const BOX_HEIGHT = histogramData.tallestBinCount * 9 < GRAPH_HEIGHT ? 9 :
                       histogramData.tallestBinCount * 6 < GRAPH_HEIGHT ? 6 : 3;

    histogramData.decayedBinsMap.forEach( ( value, bin ) => {
      _.times( value, n => {
        const y = GRAPH_HEIGHT - ( n + 1 ) * BOX_HEIGHT;
        this.dataPointsLayer.addChild( new Rectangle(
          bin * TICK_INTERVAL_WIDTH + GRAPH_X_OFFSET, y, BOX_WIDTH, BOX_HEIGHT, {
            fill: 'grey',
            stroke: 'black',
            lineWidth: 1
          }
        ) );
      } );
    } );

    if ( histogramData.showUndecayed() ) {
      const UNDECAYED_WIDTH = 25;
      const UNDECAYED_HEIGHT = 16;

      const undecayedRectangle = new Rectangle(
        histogramData.undecayedTime * TICK_INTERVAL_WIDTH + GRAPH_X_OFFSET, 0, UNDECAYED_WIDTH, UNDECAYED_HEIGHT, {
          fill: NuclearDecayCommonColors.undecayedProperty,
          stroke: 'black',
          lineWidth: 1
        }
      );
      const undecayedCountLabel = new Text( histogramData.numberOfUndecayedAtoms, {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        fill: 'black',
        center: undecayedRectangle.center
      } );
      undecayedRectangle.addChild( undecayedCountLabel );

      this.dataPointsLayer.addChild( undecayedRectangle );
    }
  }

}
