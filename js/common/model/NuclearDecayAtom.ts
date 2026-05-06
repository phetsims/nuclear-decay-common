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
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import EjectedDecayParticle from './EjectedDecayParticle.js';

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

// const EJECTED_PARTICLE_SPEED = NuclearDecayCommonConstants.ATOM_RADIUS * 50; // in model units per second
// const EJECTED_PARTICLE_SPEED_PROPERTY = new NumberProperty( EJECTED_PARTICLE_SPEED );

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

  // Time experienced by the atom, in seconds. This stops advancing when the atom decays.
  public time = 0;

  // The time at which this atom decayed, or null if it has not decayed yet.
  public decayTime: number | null = null;

  // The location of this atom in model space.
  public position: Vector2 = new Vector2( 0, 0 );

  // The particles that will be ejected from this atom when decay occurs. These are the relatively light particles, such
  // as alpha particles and electrons, that will move away from the nucleus to depict a decay event.  The heavier
  // decay product, such as the lead nucleus that is left after polonium-211 decays by ejecting an alpha particle, is
  // not ejected and does not move away, so it will not be on this list.  These are populated during construction and
  // stay around forever, and are just activated and deactivated as needed when decay occurs and is reset.  This may
  // seem a bit odd, but having things always around instead of dynamically created and destroyed works better for
  // phet-io.
  public readonly ejectedDecayParticles: EjectedDecayParticle[] = [];

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

    if ( atomConfigBeforeDecay.protonCount === NuclearDecayCommonConstants.CUSTOM_UNDECAYED.protonCount ) {

      // JPB REVIEW: Does this need to handle beta decay too?  If so, it needs to be added.
      // In the custom case, an alpha particle is ejected.
      this.ejectedDecayParticles.push( new EjectedDecayParticle( 'alpha', {
        // animationSpeedProperty: EJECTED_PARTICLE_SPEED_PROPERTY,

        // JPB REVIEW: Uh-oh. If we aren't providing tandems, what do we do here?
        // tandem: Tandem.OPT_OUT
      } ) );
    }
    else {

      // Look up the type of decay that should occur based on the pre-decay configuration.
      const availableDecaysAndPercents = AtomInfoUtils.getAvailableDecaysAndPercents(
        this.atomConfigBeforeDecay.protonCount,
        this.atomConfigAfterDecay.neutronCount
      );

      affirm( availableDecaysAndPercents.length > 0, 'no decay information found for this isotope' );

      // Sort the decay information from most to least likely.
      availableDecaysAndPercents.sort( ( a, b ) => {
        const aLikelihood = a[ 1 ];
        const bLikelihood = b[ 1 ];

        if ( aLikelihood === null && bLikelihood === null ) {
          return 0;
        }
        if ( aLikelihood === null ) {
          return 1;
        }
        if ( bLikelihood === null ) {
          return -1;
        }
        return bLikelihood - aLikelihood;
      } );

      const mostPrevalentDecay = availableDecaysAndPercents[ 0 ][ 0 ];
      if ( mostPrevalentDecay === 'alphaDecay' ) {
        this.ejectedDecayParticles.push( new EjectedDecayParticle( 'alpha', {

          // animationSpeedProperty: EJECTED_PARTICLE_SPEED_PROPERTY,

          // JPB REVIEW: Uh-oh. If we aren't providing tandems, what do we do here?
          // tandem: Tandem.OPT_OUT
        } ) );
      }

      // Other decay types are not handled yet.
      affirm( mostPrevalentDecay === 'alphaDecay', 'unhandled decay type' );
    }
  }

  /**
   * Resets all fields.
   * AtomConfigs and half-life don't need resetting.
   */
  public reset(): void {
    this.resetDecay();
    this.isActive = false;
    this.position = new Vector2( 0, 0 );
  }

  /**
   * Resets the decay process, which resets the time experienced by the atom back to zero and, if the atom has decayed,
   * resets the atom back to its original state.
   */
  public resetDecay(): void {
    this.ejectedDecayParticles.forEach( particle => {
      particle.isActiveProperty.value = false;
      particle.positionProperty.value = this.position.copy();
    } );
    this.time = 0;
    this.hasDecayed = false;
    this.decayTime = null;
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

      // Increment the time experienced by the atom.
      this.time += dt;

      // Decide whether the atom will decay in this particular time interval.
      const probabilityOfDecay = NuclearDecayAtom.decayProbabilityOverInterval( this._halfLife, dt );
      if ( dotRandom.nextDouble() < probabilityOfDecay ) {
        this.hasDecayed = true;
        this.decayTime = this.time;

        // Activate and position the ejected decay particles.
        this.ejectedDecayParticles.forEach( particle => {
          particle.isActiveProperty.value = true;
          particle.positionProperty.value = this.position.copy();

          // Destination for ejected particles. In reality, they wouldn't stop until they hit something, but in the sim
          // we don't bother moving them once they are out of view.
          const ejectionTravelDistance = NuclearDecayCommonConstants.ATOM_RADIUS * 500;
          const travelVector = new Vector2( ejectionTravelDistance, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
          particle.destinationProperty.value = particle.positionProperty.value.plus( travelVector );
        } );
      }
    }
    else if ( this.hasDecayed && this.ejectedDecayParticles.length > 0 ) {
      this.ejectedDecayParticles.forEach( particle => {
        particle.step( dt );
      } );
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
      atom._halfLife = stateObject.halfLife;
      atom.time = stateObject.time;
      atom.decayTime = stateObject.decayTime;
      atom.position = Vector2.Vector2IO.fromStateObject( stateObject.position );
      return atom;
    }
  } );
}