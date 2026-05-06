// Copyright 2026, University of Colorado Boulder
/**
 * Temporary fix
 *
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type EjectedDecayParticleOptions = SelfOptions;

export default class EjectedDecayParticle {

  public readonly isActiveProperty = new Property<boolean>( false );
  public readonly positionProperty = new Property<Vector2>( Vector2.ZERO );
  public readonly destinationProperty = new Property<Vector2>( Vector2.ZERO );


  public constructor( public readonly type: string, providedOptions: EjectedDecayParticleOptions ) {
    // noop. Please fix

  }

  public step( dt: number ): void {
    // no-op, please fix
  }
}