// Copyright 2026, University of Colorado Boulder
/**
 * Atom that belongs to the Nuclear Decay Suite, it has information on the decay status and time.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../dot/js/dotRandom.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import AtomInfoUtils from '../../../shred/js/AtomInfoUtils.js';
import AtomConfig from '../../../shred/js/model/AtomConfig.js';

type SelfOptions = EmptySelfOptions;

export type DecayingIsotopeOptions = SelfOptions;

export default class NuclearDecayAtom {

  // Number of protons, neutrons and electrons before the decay.
  public readonly atomConfigBeforeDecay: AtomConfig;

  // Number of protons, neutrons and electrons after the decay (if it decays at all!)
  public readonly atomConfigAfterDecay: AtomConfig;

  // Half-life of the isotope, in seconds.
  public readonly halfLife: number;

  // Whether the atom is in the play area or not
  public isActive = false;

  // Whether the atom has decayed or not.
  public hasDecayed = false;

  // Pretty self-explanatory, don't you think?
  public time = 0;

  // Time it took to decay
  public decayTime: number | null = null;


  public constructor(
    atomConfigBeforeDecay: AtomConfig,
    atomConfigAfterDecay: AtomConfig,
    providedOptions?: DecayingIsotopeOptions
  ) {

    // const options = optionize<SelfOptions, EmptySelfOptions, DecayingIsotopeOptions>()( {
    //   // no-op
    // }, providedOptions );

    this.atomConfigBeforeDecay = atomConfigBeforeDecay;
    this.atomConfigAfterDecay = atomConfigAfterDecay;

    const halfLife = AtomInfoUtils.getNuclideHalfLife( atomConfigBeforeDecay.protonCount, atomConfigBeforeDecay.neutronCount );
    affirm( halfLife !== null, 'Should provide a valid isotope with a known half-life' );
    this.halfLife = halfLife;

  }

  /**
   * Resets the decay process, which resets the time experienced by the atom back to zero and, if the atom has decayed,
   * resets the atom back to its original state.
   */
  public resetDecay(): void {
    this.time = 0;
    this.hasDecayed = false;
  }

  public step( dt: number ): void {
    this.time += dt;

    if ( this.halfLife && !this.hasDecayed ) {
      const probabilityOfDecay = NuclearDecayAtom.decayProbabilityOverInterval( this.halfLife, dt );
      if ( dotRandom.nextDouble() < probabilityOfDecay ) {
        this.hasDecayed = true;
        console.log( `decay occurred at ${this.time}` );
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
    const lambda = NuclearDecayAtom.decayConstantFromHalfLife( halfLife );
    return 1 - Math.exp( -lambda * dt );
  }
}
