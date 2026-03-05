// Copyright 2026, University of Colorado Boulder
/**
 * Common screen view for Nuclear Decay simulations.
 *
 * @author Agustín Vallejo
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ScreenView, { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';

type SelfOptions = EmptySelfOptions;

export type NuclearDecayScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class NuclearDecayScreenView extends ScreenView {
  public constructor( providedOptions: NuclearDecayScreenViewOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, NuclearDecayScreenViewOptions>()( {
      // Default options go here
    }, providedOptions );

    super( options );
    //nop
  }
}

nuclearDecayCommon.register( 'NuclearDecayScreenView', NuclearDecayScreenView );