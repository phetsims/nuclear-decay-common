// Copyright 2026, University of Colorado Boulder
/**
 * Atom that belongs to the Nuclear Decay Suite, it has information on the decay status and time.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../dot/js/dotRandom.js';
import Vector2, { Vector2StateObject } from '../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import AtomInfoUtils from '../../../shred/js/AtomInfoUtils.js';
import AtomConfig, { AtomConfigStateObject } from '../../../shred/js/model/AtomConfig.js';
import BooleanIO from '../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../tandem/js/types/IOType.js';
import NullableIO from '../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';

export type NuclearDecayAtomStateObject = {
  atomConfigBeforeDecay: AtomConfigStateObject;
  atomConfigAfterDecay: AtomConfigStateObject;
  halfLife: number;
  isActive: boolean;
  hasDecayed: boolean;
  time: number;
  decayTime: number | null;
  position: Vector2StateObject;
};

type SelfOptions = EmptySelfOptions;

export type NuclearDecayAtomOptions = SelfOptions;

export default class NuclearDecayAtom {

  // Number of protons, neutrons and electrons before the decay.
  public atomConfigBeforeDecay: AtomConfig;

  // Number of protons, neutrons and electrons after the decay (if it decays at all!)
  public atomConfigAfterDecay: AtomConfig;

  // Half-life of the isotope, in seconds.
  public halfLife: number;

  // Whether the atom is in the play area or not
  public isActive = false;

  // Whether the atom has decayed or not.
  public hasDecayed = false;

  // Pretty self-explanatory, don't you think?
  public time = 0;

  // Time it took to decay
  public decayTime: number | null = null;

  public position: Vector2 = new Vector2( 0, 0 );

  public constructor(
    atomConfigBeforeDecay: AtomConfig,
    atomConfigAfterDecay: AtomConfig,
    providedOptions?: NuclearDecayAtomOptions
  ) {

    // const options = optionize<NuclearDecayAtomOptions, EmptySelfOptions, NuclearDecayAtomOptions>()( {
    //   // no-op
    // }, providedOptions );

    this.atomConfigBeforeDecay = atomConfigBeforeDecay;
    this.atomConfigAfterDecay = atomConfigAfterDecay;

    const halfLife = AtomInfoUtils.getNuclideHalfLife( atomConfigBeforeDecay.protonCount, atomConfigBeforeDecay.neutronCount );
    this.halfLife = halfLife ? halfLife : Infinity; // Default to a half-life of INFINITY if the nuclide is not found in the data, which means it will decay immediately upon activation.

  }

  /**
   * Resets all fields.
   * AtomConfigs and half-life don't need resetting.
   */
  public reset(): void {
    this.isActive = false;
    this.hasDecayed = false;
    this.time = 0;
    this.decayTime = null;
    this.position = new Vector2( 0, 0 );
  }

  /**
   * Resets the decay process, which resets the time experienced by the atom back to zero and, if the atom has decayed,
   * resets the atom back to its original state.
   */
  public resetDecay(): void {
    this.time = 0;
    this.hasDecayed = false;
  }

  public copy(): NuclearDecayAtom {
    const newAtom = new NuclearDecayAtom( this.atomConfigBeforeDecay, this.atomConfigAfterDecay );
    newAtom.isActive = this.isActive;
    newAtom.hasDecayed = this.hasDecayed;
    newAtom.time = this.time;
    newAtom.decayTime = this.decayTime;
    newAtom.position = this.position.copy();
    return newAtom;
  }

  /**
   * Sets values for this atom based on a reference atom, used for serialization
   */
  public set( referenceAtom: NuclearDecayAtom ): void {
    this.isActive = referenceAtom.isActive;
    this.hasDecayed = referenceAtom.hasDecayed;
    this.time = referenceAtom.time;
    this.decayTime = referenceAtom.decayTime;
    this.position = referenceAtom.position.copy();
  }

  public step( dt: number ): void {
    if ( this.halfLife && !this.hasDecayed ) {
      this.time += dt; // Only advance time if the atom has not decayed.
      const probabilityOfDecay = NuclearDecayAtom.decayProbabilityOverInterval( this.halfLife, dt );
      if ( dotRandom.nextDouble() < probabilityOfDecay ) {
        this.hasDecayed = true;
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

  /**
   * Data-type IOType for PhET-iO serialization. NuclearDecayAtom is not a PhetioObject itself — it is serialized
   * by a parent model via aggregate state.
   */
  public static readonly NuclearDecayAtomIO = new IOType<NuclearDecayAtom, NuclearDecayAtomStateObject>( 'NuclearDecayAtomIO', {
    valueType: NuclearDecayAtom,
    stateSchema: {
      atomConfigBeforeDecay: AtomConfig.AtomConfigIO,
      atomConfigAfterDecay: AtomConfig.AtomConfigIO,
      halfLife: NumberIO,
      isActive: BooleanIO,
      hasDecayed: BooleanIO,
      time: NumberIO,
      decayTime: NullableIO( NumberIO ),
      position: Vector2.Vector2IO
    },
    fromStateObject: ( stateObject: NuclearDecayAtomStateObject ) => {
      const atom = new NuclearDecayAtom(
        new AtomConfig( stateObject.atomConfigBeforeDecay.protonCount, stateObject.atomConfigBeforeDecay.neutronCount, stateObject.atomConfigBeforeDecay.electronCount ),
        new AtomConfig( stateObject.atomConfigAfterDecay.protonCount, stateObject.atomConfigAfterDecay.neutronCount, stateObject.atomConfigAfterDecay.electronCount )
      );
      atom.isActive = stateObject.isActive;
      atom.hasDecayed = stateObject.hasDecayed;
      atom.time = stateObject.time;
      atom.decayTime = stateObject.decayTime;
      atom.position = Vector2.Vector2IO.fromStateObject( stateObject.position );
      return atom;
    }
  } );
}