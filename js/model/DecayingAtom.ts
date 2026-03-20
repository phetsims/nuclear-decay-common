// Copyright 2026, University of Colorado Boulder
/**
 * Subclass of Isotope which is in the process of decaying, so it has information on time and others.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import TProperty from '../../../axon/js/TProperty.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Isotope, { IsotopeOptions } from './Isotope.js';

type SelfOptions = EmptySelfOptions;

export type DecayingIsotopeOptions = SelfOptions & IsotopeOptions;

export default class DecayingAtom extends Isotope {

  public readonly timeProperty: TProperty<number>;

  // This is temporary.  JPB.
  private readonly decayedProperty: TProperty<boolean> = new BooleanProperty( false );

  public constructor( protons: number, neutrons: number, providedOptions: DecayingIsotopeOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, DecayingIsotopeOptions>()( {
      // Default options go here
    }, providedOptions );

    super( protons, neutrons, options );

    this.timeProperty = new NumberProperty( 0 );
  }

  public static startDecay( isotope: Isotope ): DecayingAtom {
    return new DecayingAtom( isotope.protonCountProperty.value, isotope.neutronCountProperty.value, {
      decaysInto: isotope.decaysIntoProperty.value
    } );
  }

  /**
   * Resets the decay process, which resets the time experienced by the atom back to zero and, if the atom has decayed,
   * resets the atom back to its original state.
   */
  public resetDecay(): void {
    this.timeProperty.value = 0;
    this.decayedProperty.value = false;
  }

  public step( dt: number ): void {
    this.timeProperty.value += dt;

    if ( this.halfLifeProperty.value && !this.decayedProperty.value ) {
      const probabilityOfDecay = DecayingAtom.decayProbabilityOverInterval( this.halfLifeProperty.value, dt );
      if ( dotRandom.nextDouble() < probabilityOfDecay ) {
        this.decayedProperty.value = true;
        console.log( `decay occurred at ${this.timeProperty.value}` );
      }
    }
  }

  private static decayConstantFromHalfLife( halfLife: number ): number {
    if ( halfLife <= 0 ) {
      throw new Error( 'halfLife must be > 0' );
    }
    return Math.LN2 / halfLife;
  }

  private static decayProbabilityOverInterval( halfLife: number, dt: number ): number {
    if ( dt <= 0 ) {
      return 0;
    }
    const lambda = DecayingAtom.decayConstantFromHalfLife( halfLife );
    return 1 - Math.exp( -lambda * dt );
  }
}
