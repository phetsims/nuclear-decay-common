// Copyright 2026, University of Colorado Boulder

/**
 * Atom that belongs to the Nuclear Decay Suite, it has information on the decay status and time.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AtomInfoUtils from '../../../../shred/js/AtomInfoUtils.js';
import AtomConfig, { AtomConfigStateObject } from '../../../../shred/js/model/AtomConfig.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';

export type NuclearDecayAtomStateObject = {
  atomConfigBeforeDecay: AtomConfigStateObject;
  atomConfigAfterDecay: AtomConfigStateObject;
  halfLife: number;
  isActive: boolean;
  hasDecayed: boolean;
  time: number;
  timeMode: TimeMode;
  decayTime: number | null;
  position: Vector2StateObject;
};

export type TimeMode = 'linear' | 'exponential';

type SelfOptions = EmptySelfOptions;

export type NuclearDecayAtomOptions = SelfOptions;

// These scale factors are used to scale sim time to the time experienced by the atom, in both linear and exponential
// time modes.
const LINEAR_TIME_SCALE_FACTOR = 1;
const EXPONENTIAL_TIME_SCALE_FACTOR = 1;

export default class NuclearDecayAtom {

  // Number of protons, neutrons and electrons before the decay.
  public atomConfigBeforeDecay: AtomConfig;

  // Number of protons, neutrons and electrons after the decay (if it decays at all!)
  public atomConfigAfterDecay: AtomConfig;

  // Half-life of the isotope, in seconds.
  private _halfLife: number;

  // Whether the atom is in the play area or not
  public isActive = false;

  // Whether the atom has decayed or not.
  public hasDecayed = false;

  // The time that this atom has experienced since the last time it was reset.  This value progresses differently in
  // the linear versus exponential time modes.
  public time = 0;

  // Whether time progresses in a linear or exponential fashion.
  private _timeMode: TimeMode = 'linear';

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

    const halfLife = AtomInfoUtils.getNuclideHalfLife(
      atomConfigBeforeDecay.protonCount,
      atomConfigBeforeDecay.neutronCount
    );
    this._halfLife = halfLife ? halfLife : Infinity; // Default to a half-life of INFINITY if the nuclide is not found in the data, which means it will decay immediately upon activation.
    this._timeMode = 'linear';
  }

  /**
   * Resets all fields.
   * AtomConfigs and half-life don't need resetting.
   */
  public reset(): void {
    this.isActive = false;
    this.hasDecayed = false;
    this.time = 0;
    this.timeMode = 'linear';
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

  // ES5 setter for time mode
  public set timeMode( value: TimeMode ) {
    affirm( this.time === 0, 'can\'t set time mode when running' );
    this._timeMode = value;
  }

  public copy(): NuclearDecayAtom {
    const newAtom = new NuclearDecayAtom( this.atomConfigBeforeDecay, this.atomConfigAfterDecay );
    newAtom._halfLife = this._halfLife;
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
    this._timeMode = referenceAtom._timeMode;
    this.decayTime = referenceAtom.decayTime;
    this.position = referenceAtom.position.copy();
  }

  /**
   * Derives the half-life from the current atomConfigBeforeDecay using the nuclide database. Used when switching
   * to a non-custom isotope whose half-life is a known physical constant.
   */
  public deriveHalfLife(): void {
    const halfLife = AtomInfoUtils.getNuclideHalfLife( this.atomConfigBeforeDecay.protonCount, this.atomConfigBeforeDecay.neutronCount );
    this._halfLife = halfLife ? halfLife : Infinity;
  }

  public get halfLife(): number {
    return this._halfLife;
  }

  public set halfLife( value: number ) {
    affirm( this.atomConfigBeforeDecay.equals( NuclearDecayCommonConstants.CUSTOM_UNDECAYED ),
      'halfLife can only be set directly on custom atoms' );
    this._halfLife = value;
  }

  public step( dt: number ): void {
    if ( this._halfLife && !this.hasDecayed ) {

      let timeInterval;

      // Advance the time based on the current time mode.
      if ( this._timeMode === 'linear' ) {
        timeInterval = dt * LINEAR_TIME_SCALE_FACTOR;
      }
      else {
        affirm( this._timeMode === 'exponential', 'unexpected time mode' );

        const startOfIntervalInLinearTime = Math.log10( this.time + 1 );
        const endOfIntervalInLinearTime = startOfIntervalInLinearTime + dt * EXPONENTIAL_TIME_SCALE_FACTOR;
        const endOfIntervalInExponentialTime = Math.pow( 10, endOfIntervalInLinearTime ) - 1;
        timeInterval = endOfIntervalInExponentialTime - this.time;
      }

      // Decide whether the atom will decay in this particular time interval.
      const probabilityOfDecay = NuclearDecayAtom.decayProbabilityOverInterval( this._halfLife, timeInterval );
      if ( dotRandom.nextDouble() < probabilityOfDecay ) {
        this.hasDecayed = true;
      }

      // Increment the time experience by the atom based on the calculated interval.
      this.time += timeInterval;
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
      timeMode: StringIO,
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
      atom._halfLife = stateObject.halfLife;
      atom.time = stateObject.time;
      atom.decayTime = stateObject.decayTime;
      atom.position = Vector2.Vector2IO.fromStateObject( stateObject.position );
      return atom;
    }
  } );
}