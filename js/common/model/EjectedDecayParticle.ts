// Copyright 2026, University of Colorado Boulder

/**
 * A particle emitted during radioactive decay that can be activated and deactivated by the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Particle, { ParticleOptions, ParticleType, ParticleTypeValues } from '../../../../shred/js/model/Particle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';

export type EjectedDecayParticleStateObject = {
  type: ParticleType;
  isActive: boolean;
  position: Vector2StateObject;
  destination: Vector2StateObject;
};

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

  /**
   * Sets the values for this particle based on a reference particle, used for serialization
   */
  public set( referenceParticle: EjectedDecayParticle ): void {
    this.isActiveProperty.value = referenceParticle.isActiveProperty.value;
    this.positionProperty.value = referenceParticle.positionProperty.value;
    this.destinationProperty.value = referenceParticle.destinationProperty.value;
  }

  public static readonly EjectedDecayParticleIO = new IOType<EjectedDecayParticle, EjectedDecayParticleStateObject>( 'EjectedDecayParticleIO', {
    valueType: EjectedDecayParticle,
    documentation: 'A particle ejected from a nucleus during a decay event.',
    stateSchema: {
      type: StringUnionIO( ParticleTypeValues ),
      isActive: BooleanIO,
      position: Vector2.Vector2IO,
      destination: Vector2.Vector2IO
    },
    toStateObject: ( particle: EjectedDecayParticle ): EjectedDecayParticleStateObject => ( {
      type: particle.type,
      isActive: particle.isActiveProperty.value,
      position: Vector2.Vector2IO.toStateObject( particle.positionProperty.value ),
      destination: Vector2.Vector2IO.toStateObject( particle.destinationProperty.value )
    } ),
    fromStateObject: ( stateObject: EjectedDecayParticleStateObject ): EjectedDecayParticle => {
      const particle = new EjectedDecayParticle( stateObject.type, {
        initialIsActive: stateObject.isActive,
        tandem: Tandem.OPT_OUT
      } );
      particle.positionProperty.value = Vector2.Vector2IO.fromStateObject( stateObject.position );
      particle.destinationProperty.value = Vector2.Vector2IO.fromStateObject( stateObject.destination );
      return particle;
    }
  } );
}
