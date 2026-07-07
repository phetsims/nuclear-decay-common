// Copyright 2026, University of Colorado Boulder
/**
 * Graph panel showing the decay rates of isotopes over time. Includes checkboxes for toggling
 * visibility of isotope curves, half-life markers, and a data probe. Also displays isotope counts
 * above the graph area.
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NuclearDecayAtom, { ISOTOPE_TO_COLOR } from '../../common/model/NuclearDecayAtom.js';
import { DecayPieChartNode } from '../../common/view/DecayPieChartNode.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from '../../common/view/NuclearDecayPanel.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../common/NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import DecayRateModel from '../model/DecayRateModel.js';
import DataProbeGrabberNode from './DataProbeGrabberNode.js';
import DataProbePanel from './DataProbePanel.js';
import DecayRateVisibleProperties from './DecayRateVisibleProperties.js';

// The maximum time displayed on the x-axis (seconds).
const MAX_TIME = 3.5;

type SelfOptions = EmptySelfOptions;

export type DecayRateGraphOptions = SelfOptions & WithRequired<NuclearDecayPanelOptions, 'tandem'>;

const CHECKBOX_LABEL_FONT = NuclearDecayCommonConstants.CONTROL_FONT;
const LINE_SAMPLE_LENGTH = 24;
const ICON_WIDTH = 20;
const ICON_HEIGHT = 16;

const GRAPH_WIDTH = 750;
const GRAPH_HEIGHT = 150;

export default class DecayRateGraphPanel extends NuclearDecayPanel {

  private readonly undecayedLinePath: Path;
  private readonly decayedLinePath: Path;
  private readonly undecayedDataCircle: Path;
  private readonly decayedDataCircle: Path;
  private readonly graphWidth: number;
  private readonly graphHeight: number;
  private readonly dataProbePanel: DataProbePanel;
  private readonly decayRateModel: DecayRateModel;
  private readonly dataProbeXProperty: NumberProperty;

  // Data probe grabber exposed for pdomOrder placement under the Decay Graph heading.
  public readonly dataProbeGrabber: DataProbeGrabberNode;

  // Checkboxes exposed for pdomOrder
  public readonly checkboxes: Node;

  public constructor(
    private readonly model: DecayRateModel,
    private readonly visibleProperties: DecayRateVisibleProperties,
    providedOptions?: DecayRateGraphOptions ) {
    const options = optionize<DecayRateGraphOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      // no options
    }, providedOptions );

    const undecayedIsotope = model.selectedIsotopeProperty.value;
    const decayedIsotope = NuclearDecayAtom.getDecayProduct( undecayedIsotope );

    const undecayedSymbol = NuclearDecayAtom.getIsotopeMassAndSymbolString( undecayedIsotope );
    const decayedSymbol = NuclearDecayAtom.getIsotopeMassAndSymbolString( decayedIsotope );

    const pieChartNode = new DecayPieChartNode( model, {
      tandem: options.tandem.createTandem( 'pieChartNode' )
    } );

    const undecayedColorProperty = model.selectedIsotopeProperty.derived( isotope => {
      return ISOTOPE_TO_COLOR.get( isotope )!.value;
    } );

    // Decay curve icon: filled area under an exponential-decay-like quad curve (top-left to bottom-right)
    const decayShape = new Shape()
      .moveTo( 0, 0 )
      .quadraticCurveTo( 0, ICON_HEIGHT, ICON_WIDTH, ICON_HEIGHT );
    const mainIcon = new Node( {
      children: [
        new Rectangle( 0, 0, ICON_WIDTH, ICON_HEIGHT, { stroke: 'black', lineWidth: 0.5 } ),
        new Path( decayShape, {
          stroke: undecayedColorProperty,
          lineWidth: 1.5
        } )
      ]
    } );
    const undecayedCheckboxContent = new HBox( {
      spacing: 6,
      children: [
        new RichText( undecayedSymbol, { font: CHECKBOX_LABEL_FONT } ),
        mainIcon
      ]
    } );
    const undecayedIsotopeNameProperty = NuclearDecayAtom.createDynamicIsotopeNameAndMassStringProperty(
      model.selectedIsotopeProperty, NuclearDecayCommonFluent.isotopeAStringProperty
    );
    const undecayedCheckbox = new Checkbox( visibleProperties.showUndecayedProperty, undecayedCheckboxContent, combineOptions<CheckboxOptions>( {
      accessibleName: NuclearDecayCommonFluent.a11y.decayRate.undecayedCheckbox.accessibleName.createProperty( {
        isotope: undecayedIsotopeNameProperty
      } ),
      accessibleHelpText: NuclearDecayCommonFluent.a11y.decayRate.undecayedCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: NuclearDecayCommonFluent.a11y.decayRate.undecayedCheckbox.accessibleContextResponseChecked.createProperty( {
        isotope: undecayedIsotopeNameProperty
      } ),
      accessibleContextResponseUnchecked: NuclearDecayCommonFluent.a11y.decayRate.undecayedCheckbox.accessibleContextResponseUnchecked.createProperty( {
        isotope: undecayedIsotopeNameProperty
      } ),
      tandem: options.tandem.createTandem( 'undecayedCheckbox' )
    }, NuclearDecayCommonConstants.CHECKBOX_OPTIONS ) );

    // Growth curve icon: filled area under a growth quad curve (bottom-left to top-right)
    const growthShape = new Shape()
      .moveTo( 0, ICON_HEIGHT )
      .quadraticCurveTo( 0, 0, ICON_WIDTH, 0 );
    const productIcon = new Node( {
      children: [
        new Rectangle( 0, 0, ICON_WIDTH, ICON_HEIGHT, { stroke: 'black', lineWidth: 0.5 } ),
        new Path( growthShape, { stroke: 'black', lineWidth: 1.5 } )
      ]
    } );
    const decayedCheckboxContent = new HBox( {
      spacing: 6,
      children: [
        new RichText( decayedSymbol, { font: CHECKBOX_LABEL_FONT } ),
        productIcon
      ]
    } );
    const decayedIsotopeNameProperty = NuclearDecayAtom.createDynamicDecayProductNameAndMassStringProperty(
      model.selectedIsotopeProperty, NuclearDecayCommonFluent.isotopeBStringProperty
    );
    const decayedCheckbox = new Checkbox( visibleProperties.showDecayedProperty, decayedCheckboxContent, combineOptions<CheckboxOptions>( {
      accessibleName: NuclearDecayCommonFluent.a11y.decayRate.decayedCheckbox.accessibleName.createProperty( {
        isotope: decayedIsotopeNameProperty
      } ),
      accessibleHelpText: NuclearDecayCommonFluent.a11y.decayRate.decayedCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: NuclearDecayCommonFluent.a11y.decayRate.decayedCheckbox.accessibleContextResponseChecked.createProperty( {
        isotope: decayedIsotopeNameProperty
      } ),
      accessibleContextResponseUnchecked: NuclearDecayCommonFluent.a11y.decayRate.decayedCheckbox.accessibleContextResponseUnchecked.createProperty( {
        isotope: decayedIsotopeNameProperty
      } ),
      tandem: options.tandem.createTandem( 'decayedCheckbox' )
    }, NuclearDecayCommonConstants.CHECKBOX_OPTIONS ) );

    // Half-Lives checkbox: label + dotted line sample
    const halfLifeLineSample = new Line( 0, 0, 0, LINE_SAMPLE_LENGTH, {
      stroke: NuclearDecayCommonColors.halfLifeColorProperty,
      lineWidth: 2,
      lineDash: [ 2, 2 ]
    } );
    const halfLivesCheckboxContent = new HBox( {
      spacing: 6,
      children: [
        new Text( NuclearDecayCommonFluent.halfLivesStringProperty, { font: CHECKBOX_LABEL_FONT, maxWidth: 100 } ),
        halfLifeLineSample
      ]
    } );
    const halfLivesCheckbox = new Checkbox( visibleProperties.showHalfLivesProperty, halfLivesCheckboxContent, combineOptions<CheckboxOptions>( {
      accessibleName: NuclearDecayCommonFluent.a11y.decayRate.halfLivesCheckbox.accessibleNameStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.decayRate.halfLivesCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: NuclearDecayCommonFluent.a11y.decayRate.halfLivesCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: NuclearDecayCommonFluent.a11y.decayRate.halfLivesCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: options.tandem.createTandem( 'halfLivesCheckbox' )
    }, NuclearDecayCommonConstants.CHECKBOX_OPTIONS ) );

    // Data Probe checkbox
    const dataProbeCheckboxContent = new Text( NuclearDecayCommonFluent.dataProbeStringProperty, {
      font: CHECKBOX_LABEL_FONT,
      maxWidth: 100
    } );
    const dataProbeCheckbox = new Checkbox( visibleProperties.showDataProbeProperty, dataProbeCheckboxContent, combineOptions<CheckboxOptions>( {
      accessibleName: NuclearDecayCommonFluent.a11y.decayRate.dataProbeCheckbox.accessibleNameStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.decayRate.dataProbeCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: NuclearDecayCommonFluent.a11y.decayRate.dataProbeCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: NuclearDecayCommonFluent.a11y.decayRate.dataProbeCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: options.tandem.createTandem( 'dataProbeCheckbox' )
    }, NuclearDecayCommonConstants.CHECKBOX_OPTIONS ) );

    const checkboxGroup = new VBox( {
      spacing: 10,
      align: 'left',
      children: [ undecayedCheckbox, decayedCheckbox, halfLivesCheckbox, dataProbeCheckbox ]
    } );

    const graphBackground = new Rectangle( 0, 0, GRAPH_WIDTH, GRAPH_HEIGHT, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1
    } );

    // Horizontal grid lines at 25%, 50%, 75%
    const gridLines = new Node();
    [ 0.25, 0.50, 0.75 ].forEach( fraction => {
      const y = GRAPH_HEIGHT * ( 1 - fraction );
      gridLines.addChild( new Line( 0, y, GRAPH_WIDTH, y, {
        stroke: 'black',
        lineWidth: 0.5
      } ) );
    } );

    // Distribute y-tick labels evenly along graph height
    const yTickContainer = new Node();
    const yLabels = [ '100', '75', '50', '25', '0' ];
    yLabels.forEach( ( label, index ) => {
      const y = ( index / ( yLabels.length - 1 ) ) * GRAPH_HEIGHT;
      yTickContainer.addChild( new Text( label, {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        rightCenter: new Vector2( -4, y )
      } ) );
    } );

    // X-axis tick marks and labels
    const xTickContainer = new Node();
    const xLabels = [ '0', '1', '2', '3' ];
    xLabels.forEach( ( label, index ) => {
      const x = ( index / MAX_TIME ) * GRAPH_WIDTH;
      xTickContainer.addChild( new Line( x, GRAPH_HEIGHT, x, GRAPH_HEIGHT + 15, {
        stroke: 'black',
        lineWidth: 1
      } ) );
      xTickContainer.addChild( new Text( label, {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        centerTop: new Vector2( x, GRAPH_HEIGHT + 17 )
      } ) );
    } );

    // Axis labels. Y axis is rotated sideways
    const yAxisLabel = new RichText( NuclearDecayCommonFluent.percentRemainingStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      rotation: -Math.PI / 2,
      maxWidth: GRAPH_HEIGHT
    } );

    const xAxisLabel = new Text( NuclearDecayCommonFluent.timeStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      maxWidth: 100
    } );

    const halfLives: Node[] = [];
    const halfLifeMultiples = 6;
    _.times( halfLifeMultiples, i => {
      // Half-life dashed vertical line and label
      const halfLifeLine = new Path(
        new Shape().moveTo( 0, 0 ).lineTo( 0, GRAPH_HEIGHT ),
        {
          stroke: NuclearDecayCommonColors.halfLifeColorProperty,
          lineWidth: 2,
          lineDash: [ 5, 4 ]
        }
      );

      const halfLifeLabel = new Text( i + 1, {
        font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
        fill: NuclearDecayCommonColors.halfLifeColorProperty,
        bottom: -6,
        maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
      } );

      const halfLifeIndicator = new VBox( {
        children: [ halfLifeLabel, halfLifeLine ],
        bottom: GRAPH_HEIGHT,
        visibleProperty: visibleProperties.showHalfLivesProperty
      } );

      halfLives.push( halfLifeIndicator );
    } );


    model.halfLifeProperty.link( halfLife => {
      _.times( halfLifeMultiples, i => {
        const indicator = halfLives[ i ];
        indicator.centerX = ( ( i + 1 ) * halfLife / MAX_TIME ) * GRAPH_WIDTH;
      } );
    } );

    const dataCircleRadius = 5;
    const undecayedDataCircle = new Circle( dataCircleRadius, {
      fill: 'white',
      stroke: undecayedColorProperty,
      lineWidth: 2
    } );
    const decayedDataCircle = new Circle( dataCircleRadius, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 2
    } );

    // Line paths for the decay curves, clipped to the graph area.
    const undecayedLinePath = new Path( null, {
      stroke: undecayedColorProperty,
      lineWidth: 3,
      clipArea: Shape.rect( 0, 0, GRAPH_WIDTH, GRAPH_HEIGHT )
    } );
    const decayedLinePath = new Path( null, {
      stroke: 'black',
      lineWidth: 3,
      clipArea: Shape.rect( 0, 0, GRAPH_WIDTH, GRAPH_HEIGHT )
    } );

    visibleProperties.showUndecayedProperty.link( visible => { undecayedLinePath.visible = visible; } );
    visibleProperties.showDecayedProperty.link( visible => { decayedLinePath.visible = visible; } );

    // Extra pixels to extend the line to avoid visual artifacts (Not connecting to the panel due to the corner radius)
    const dataProbeLineOvershoot = 10;
    const dataProbeLine = new Path(
      new Shape().moveTo( 0, -dataProbeLineOvershoot ).lineTo( 0, GRAPH_HEIGHT + 20 ),
      {
        stroke: NuclearDecayCommonColors.dataProbeColorProperty,
        lineWidth: 2,
        y: 0
      }
    );

    // Create the property before the grabber so it can be wired as the AccessibleSlider value.
    const dataProbeXProperty = new NumberProperty( GRAPH_WIDTH / 2, {
      range: new Range( 0, GRAPH_WIDTH ),
      tandem: options.tandem.createTandem( 'dataProbeXProperty' )
    } );

    const dataProbeGrabber = new DataProbeGrabberNode( dataProbeXProperty, GRAPH_WIDTH, {
      centerX: dataProbeLine.centerX,
      top: dataProbeLine.bottom
    } );

    const dataProbeNode = new Node( {
      visibleProperty: visibleProperties.showDataProbeProperty,
      children: [
        dataProbeLine,
        dataProbeGrabber
      ],
      bottom: GRAPH_HEIGHT + 15,
      centerX: GRAPH_WIDTH / 2
    } );

    const dataProbePanel = new DataProbePanel(
      undecayedSymbol,
      decayedSymbol,
      undecayedColorProperty,
      {
        centerX: dataProbeNode.centerX,
        visibleProperty: visibleProperties.showDataProbeProperty,
        showDecayedProperty: visibleProperties.showDecayedProperty,
        showUndecayedProperty: visibleProperties.showUndecayedProperty
      }
    );

    // Reposition the panel whenever its bounds change (rows appearing/disappearing change both
    // height and potentially width, so both bottom and centerX must be reclamped).
    const DATA_PROBE_OVERSHOOT = 1;
    dataProbePanel.boundsProperty.link( () => {
      dataProbePanel.bottom = dataProbeNode.top + dataProbeLineOvershoot;
      dataProbePanel.centerX = clamp( dataProbeXProperty.value,
        dataProbePanel.width / 2 - DATA_PROBE_OVERSHOOT,
        GRAPH_WIDTH - dataProbePanel.width / 2 + DATA_PROBE_OVERSHOOT );
    } );

    // Assemble graph with axes
    const graphArea = new Node( {
      children: [
        graphBackground,
        gridLines,
        ...halfLives,
        undecayedLinePath,
        decayedLinePath,
        yTickContainer,
        xTickContainer,
        dataProbeNode,
        dataProbePanel,
        undecayedDataCircle,
        decayedDataCircle
      ]
    } );

    // Pointer drag: convert the pointer's absolute x position to a normalized graph value.
    dataProbeGrabber.addInputListener( new SoundDragListener( {
      tandem: Tandem.OPT_OUT,
      drag: event => {
        const localX = graphArea.globalToLocalPoint( event.pointer.point ).x;
        this.dataProbeXProperty.value = clamp( localX, 0, GRAPH_WIDTH );
      }
    } ) );

    // Position x-axis label below the graph
    xAxisLabel.centerTop = new Vector2( GRAPH_WIDTH / 2, GRAPH_HEIGHT + 30 );
    graphArea.addChild( xAxisLabel );

    // Position y-axis label to the left
    yAxisLabel.rightCenter = new Vector2( -30, GRAPH_HEIGHT / 2 );
    graphArea.addChild( yAxisLabel );

    // Assemble the full layout
    // Left column: count labels + checkboxes
    const leftColumn = new VBox( {
      spacing: 20,
      align: 'center',
      children: [ pieChartNode, checkboxGroup ]
    } );

    // Bottom section: checkboxes on the left, graph on the right
    const contentNode = new HBox( {
      spacing: 20,
      align: 'bottom',
      justify: 'center',
      yMargin: NuclearDecayCommonConstants.PANEL_Y_MARGIN,
      children: [ leftColumn, graphArea ]
    } );

    super( contentNode, options );

    this.undecayedLinePath = undecayedLinePath;
    this.decayedLinePath = decayedLinePath;
    this.undecayedDataCircle = undecayedDataCircle;
    this.decayedDataCircle = decayedDataCircle;
    this.graphWidth = GRAPH_WIDTH;
    this.graphHeight = GRAPH_HEIGHT;
    this.dataProbePanel = dataProbePanel;
    this.decayRateModel = model;
    this.dataProbeXProperty = dataProbeXProperty;
    this.dataProbeGrabber = dataProbeGrabber;
    this.checkboxes = checkboxGroup;

    this.dataProbeXProperty.link( position => {
      dataProbeNode.centerX = clamp( position, 0, GRAPH_WIDTH );
      dataProbePanel.centerX = clamp( position,
        dataProbePanel.width / 2 - DATA_PROBE_OVERSHOOT,
        GRAPH_WIDTH - dataProbePanel.width / 2 + DATA_PROBE_OVERSHOOT );
      this.updateProbeReadouts();
    } );

    // Keep circles and readouts current when visibility toggles while the sim is paused.
    Multilink.multilink(
      [ visibleProperties.showUndecayedProperty, visibleProperties.showDecayedProperty, visibleProperties.showDataProbeProperty ],
      () => this.updateProbeReadouts()
    );

    // Freeze so that data probe movements and dataProbePanel resizes don't shift the outer panel layout.
    graphArea.localBounds = graphArea.localBounds.copy();
  }

  /**
   * Updates the decay rate lines from the given time series data.
   * Each data point is a Vector2 where x = time (seconds) and y = percentage (0-1).
   */
  public update( undecayedDataPoints: Vector2[], decayedDataPoints: Vector2[] ): void {
    this.undecayedLinePath.shape = DecayRateGraphPanel.dataPointsToShape(
      undecayedDataPoints, this.graphWidth, this.graphHeight
    );
    this.decayedLinePath.shape = DecayRateGraphPanel.dataPointsToShape(
      decayedDataPoints, this.graphWidth, this.graphHeight
    );
    this.updateProbeReadouts();
  }

  private updateProbeReadouts(): void {
    const time = ( this.dataProbeXProperty.value / this.graphWidth ) * MAX_TIME;
    const undecayedPercent = DecayRateGraphPanel.getPercentageAtTime( this.decayRateModel.undecayedDataPoints, time );
    this.dataProbePanel.updateReadouts( undecayedPercent, time );

    this.decayedDataCircle.visible = false;
    this.undecayedDataCircle.visible = false;

    // If there's a percentage to show, make sure visible properties have the appropriate curve and data probe
    if ( undecayedPercent ) {
      if ( this.visibleProperties.showUndecayedProperty.value && this.visibleProperties.showDataProbeProperty.value ) {
        this.undecayedDataCircle.visible = true;
        this.undecayedDataCircle.center = new Vector2( this.dataProbeXProperty.value, this.graphHeight * ( 1 - undecayedPercent ) );
      }

      if ( this.visibleProperties.showDecayedProperty.value && this.visibleProperties.showDataProbeProperty.value ) {
        this.decayedDataCircle.visible = true;
        this.decayedDataCircle.center = new Vector2( this.dataProbeXProperty.value, this.graphHeight * ( undecayedPercent ) );
      }
    }


  }

  // Returns the percentage (0-1) at the largest data point time that is <= the given time,
  // or null if the given time exceeds the range of collected data.
  private static getPercentageAtTime( dataPoints: Vector2[], time: number ): number | null {
    if ( dataPoints.length === 0 ) {
      return null;
    }
    const lastPoint = dataPoints[ dataPoints.length - 1 ];
    if ( time > lastPoint.x + 0.01 ) {
      return null;
    }
    let result: number | null = null;
    for ( const point of dataPoints ) {
      if ( point.x <= time ) {
        result = point.y;
      }
      else {
        break;
      }
    }
    return result;
  }

  /**
   * Converts an array of (time, percentage) data points into a Shape for rendering as a line.
   */
  private static dataPointsToShape( dataPoints: Vector2[], graphWidth: number, graphHeight: number ): Shape | null {
    if ( dataPoints.length < 2 ) {
      return null;
    }

    const shape = new Shape();
    for ( let i = 0; i < dataPoints.length; i++ ) {
      const x = ( dataPoints[ i ].x / MAX_TIME ) * graphWidth;
      const y = ( 1 - dataPoints[ i ].y ) * graphHeight;
      if ( i === 0 ) {
        shape.moveTo( x, y );
      }
      else {
        shape.lineTo( x, y );
      }
    }
    return shape;
  }
}