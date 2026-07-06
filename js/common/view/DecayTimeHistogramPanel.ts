// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays the half-life timeline for the current isotope, including isotope symbols on the Y axis, a
 * half-life label, a time label, and an eraser button.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import HighlightFromNode from '../../../../scenery/js/accessibility/HighlightFromNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import InfinityNode from '../../../../shred/js/view/InfinityNode.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayAtom, { ISOTOPE_TO_COLOR, StartingIsotopes } from '../model/NuclearDecayAtom.js';
import NuclearDecayModel, { Timescale } from '../model/NuclearDecayModel.js';
import { DecayPieChartNode } from './DecayPieChartNode.js';
import DecayTimeHistogramCanvasNode from './DecayTimeHistogramCanvasNode.js';
import formatTimescaleStrings from './formatTimescaleStrings.js';
import HalfLifeGrabberNode, { ContextResponseAlert } from './HalfLifeGrabberNode.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = EmptySelfOptions;

export type DecayTimeHistogramPanelOptions = SelfOptions & WithRequired<NuclearDecayPanelOptions, 'tandem'>;

// Graph dimensions (adjust these to tune the layout)
const GRAPH_WIDTH = 500;
const GRAPH_HEIGHT = 80;

const MARGIN_X = 3 * NuclearDecayCommonConstants.PANEL_X_MARGIN;

// left margin: room for rotated label + isotope symbols
const GRAPH_X_OFFSET = 90;

const TICK_HEIGHT = 12;
const TICK_LABEL_SPACING = 15;
const LINEAR_TICKS = 4;
const LINEAR_TICK_INTERVAL_WIDTH = 0.9 * GRAPH_WIDTH / ( LINEAR_TICKS - 1 );

// Logarithmic scale: 8 ticks at 10^-3, 10^0, 10^3, ..., 10^18
const LOG_TICKS = 8;
const LOG_MIN_POWER = -3; // leftmost tick exponent
const LOG_POWER_INTERVAL = 3; // orders of magnitude between each log tick
const LOG_TICK_INTERVAL_WIDTH = 0.9 * GRAPH_WIDTH / ( LOG_TICKS - 1 );
const LOG_TICK_OFFSET = 6; // pixels

// px to shift the graph area up when the secondary times axis is shown
const SECONDARY_AXIS_SHIFT = 30;

const secondsInDay = 86400;
const daysInYear = 365.25;
const TIMES_MAP: Array<[ number, TReadOnlyProperty<string> ]> = [
  [ 0.001, NuclearDecayCommonFluent.timesMap.msStringProperty ],
  [ 1, NuclearDecayCommonFluent.timesMap.sStringProperty ],
  [ 60, NuclearDecayCommonFluent.timesMap.minStringProperty ],
  [ 3600, NuclearDecayCommonFluent.timesMap.hrStringProperty ],
  [ secondsInDay, NuclearDecayCommonFluent.timesMap.dayStringProperty ],
  [ secondsInDay * daysInYear, NuclearDecayCommonFluent.timesMap.yrStringProperty ],

  // Since the exponent won't need to be translated we derive the string like this. It was tested to work for RTL so don't worry
  [ secondsInDay * daysInYear * 1e3, NuclearDecayCommonFluent.timesMap.yrStringProperty.derived( yr => '10<sup>3</sup>' + yr ) ],
  [ secondsInDay * daysInYear * 1e6, NuclearDecayCommonFluent.timesMap.yrStringProperty.derived( yr => '10<sup>6</sup>' + yr ) ],
  [ secondsInDay * daysInYear * 1e9, NuclearDecayCommonFluent.timesMap.yrStringProperty.derived( yr => '10<sup>9</sup>' + yr ) ]
];

export default class DecayTimeHistogramPanel extends NuclearDecayPanel {

  private readonly histogramCanvasNode: DecayTimeHistogramCanvasNode;

  private timescaleVisibleProperty: BooleanProperty;

  private halfLifeGrabberNode: HalfLifeGrabberNode;

