// Copyright 2026, University of Colorado Boulder

/**
 * A particle emitted during radioactive decay that can be activated and deactivated by the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Particle, { ParticleOptions, ParticleType } from '../../../../shred/js/model/Particle.js';

type SelfOptions = {
  initialIsActive?: boolean;
};

export type EjectedDecayParticleOptions = SelfOptions & ParticleOptions;

export default class EjectedDecayParticle extends Particle {

  public readonly isActiveProperty: BooleanProperty;

  public constructor( type: ParticleType, providedOptions?: EjectedDecayParticleOptions ) {

    const options = optionize<EjectedDecayParticleOptions, SelfOptions, ParticleOptions>()( {
      initialIsActive: false
    }, providedOptions );

    super( type, options );

    this.isActiveProperty = new BooleanProperty( options.initialIsActive, {
      tandem: options.tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true
    } );
  }

  public override dispose(): void {
    this.isActiveProperty.dispose();
    super.dispose();
  }
}
