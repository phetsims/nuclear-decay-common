// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays the half-life timeline for the current isotope, including isotope symbols on
 * the Y axis, a half-life label, a time label, and an eraser button.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import { toFixed } from '../../../dot/js/util/toFixed.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../scenery-phet/js/buttons/EraserButton.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import HSlider from '../../../sun/js/HSlider.js';
import Tandem from '../../../tandem/js/Tandem.js';
import HistogramData from '../model/HistogramData.js';
import NuclearDecayModel, { SelectableIsotopes } from '../model/NuclearDecayModel.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

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

    model.halfLifeProperty.link( halfLife => {
      halfLifeIndicator.centerX = GRAPH_X_OFFSET + TICK_INTERVAL_WIDTH * halfLife;
    } );

    // eraser button (top-right corner, aligned with half-life label)
    const eraserButton = new EraserButton( {
      listener: () => {
        model.decayedAtoms.length = 0;
      },
      accessibleName: NuclearDecayCommonFluent.a11y.eraserButton.accessibleNameStringProperty,
      accessibleContextResponse: NuclearDecayCommonFluent.a11y.eraserButton.accessibleContextResponseStringProperty,
      tandem: options.tandem.createTandem( 'eraserButton' )
    } );
    eraserButton.right = 2 * GRAPH_X_OFFSET + GRAPH_WIDTH;
    eraserButton.bottom = GRAPH_HEIGHT;

    // TODO: See https://github.com/phetsims/alpha-decay/issues/3.  This slider is temporary, for debugging purposes,
    //  and should be removed once full support for custom half life is added to this control.
    // half-life slider, visible only for the custom isotope
    const halfLifeSlider = new HSlider(
      model.customHalfLifeProperty,
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
        accessibleName: NuclearDecayCommonFluent.halfLifeStringProperty,
        accessibleHelpText: NuclearDecayCommonFluent.a11y.halfLifeSlider.accessibleHelpTextStringProperty,
        createAriaValueText: ( _formattedValue, value ) => {
          return StringUtils.fillIn( NuclearDecayCommonFluent.timeSecondsStringProperty.value, { time: toFixed( value, 2 ) } );
        },
        createContextResponseAlert: ( newValue, oldValue ) => {
          const increased = oldValue !== null && newValue > oldValue;
          const initialEProgress = increased
            ? NuclearDecayCommonFluent.a11y.qualitative.progressLowerStringProperty.value
            : NuclearDecayCommonFluent.a11y.qualitative.progressHigherStringProperty.value;
          const distanceProgress = increased
            ? NuclearDecayCommonFluent.a11y.qualitative.progressSmallerStringProperty.value
            : NuclearDecayCommonFluent.a11y.qualitative.progressLargerStringProperty.value;
          return NuclearDecayCommonFluent.a11y.halfLifeSlider.accessibleContextResponse.format( {
            initialEProgress: initialEProgress, distanceProgress: distanceProgress
          } );
        },
        tandem: Tandem.OPT_OUT
      }
    );

    const timeScaleVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'timeScaleVisibleProperty' ),
      phetioFeatured: true
    } );

    const timeScaleCheckbox = new Checkbox(
      timeScaleVisibleProperty,
      new Text( NuclearDecayCommonFluent.timeScaleStringProperty, {
        font: NuclearDecayCommonConstants.CONTROL_FONT,
        maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
      } ), {
        right: 2 * GRAPH_X_OFFSET + GRAPH_WIDTH,
        bottom: eraserButton.top - 6,
        accessibleHelpText: NuclearDecayCommonFluent.a11y.timeScaleCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: NuclearDecayCommonFluent.a11y.timeScaleCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: NuclearDecayCommonFluent.a11y.timeScaleCheckbox.accessibleContextResponseUncheckedStringProperty,
        tandem: options.tandem.createTandem( 'timeScaleCheckbox' ),
        visibleProperty: model.selectedIsotopeProperty.derived( isotope => isotope === 'custom' )
      }
    );

    // Accessible paragraph describing the timeline, for screen readers.
    const poloniumNameProperty = AtomNameUtils.getNameAndMass( 84, 127 );

    const timelineParagraphStringProperty = new DerivedStringProperty(
      [
        model.selectedIsotopeProperty,
        model.halfLifeProperty,
        NuclearDecayCommonFluent.isotopeAStringProperty,
        poloniumNameProperty
      ],
      ( selectedIsotope, halfLife, isotopeAName, poloniumName ) => {
        const isotopeName = selectedIsotope === 'custom' ? isotopeAName : poloniumName;
        return NuclearDecayCommonFluent.a11y.decayTimeHistogram.accessibleParagraph.format( {
          isotope: isotopeName,
          hLifeTime: toFixed( halfLife, 2 )
        } );
      }
    );

    const timelineParagraphNode = new Node( {
      accessibleParagraph: timelineParagraphStringProperty
    } );

    // Assemble

    const dataPointsLayer = new Node( {
      left: GRAPH_X_OFFSET,
      bottom: timeAxis.centerY
    } );

    const contentsNode = new Node( {
      children: [
        timelineParagraphNode,
        isotopeAxisLabel,
        initialIsotopeSymbol,
        decayProductSymbol,
        timeAxis,
        timeText,
        halfLifeIndicator,
        eraserButton,
        halfLifeSlider,
        dataPointsLayer,
        timeScaleCheckbox
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
            fill: 'black',
            stroke: 'grey',
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
