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

type SelfOptions = EmptySelfOptions;

export type DecayRateGraphOptions = SelfOptions & NuclearDecayPanelOptions;

export default class DecayRateGraph extends NuclearDecayPanel {
  public constructor( model: NuclearDecayModel, providedOptions?: DecayRateGraphOptions ) {
    const options = optionize<DecayRateGraphOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      minWidth: NuclearDecayCommonConstants.LONG_PANEL_WIDTH
    }, providedOptions );

    const mainIsotope = model.selectedIsotopeProperty.value;
    const productIsotope = NuclearDecayModel.getDecayProduct( mainIsotope );

    const mainIsotopeConfig = NuclearDecayModel.getIsotopeAtomConfig( mainIsotope );
    const productIsotopeConfig = NuclearDecayModel.getIsotopeAtomConfig( productIsotope );

    // Get isotope display strings
    const mainSymbol = AtomNameUtils.getMassAndSymbol( mainIsotopeConfig.protonCount, mainIsotopeConfig.neutronCount );
    const productSymbol = AtomNameUtils.getMassAndSymbol( productIsotopeConfig.protonCount, productIsotopeConfig.neutronCount );

    // Isotope count labels at the top
    const mainCountLabel = new RichText( mainSymbol, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      fill: NuclearDecayCommonColors.pinkProperty
    } );
    const productCountLabel = new RichText( productSymbol, {
      font: NuclearDecayCommonConstants.CONTROL_FONT
    } );
    const countLabels = new VBox( {
      spacing: 4,
      align: 'left',
      children: [ mainCountLabel, productCountLabel ]
    } );

    // Checkboxes
    const showMainProperty = new BooleanProperty( true );
    const showProductProperty = new BooleanProperty( true );
    const showHalfLivesProperty = new BooleanProperty( false );
    const showDataProbeProperty = new BooleanProperty( false );

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
        new Path( decayShape, { stroke: NuclearDecayCommonColors.pinkProperty, lineWidth: 1.5 } )
      ]
    } );
    const mainCheckboxContent = new HBox( {
      spacing: 6,
      children: [
        new RichText( mainSymbol, { font: CHECKBOX_LABEL_FONT } ),
        mainIcon
      ]
    } );
    const mainCheckbox = new Checkbox( showMainProperty, mainCheckboxContent );

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
    const productCheckboxContent = new HBox( {
      spacing: 6,
      children: [
        new RichText( productSymbol, { font: CHECKBOX_LABEL_FONT } ),
        productIcon
      ]
    } );
    const productCheckbox = new Checkbox( showProductProperty, productCheckboxContent );

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
    const halfLifeCheckbox = new Checkbox( showHalfLivesProperty, halfLifeCheckboxContent );

    // Data Probe checkbox (no line sample)
    const dataProbeCheckboxContent = new Text( NuclearDecayCommonFluent.dataProbeStringProperty, {
      font: CHECKBOX_LABEL_FONT,
      maxWidth: 100
    } );
    const dataProbeCheckbox = new Checkbox( showDataProbeProperty, dataProbeCheckboxContent );

    const checkboxGroup = new VBox( {
      spacing: 10,
      align: 'left',
      children: [ mainCheckbox, productCheckbox, halfLifeCheckbox, dataProbeCheckbox ]
    } );

    // Graph placeholder area
    const GRAPH_WIDTH = 380;
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
    const yLabels = [ '100%', '75%', '50%', '25%', '0' ];
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

    // Axis labels
    const yAxisLabel = new RichText( NuclearDecayCommonFluent.percentRemainingStringProperty, {
      font: AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      maxWidth: GRAPH_HEIGHT
    } );

    const xAxisLabel = new Text( NuclearDecayCommonFluent.timeStringProperty, {
      font: AXIS_LABEL_FONT,
      maxWidth: 100
    } );

    // Assemble graph with axes
    const graphArea = new Node( {
      children: [ graphBackground, gridLines, yTickContainer, xTickContainer ]
    } );

    // Position x-axis label below the graph
    xAxisLabel.centerTop = new Vector2( GRAPH_WIDTH / 2, GRAPH_HEIGHT + 20 );
    graphArea.addChild( xAxisLabel );

    // Position y-axis label to the left
    yAxisLabel.rightCenter = new Vector2( -40, GRAPH_HEIGHT / 2 );
    graphArea.addChild( yAxisLabel );

    // Assemble the full layout
    // Left column: count labels + checkboxes
    const leftColumn = new VBox( {
      spacing: 12,
      align: 'left',
      children: [ countLabels, checkboxGroup ]
    } );

    // Bottom section: checkboxes on the left, graph on the right
    const bottomRow = new HBox( {
      spacing: 12,
      align: 'top',
      children: [ leftColumn, graphArea ]
    } );

    const contentNode = new VBox( {
      spacing: 8,
      align: 'left',
      children: [ bottomRow ]
    } );

    super( contentNode, options );
  }
}