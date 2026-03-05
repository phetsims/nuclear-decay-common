// Copyright 2026, University of Colorado Boulder
/**
 * Base model for the nuclear decay sim, which will hold the state of the nucleus and perform the decay calculations.
 *
 * @author Agustín Vallejo
 */

import TModel from '../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';

export type NuclearDecayModelOptions = EmptySelfOptions;

export default class NuclearDecayModel implements TModel {

  public readonly isPlayingProperty: BooleanProperty;

  public constructor( providedOptions: NuclearDecayModelOptions ) {

    this.isPlayingProperty = new BooleanProperty( false, {
      // tandem: ???
    });

  }

  /**
   * Resets the model.
   */
  public reset(): void {
    // TO BE IMPLEMENTED
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // TO BE IMPLEMENTED
  }
}

nuclearDecayCommon.register( 'NuclearDecayModel', NuclearDecayModel );