// Copyright 2026, University of Colorado Boulder
/**
 * DataProbePanel shows readouts for the percentages of undecayed and decayed atoms
 * and the current time at the data probe position on the Decay Rate graph.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
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
    undecayedColorProperty: ProfileColorProperty,
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

  public updateReadouts( undecayedPercent: number | null, decayedPercent: number | null, time: number ): void {
    this.undecayedValueText.string = undecayedPercent !== null
                                     ? `${toFixed( undecayedPercent * 100, 0 )} %`
                                     : `${DASH} %`;
    this.decayedValueText.string = decayedPercent !== null
                                   ? `${toFixed( decayedPercent * 100, 0 )} %`
                                   : `${DASH} %`;
    this.timeText.string = StringUtils.fillIn(
      NuclearDecayCommonFluent.dataProbeTimePatternStringProperty.value,
      { time: toFixed( time, 2 ) }
    );
  }
}