  public constructor(
    model: NuclearDecayModel,
    providedOptions: DecayTimeHistogramPanelOptions ) {

    const options = optionize<DecayTimeHistogramPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {}, providedOptions );

    // Y-axis rotated label: "Isotope"

    const isotopeAxisLabel = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      rotation: -Math.PI / 2,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const pieChartNode = new DecayPieChartNode( model, {
      tandem: options.tandem.createTandem( 'pieChartNode' ),
      visible: !model.isSingleAtomMode
    } );

    // Isotope symbols

    const selectedIsotopeSymbolProperty = model.selectedIsotopeProperty.derived( ( isotope: StartingIsotopes ) => {
      return NuclearDecayAtom.getIsotopeMassAndSymbolString( isotope );
    } );

    const decayProductSymbolProperty = model.selectedIsotopeProperty.derived( ( isotope: StartingIsotopes ) => {
      const decayProduct = NuclearDecayAtom.getDecayProduct( isotope );
      return NuclearDecayAtom.getIsotopeMassAndSymbolString( decayProduct );
    } );

    const initialIsotopeSymbol = new RichText( selectedIsotopeSymbolProperty, {
      font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
      fill: model.selectedIsotopeProperty.derived( isotope => {
        return ISOTOPE_TO_COLOR.get( isotope )!.value;
      } ),
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const decayProductSymbol = new RichText( decayProductSymbolProperty, {
      font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Time axis

    const timeAxis = new ArrowNode( GRAPH_X_OFFSET - LOG_TICK_OFFSET, GRAPH_HEIGHT, GRAPH_X_OFFSET + GRAPH_WIDTH, GRAPH_HEIGHT, {
      stroke: 'black',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1
    } );

    model.timescaleProperty.link( scale => {
      const offset = scale === 'exponential' ? LOG_TICK_OFFSET : 0;
      timeAxis.setTail( GRAPH_X_OFFSET - offset, GRAPH_HEIGHT );
    } );

    const timeText = new Text( NuclearDecayCommonFluent.timeStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );


    // TODO: Repeated code, maybe make a build-axis function https://github.com/phetsims/alpha-decay/issues/3
    // Linear ticks (0, 1, 2, 3 seconds)
    const linearTicksNode = new Node( {
      visibleProperty: model.timescaleProperty.derived( timescale => timescale === 'linear' ),
      y: GRAPH_HEIGHT
    } );
    _.times( LINEAR_TICKS, ( n: number ) => {
      const tickX = GRAPH_X_OFFSET + n * LINEAR_TICK_INTERVAL_WIDTH;
      linearTicksNode.addChild( new Path(
        new Shape().moveTo( 0, 0 ).lineTo( 0, TICK_HEIGHT ),
        { stroke: 'black', lineWidth: 1, x: tickX, y: 0 }
      ) );
      linearTicksNode.addChild( new Text( n, {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        centerX: tickX,
        top: TICK_LABEL_SPACING
      } ) );
    } );

    // Logarithmic ticks (10^-3, 10^0, 10^3, ..., 10^18)
    const logTicksNode = new Node( {
      visibleProperty: model.timescaleProperty.derived( timescale => timescale === 'exponential' ),
      y: GRAPH_HEIGHT
    } );
    _.times( LOG_TICKS, ( n: number ) => {
      const tickX = GRAPH_X_OFFSET + n * LOG_TICK_INTERVAL_WIDTH;
      logTicksNode.addChild( new Path(
        new Shape().moveTo( 0, 0 ).lineTo( 0, TICK_HEIGHT ),
        { stroke: 'black', lineWidth: 1, x: tickX, y: 0 }
      ) );
      logTicksNode.addChild( new RichText( `10<sup>${LOG_MIN_POWER + n * LOG_POWER_INTERVAL}</sup>`, {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        centerX: tickX,
        top: TICK_LABEL_SPACING
      } ) );
    } );

    timeAxis.addChild( linearTicksNode );
    timeAxis.addChild( logTicksNode );

    const timescaleVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'timescaleVisibleProperty' ),
      phetioFeatured: true
    } );

    // Secondary times axis: gray, positioned at the original primary-axis y, shown when timescaleVisibleProperty is true
    const timesAxisNode = new Node( {
      visibleProperty: timescaleVisibleProperty,
      y: GRAPH_HEIGHT + 10 + SECONDARY_AXIS_SHIFT,

      tandem: options.tandem.createTandem( 'timesAxisNode' )
    } );

    timesAxisNode.addChild( new ArrowNode( GRAPH_X_OFFSET - LOG_TICK_OFFSET, 0, GRAPH_X_OFFSET + GRAPH_WIDTH, 0, {
      stroke: 'gray',
      fill: 'gray',
      lineWidth: 1,
      headWidth: 8,
      tailWidth: 1
    } ) );

    TIMES_MAP.forEach( ( [ seconds, labelProperty ] ) => {
      const xPosition = ( Math.log10( seconds ) - LOG_MIN_POWER ) / LOG_POWER_INTERVAL * LOG_TICK_INTERVAL_WIDTH + GRAPH_X_OFFSET;
      timesAxisNode.addChild( new Path(
        new Shape().moveTo( 0, 0 ).lineTo( 0, TICK_HEIGHT ),
        { stroke: 'gray', lineWidth: 1, x: xPosition, y: 0 }
      ) );
      timesAxisNode.addChild( new RichText( labelProperty, {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        fill: 'gray',
        centerX: xPosition,
        top: TICK_LABEL_SPACING
      } ) );
    } );

    // Half-life dashed line and label

    const halfLifeLine = new Line(
      0, 0, 0, GRAPH_HEIGHT,
      {
        stroke: NuclearDecayCommonColors.halfLifeColorProperty,
        lineWidth: 2,
        lineDash: [ 5, 5 ],
        y: 0
      }
    );

    const halfLifeText = new Text( NuclearDecayCommonFluent.halfLifeStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_BOLD_FONT,
      fill: NuclearDecayCommonColors.halfLifeColorProperty,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // The string readout for the halflife will be 2 significant units for non-custom, only 1 for custom
    // No need to listen to selectedIsotopeProperty because when it changes, halfLifeProperty will change too.
    const halfLifeNumberStringProperty = model.halfLifeProperty.derived( halfLife => {
      return toFixed( halfLife, model.selectedIsotopeProperty.value === 'custom' ? 1 : 2 );
    } );

    const halfLifeNumber = new Text( halfLifeNumberStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_BOLD_FONT,
      fill: NuclearDecayCommonColors.halfLifeColorProperty,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const numberBackgroundRect = new Rectangle( halfLifeNumber.bounds.dilated( 5 ), {
      children: [ halfLifeNumber ],
      fill: new Color( 255, 255, 255, 0.8 )
    } );

    const halfLifeNumberDisplay = new Node( {
      children: [ numberBackgroundRect, halfLifeNumber ],
      visible: !model.isSingleAtomMode
    } );
    halfLifeNumber.boundsProperty.link( () => {
      halfLifeNumber.center = numberBackgroundRect.center;
    } );

    // The half-life grabber is a draggable sphere that sits below the half-life dashed line. It is only visible in
    // custom isotope mode, and converts horizontal drag position into a normalized customHalfLifeProperty value.
    const halfLifeGrabberNode = new HalfLifeGrabberNode( model );

    const halfLifeIndicator = new VBox( {
      align: 'center',
      children: [ halfLifeText, halfLifeLine, halfLifeGrabberNode, halfLifeNumberDisplay ],
      bottom: model.isSingleAtomMode ? GRAPH_HEIGHT : GRAPH_HEIGHT + halfLifeNumberDisplay.height + 2
    } );

    // Make the whole indicator (title, dashed line, and grabber) draggable, not just the small grabber sphere,
    // but only while it is actually meant to be interactive (custom isotope mode). The enlarged area is set on
    // the grabber itself (translated into its local frame), rather than on halfLifeIndicator, so that the same
    // region drives hit-testing, dragging, and the interactive/focus highlight consistently.
    const updateHalfLifePointerArea = () => {
      const isDraggable = halfLifeGrabberNode.visible;
      halfLifeIndicator.cursor = isDraggable ? 'ew-resize' : null;
      const pointerArea = isDraggable ?
                          halfLifeGrabberNode.globalToLocalBounds(
                            halfLifeIndicator.localToGlobalBounds( halfLifeIndicator.localBounds.dilated( 5 ) ) ) :
                          null;
      halfLifeGrabberNode.mouseArea = pointerArea;
      halfLifeGrabberNode.touchArea = pointerArea;
    };
    halfLifeGrabberNode.visibleProperty.link( updateHalfLifePointerArea );
    halfLifeIndicator.localBoundsProperty.link( updateHalfLifePointerArea );

    // Extend the grabber's interactive/focus highlight to cover the whole draggable indicator (title, dashed
    // line, and number readout), not just the small grabber sphere.
    halfLifeGrabberNode.focusHighlight = new HighlightFromNode( halfLifeIndicator );

    const infinityIndicator = new VBox( {
      visibleProperty: model.isNucleusStableProperty,
      spacing: 2,
      top: halfLifeText.bottom,
      children: [
        new InfinityNode( {
          stroke: NuclearDecayCommonColors.halfLifeColorProperty,
          radius: 3
        } ),
        new ArrowNode( 0, 0, 20, 0, {
          fill: NuclearDecayCommonColors.halfLifeColorProperty,
          stroke: NuclearDecayCommonColors.halfLifeColorProperty,
          headHeight: 5,
          headWidth: 5,
          tailWidth: 1
        } )
      ]
    } );

    model.selectedIsotopeProperty.link( isotope => {
      halfLifeLine.setLine( 0, 0, 0,
        isotope !== 'custom' ? GRAPH_HEIGHT :
        model.isSingleAtomMode ? GRAPH_HEIGHT + SECONDARY_AXIS_SHIFT + 6 : GRAPH_HEIGHT - 3
      );
    } );

    // Converts an x position in graphAreaNode's local frame to a normalized customHalfLifeProperty value [0, 1].
    // This is the inverse of the getXForTime → halfLife → normalizedTime chain.
    //
    // Linear: x = time * LINEAR_TICK_INTERVAL_WIDTH + GRAPH_X_OFFSET
    //         → normalized = (time − linRange.min) / linRange.length
    //
    // Exponential: x = (log10(time) − LOG_MIN_POWER) / LOG_POWER_INTERVAL * LOG_TICK_INTERVAL_WIDTH + GRAPH_X_OFFSET
    //              → normalized = (log10(time) − expRange.min) / expRange.length
    const normalizedFromLocalX = ( localX: number ): number => {
      const clampedX = clamp( localX, GRAPH_X_OFFSET, GRAPH_X_OFFSET + GRAPH_WIDTH );
      if ( model.timescaleProperty.value === 'exponential' ) {
        const logTime = ( clampedX - GRAPH_X_OFFSET ) / LOG_TICK_INTERVAL_WIDTH * LOG_POWER_INTERVAL + LOG_MIN_POWER;
        const expRange = NuclearDecayCommonConstants.EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE;
        return ( clamp( logTime, expRange.min, expRange.max ) - expRange.min ) / expRange.getLength();
      }
      else {
        const time = ( clampedX - GRAPH_X_OFFSET ) / LINEAR_TICK_INTERVAL_WIDTH;
        const linRange = NuclearDecayCommonConstants.LINEAR_HALF_LIFE;
        return ( clamp( time, linRange.min, linRange.max ) - linRange.min ) / linRange.getLength();
      }
    };

    // Pointer drag: convert the pointer's absolute x position to a normalized half-life value. Attached to the
    // whole indicator (title, line, and grabber) so the user can grab it anywhere, not just on the small sphere.
    // graphAreaNode is defined below; safe to reference because this callback only fires at runtime.
    halfLifeIndicator.addInputListener( new SoundDragListener( {
      tandem: Tandem.OPT_OUT,
      drag: event => {
        const localX = graphAreaNode.globalToLocalPoint( event.pointer.point ).x;
        model.customHalfLifeProperty.value = clamp( normalizedFromLocalX( localX ), 0, 1 );
      },
      start: () => {
        model.isUserInteractingProperty.value = true;
        halfLifeGrabberNode.wasDraggedProperty.value = true;
      },
      end: () => {
        model.isUserInteractingProperty.value = false;
      }
    } ) );

    const getXForTime = ( time: number, timescale: Timescale ) => {
      if ( timescale === 'exponential' && time > 0 ) {
        const logTime = Math.log10( time );
        return clamp( ( logTime - LOG_MIN_POWER ) / LOG_POWER_INTERVAL * LOG_TICK_INTERVAL_WIDTH + GRAPH_X_OFFSET, 0, GRAPH_WIDTH + GRAPH_X_OFFSET );
      }
      return clamp( time * LINEAR_TICK_INTERVAL_WIDTH + GRAPH_X_OFFSET, 0, GRAPH_WIDTH + GRAPH_X_OFFSET );
    };

    Multilink.multilink( [ model.halfLifeProperty, model.timescaleProperty ], ( halfLife: number, timescale: Timescale ) => {
      halfLifeIndicator.centerX = getXForTime( halfLife, timescale );
      infinityIndicator.left = halfLifeIndicator.centerX + 10;
    } );

    // eraser button (top-right corner, aligned with half-life label)
    const eraserButton = new EraserButton( {
      listener: () => {
        model.clearAtomLists( false, true );
      },
      accessibleName: NuclearDecayCommonFluent.a11y.eraserButton.accessibleNameStringProperty,
      accessibleContextResponse: NuclearDecayCommonFluent.a11y.eraserButton.accessibleContextResponseStringProperty,
      tandem: options.tandem.createTandem( 'eraserButton' ),
      right: NuclearDecayCommonConstants.LONG_PANEL_WIDTH - MARGIN_X,
      bottom: GRAPH_HEIGHT,
      visible: model.isSingleAtomMode
    } );

    // Accessible paragraph describing the timeline, for screen readers.
    const scaleStringProperty = NuclearDecayCommonFluent.a11y.decayTimeHistogram.scale.createProperty( {
      scale: model.timescaleProperty.derived( timescale => timescale === 'exponential' ? 'logarithmic' : 'linear' )
    } );

    const isotopeNameProperty = NuclearDecayAtom.createDynamicIsotopeNameAndMassStringProperty(
      model.selectedIsotopeProperty, NuclearDecayCommonFluent.isotopeAStringProperty );

    const hLifeTimeProperty = new DerivedProperty( [ model.halfLifeProperty, model.timescaleProperty ], ( halfLife, timescale ) => {
      return formatTimescaleStrings( halfLife, timescale );
    } );
    const timelineParagraphStringProperty = model.isSingleAtomMode ?
                                            NuclearDecayCommonFluent.a11y.decayTimeHistogram.accessibleParagraph.createProperty( {
                                              scale: scaleStringProperty,
                                              isotope: isotopeNameProperty,
                                              hLifeTime: hLifeTimeProperty
                                            } ) :
                                            NuclearDecayCommonFluent.a11y.decayTimeHistogram.simpleAccessibleParagraph.createProperty( {
                                              isotope: isotopeNameProperty,
                                              hLifeTime: hLifeTimeProperty
                                            } );

    const timelineParagraphNode = new Node( {
      accessibleParagraph: timelineParagraphStringProperty
    } );

    const timescaleCheckbox = new Checkbox(
      timescaleVisibleProperty,
      new Text( NuclearDecayCommonFluent.timeScaleStringProperty, {
        font: NuclearDecayCommonConstants.CONTROL_FONT,
        maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
      } ), combineOptions<CheckboxOptions>( {
        right: NuclearDecayCommonConstants.LONG_PANEL_WIDTH - MARGIN_X,
        centerY: timesAxisNode.centerY,

        // Description
        accessibleHelpText: NuclearDecayCommonFluent.a11y.timeScaleCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: NuclearDecayCommonFluent.a11y.timeScaleCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: NuclearDecayCommonFluent.a11y.timeScaleCheckbox.accessibleContextResponseUncheckedStringProperty,

        // PhET-iO
        tandem: options.tandem.createTandem( 'timescaleCheckbox' )
      }, NuclearDecayCommonConstants.CHECKBOX_OPTIONS )
    );

    // For bounds purposes, time axis and checkbox are contained in this node that only shows up in custom
    const timeScaleNode = new Node( {
      visibleProperty: model.timescaleProperty.derived( timescale => timescale === 'exponential' ),
      children: [ timesAxisNode, timescaleCheckbox ]
    } );

    const histogramCanvasNode = new DecayTimeHistogramCanvasNode(
      model.selectedIsotopeProperty,
      model.histogramData,
      getXForTime,
      model.timescaleProperty,
      model.isSingleAtomMode,
      new Bounds2( 0, 0, GRAPH_X_OFFSET + GRAPH_WIDTH, GRAPH_HEIGHT )
    );

    const isotopeSymbolsBox = new VBox( {
      children: [ initialIsotopeSymbol, decayProductSymbol ],
      spacing: GRAPH_HEIGHT - initialIsotopeSymbol.height - decayProductSymbol.height
    } );

    const yAxisBox = new HBox( {
      children: [ isotopeAxisLabel, isotopeSymbolsBox ],
      spacing: 10
    } );

    const allAxisBox = new VBox( {
      children: [ yAxisBox, timeText ],
      spacing: 10,
      align: 'left',
      right: GRAPH_X_OFFSET - 30,
      centerY: GRAPH_HEIGHT / 2 + 10
    } );

    // Graph area node
    const graphAreaNode = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [
        allAxisBox,
        timeAxis,
        eraserButton,
        histogramCanvasNode,
        halfLifeIndicator,
        infinityIndicator
      ]
    } );

    const graphNode = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [
        timelineParagraphNode,
        timeScaleNode,
        graphAreaNode
      ]
    } );

    // At-half-life paragraph: appears once the elapsed sample time has reached the half-life.
    const halfLifeReachedProperty = new DerivedProperty(
      [ model.timeProperty, model.halfLifeProperty, model.isPlayAreaEmptyProperty ],
      ( time, halfLife, isEmpty ) => !isEmpty && time > 0 && time >= halfLife
    );

    const percentageAtHalfLifeProperty = new StringProperty( '' );
    halfLifeReachedProperty.link( reached => {
      const value = reached ? model.percentageOfUndecayedProperty.value : 0;
      percentageAtHalfLifeProperty.value = `${roundSymmetric( value * 100 )}`;
      if ( reached ) {
        this.addAccessibleContextResponse( NuclearDecayCommonFluent.a11y.multipleAtoms.decayTimeHistogramAtHalfLife.format( {
          halfLifePercentageUndecayed: percentageAtHalfLifeProperty.value
        } ) );
      }
    } );

    const atHalfLifeParagraph = new Node( {
      visibleProperty: halfLifeReachedProperty,
      accessibleParagraph: NuclearDecayCommonFluent.a11y.multipleAtoms.decayTimeHistogramAtHalfLife.createProperty( {
        halfLifePercentageUndecayed: percentageAtHalfLifeProperty
      } )
    } );

    const contentsNode = new HBox( {
      xMargin: NuclearDecayCommonConstants.PANEL_X_MARGIN,
      spacing: 30,
      justify: 'center',
      children: [
        pieChartNode,
        graphNode,
        atHalfLifeParagraph
      ]
    } );

    super( contentsNode, options );

    this.histogramCanvasNode = histogramCanvasNode;
    this.timescaleVisibleProperty = timescaleVisibleProperty;
    this.halfLifeGrabberNode = halfLifeGrabberNode;
  }

  public reset(): void {
    this.timescaleVisibleProperty.reset();
    this.halfLifeGrabberNode.reset();
  }

  /**
   * Updates the half-life panel's display based on pre-computed histogram data.
   */
  public update(): void {
    this.histogramCanvasNode.update();
  }

  public setHalfLifeGrabberContextResponseAlert( contextResponseAlert: ContextResponseAlert | null ): void {
    this.halfLifeGrabberNode.setContextResponseAlert( contextResponseAlert );
  }

}
