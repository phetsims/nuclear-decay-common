// Copyright 2026, University of Colorado Boulder
/**
 * Graph panel showing the decay rates of isotopes over time. Includes checkboxes for toggling
 * visibility of isotope curves, half-life markers, and a data probe. Also displays isotope counts
 * above the graph area.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../scenery/js/nodes/Line.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

// The maximum time displayed on the x-axis (seconds).
const MAX_TIME = 3;

type SelfOptions = EmptySelfOptions;

export type DecayRateGraphOptions = SelfOptions & WithRequired<NuclearDecayPanelOptions, 'tandem'>;

export default class DecayRateGraphPanel extends NuclearDecayPanel {

  private readonly showUndecayedProperty: BooleanProperty;
  private readonly showDecayedProperty: BooleanProperty;
  private readonly showHalfLivesProperty: BooleanProperty;
  private readonly showDataProbeProperty: BooleanProperty;

  private readonly undecayedLinePath: Path;
  private readonly decayedLinePath: Path;
  private readonly graphWidth: number;
  private readonly graphHeight: number;

  public constructor( model: NuclearDecayModel, providedOptions?: DecayRateGraphOptions ) {
    const options = optionize<DecayRateGraphOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      minWidth: NuclearDecayCommonConstants.LONG_PANEL_WIDTH
    }, providedOptions );

    const undecayedIsotope = model.selectedIsotopeProperty.value;
    const decayedIsotope = NuclearDecayModel.getDecayProduct( undecayedIsotope );

    const undecayedAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( undecayedIsotope );
    const decayedAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( decayedIsotope );

    // Get isotope display strings
    const undecayedSymbol = AtomNameUtils.getMassAndSymbol( undecayedAtomConfig.protonCount, undecayedAtomConfig.neutronCount );
    const decayedSymbol = AtomNameUtils.getMassAndSymbol( decayedAtomConfig.protonCount, decayedAtomConfig.neutronCount );

    // Isotope count labels at the top
    const undecayedCountLabel = new RichText( undecayedSymbol, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      fill: NuclearDecayCommonColors.undecayedProperty
    } );
    const decayedCountLabel = new RichText( decayedSymbol, {
      font: NuclearDecayCommonConstants.CONTROL_FONT
    } );
    const countLabels = new VBox( {
      spacing: 4,
      align: 'left',
      children: [ undecayedCountLabel, decayedCountLabel ]
    } );

    // Checkboxes
    // TODO: Should also live in the VisibleProperties https://github.com/phetsims/alpha-decay/issues/4
    const showUndecayedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'showUndecayedProperty' ),
      phetioFeatured: true
    } );
    const showDecayedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'showDecayedProperty' ),
      phetioFeatured: true
    } );
    const showHalfLivesProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'showHalfLivesProperty' ),
      phetioFeatured: true
    } );
    const showDataProbeProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'showDataProbeProperty' ),
      phetioFeatured: true
    } );

    const CHECKBOX_LABEL_FONT = NuclearDecayCommonConstants.CONTROL_FONT;
    const LINE_SAMPLE_LENGTH = 24;
    const ICON_WIDTH = 20;
    const ICON_HEIGHT = 16;

    // Decay curve icon: filled area under an exponential-decay-like quad curve (top-left to bottom-right)
    const decayShape = new Shape()
      .moveTo( 0, 0 )
      .quadraticCurveTo( 0, ICON_HEIGHT, ICON_WIDTH, ICON_HEIGHT );
    const mainIcon = new Node( {
      children: [
        new Rectangle( 0, 0, ICON_WIDTH, ICON_HEIGHT, { stroke: 'black', lineWidth: 0.5 } ),
        new Path( decayShape, { stroke: NuclearDecayCommonColors.undecayedProperty, lineWidth: 1.5 } )
      ]
    } );
    const undecayedCheckboxContent = new HBox( {
      spacing: 6,
      children: [
        new RichText( undecayedSymbol, { font: CHECKBOX_LABEL_FONT } ),
        mainIcon
      ]
    } );
    const undecayedCheckbox = new Checkbox( showUndecayedProperty, undecayedCheckboxContent, {
      tandem: options.tandem.createTandem( 'undecayedCheckbox' )
    } );

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
    const decayedCheckbox = new Checkbox( showDecayedProperty, decayedCheckboxContent, {
      tandem: options.tandem.createTandem( 'decayedCheckbox' )
    } );

    // Half-Lives checkbox: label + dotted line sample
    const halfLifeLineSample = new Line( 0, 0, LINE_SAMPLE_LENGTH, 0, {
      stroke: NuclearDecayCommonColors.halfLifeColorProperty,
      lineWidth: 2,
      lineDash: [ 2, 4 ]
    } );
    const halfLifeCheckboxContent = new HBox( {
      spacing: 6,
      children: [
        new Text( NuclearDecayCommonFluent.halfLifeStringProperty, { font: CHECKBOX_LABEL_FONT, maxWidth: 100 } ),
        halfLifeLineSample
      ]
    } );
    const halfLifeCheckbox = new Checkbox( showHalfLivesProperty, halfLifeCheckboxContent, {
      tandem: options.tandem.createTandem( 'halfLifeCheckbox' )
    } );

    // Data Probe checkbox
    const dataProbeCheckboxContent = new Text( NuclearDecayCommonFluent.dataProbeStringProperty, {
      font: CHECKBOX_LABEL_FONT,
      maxWidth: 100
    } );
    const dataProbeCheckbox = new Checkbox( showDataProbeProperty, dataProbeCheckboxContent, {
      tandem: options.tandem.createTandem( 'dataProbeCheckbox' )
    } );

    const checkboxGroup = new VBox( {
      spacing: 10,
      align: 'left',
      children: [ undecayedCheckbox, decayedCheckbox, halfLifeCheckbox, dataProbeCheckbox ]
    } );

    // Graph placeholder area
    const GRAPH_WIDTH = 750;
    const GRAPH_HEIGHT = 180;

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
        stroke: '#ddd',
        lineWidth: 1
      } ) );
    } );

    const AXIS_LABEL_FONT = new PhetFont( 12 );
    const TICK_FONT = new PhetFont( 11 );

    // Distribute y-tick labels evenly along graph height
    const yTickContainer = new Node();
    const yLabels = [ '100', '75', '50', '25', '0' ];
    yLabels.forEach( ( label, index ) => {
      const y = ( index / ( yLabels.length - 1 ) ) * GRAPH_HEIGHT;
      yTickContainer.addChild( new Text( label, {
        font: TICK_FONT,
        rightCenter: new Vector2( -4, y )
      } ) );
    } );

    // X-axis tick labels
    const xTickContainer = new Node();
    const xLabels = [ '0', '1', '2', '3' ];
    xLabels.forEach( ( label, index ) => {
      const x = ( index / ( xLabels.length - 1 ) ) * GRAPH_WIDTH;
      xTickContainer.addChild( new Text( label, {
        font: TICK_FONT,
        centerTop: new Vector2( x, GRAPH_HEIGHT + 4 )
      } ) );
    } );

    // Axis labels. Y axis is rotated sideways
    const yAxisLabel = new RichText( NuclearDecayCommonFluent.percentRemainingStringProperty, {
      font: AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      maxWidth: GRAPH_HEIGHT
    } );

    const xAxisLabel = new Text( NuclearDecayCommonFluent.timeStringProperty, {
      font: AXIS_LABEL_FONT,
      maxWidth: 100
    } );

    // Half-life dashed vertical line and label
    const halfLifeLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( 0, GRAPH_HEIGHT ),
      {
        stroke: NuclearDecayCommonColors.halfLifeColorProperty,
        lineWidth: 2,
        lineDash: [ 5, 5 ]
      }
    );

    const halfLifeLabel = new Text( NuclearDecayCommonFluent.halfLifeStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_BOLD_FONT,
      fill: NuclearDecayCommonColors.halfLifeColorProperty,
      bottom: -6,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const halfLifeIndicator = new VBox( {
      children: [ halfLifeLabel, halfLifeLine ],
      bottom: GRAPH_HEIGHT
    } );

    model.halfLifeProperty.link( halfLife => {
      halfLifeIndicator.centerX = ( halfLife / MAX_TIME ) * GRAPH_WIDTH;
    } );

    showHalfLivesProperty.link( visible => { halfLifeIndicator.visible = visible; } );

    // Line paths for the decay curves, clipped to the graph area.
    const undecayedLinePath = new Path( null, {
      stroke: NuclearDecayCommonColors.undecayedProperty,
      lineWidth: 2,
      clipArea: Shape.rect( 0, 0, GRAPH_WIDTH, GRAPH_HEIGHT )
    } );
    const decayedLinePath = new Path( null, {
      stroke: 'black',
      lineWidth: 2,
      clipArea: Shape.rect( 0, 0, GRAPH_WIDTH, GRAPH_HEIGHT )
    } );

    showUndecayedProperty.link( visible => { undecayedLinePath.visible = visible; } );
    showDecayedProperty.link( visible => { decayedLinePath.visible = visible; } );

    // Assemble graph with axes
    const graphArea = new Node( {
      children: [ graphBackground, gridLines, halfLifeIndicator, undecayedLinePath, decayedLinePath, yTickContainer, xTickContainer ]
    } );

    // Position x-axis label below the graph
    xAxisLabel.centerTop = new Vector2( GRAPH_WIDTH / 2, GRAPH_HEIGHT + 20 );
    graphArea.addChild( xAxisLabel );

    // Position y-axis label to the left
    yAxisLabel.rightCenter = new Vector2( -30, GRAPH_HEIGHT / 2 );
    graphArea.addChild( yAxisLabel );

    // Assemble the full layout
    // Left column: count labels + checkboxes
    const leftColumn = new VBox( {
      spacing: 12,
      align: 'left',
      children: [ countLabels, checkboxGroup ]
    } );

    // Bottom section: checkboxes on the left, graph on the right
    const contentNode = new HBox( {
      spacing: 12,
      align: 'top',
      children: [ leftColumn, graphArea ]
    } );

    super( contentNode, options );

    this.showUndecayedProperty = showUndecayedProperty;
    this.showDecayedProperty = showDecayedProperty;
    this.showHalfLivesProperty = showHalfLivesProperty;
    this.showDataProbeProperty = showDataProbeProperty;

    this.undecayedLinePath = undecayedLinePath;
    this.decayedLinePath = decayedLinePath;
    this.graphWidth = GRAPH_WIDTH;
    this.graphHeight = GRAPH_HEIGHT;

  }

  public reset(): void {
    this.showUndecayedProperty.reset();
    this.showDecayedProperty.reset();
    this.showHalfLivesProperty.reset();
    this.showDataProbeProperty.reset();
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