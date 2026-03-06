// Copyright 2026, University of Colorado Boulder
/**
 * Base Panel for Nuclear Decay simulations, providing common styling defaults.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Panel, { PanelOptions } from '../../../sun/js/Panel.js';
import Node from '../../../scenery/js/nodes/Node.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';

type SelfOptions = EmptySelfOptions;

export type NuclearDecayPanelOptions = SelfOptions & PanelOptions;

export default class NuclearDecayPanel extends Panel {
  public constructor( contentNode: Node, providedOptions?: NuclearDecayPanelOptions ) {
    const options = optionize<NuclearDecayPanelOptions, SelfOptions, PanelOptions>()( {
      cornerRadius: 5,
      fill: NuclearDecayCommonConstants.PANEL_FILL,
      xMargin: NuclearDecayCommonConstants.PANEL_X_MARGIN,
      yMargin: NuclearDecayCommonConstants.PANEL_Y_MARGIN
    }, providedOptions );

    super( contentNode, options );
  }
}

nuclearDecayCommon.register( 'NuclearDecayPanel', NuclearDecayPanel );
