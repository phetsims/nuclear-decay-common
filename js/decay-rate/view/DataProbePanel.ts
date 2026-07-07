// Copyright 2026, University of Colorado Boulder
/**
 * DataProbePanel shows readouts for the percentages of undecayed and decayed atoms
 * and the current time at the data probe position on the Decay Rate graph.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../common/NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';

type SelfOptions = {
  showUndecayedProperty?: BooleanProperty;
  showDecayedProperty?: BooleanProperty;
};
export type DataProbePanelOptions = SelfOptions & PanelOptions;

const FONT = NuclearDecayCommonConstants.SMALL_LABEL_FONT;
const DASH = '--';

export default class DataProbePanel extends Panel {
  private readonly undecayedValueText: Text;
  private readonly decayedValueText: Text;
  private readonly timeText: Text;

  public constructor(
    undecayedSymbol: string,
    decayedSymbol: string,
    undecayedColorProperty: ReadOnlyProperty<Color>,
    providedOptions?: DataProbePanelOptions
  ) {

    const options = optionize<DataProbePanelOptions, SelfOptions, PanelOptions>()( {
      fill: 'white',
      stroke: '#aaaaaa',
      cornerRadius: 4,
      xMargin: 8,
      yMargin: 6,
      showUndecayedProperty: new BooleanProperty( true ),
      showDecayedProperty: new BooleanProperty( true )
    }, providedOptions );

    const undecayedValueText = new Text( `${DASH} %`, { font: FONT, fill: undecayedColorProperty } );
    const decayedValueText = new Text( `${DASH} %`, { font: FONT } );
    const timeText = new Text( `${DASH} s`, {
      font: FONT, fill: NuclearDecayCommonColors.halfLifeColorProperty, layoutOptions: {
        align: 'right'
      }
    } );

    const undecayedRow = new HBox( {
      spacing: 4,
      visibleProperty: options.showUndecayedProperty,
      children: [
        new RichText( `${undecayedSymbol}:`, { font: FONT, fill: undecayedColorProperty } ),
        undecayedValueText
      ]
    } );

    const decayedRow = new HBox( {
      spacing: 4,
      visibleProperty: options.showDecayedProperty,
      children: [
        new RichText( `${decayedSymbol}:`, { font: FONT } ),
        decayedValueText
      ]
    } );

    const content = new VBox( {
      spacing: 4,
      align: 'left',
      children: [ undecayedRow, decayedRow, timeText ]
    } );

    super( content, options );

    this.undecayedValueText = undecayedValueText;
    this.decayedValueText = decayedValueText;
    this.timeText = timeText;
  }

  public updateReadouts( undecayedPercent: number | null, time: number ): void {
    if ( undecayedPercent ) {

      // Using toFixedNumber to first round the value. Then toFixed to ensure values like 87.0 do show that last decimal.
      const undecayedPercentRounded = toFixedNumber( undecayedPercent * 100, 1 );
      this.undecayedValueText.string = `${toFixed( undecayedPercentRounded, 1 )} %`;
      this.decayedValueText.string = `${toFixed( 100 - undecayedPercentRounded, 1 )} %`;
    }
    else {
      this.undecayedValueText.string = `${DASH} %`;
      this.decayedValueText.string = `${DASH} %`;
    }
    this.timeText.string = StringUtils.fillIn(
      NuclearDecayCommonFluent.dataProbeTimePatternStringProperty.value,
      { time: toFixed( time, 2 ) }
    );
  }
}
