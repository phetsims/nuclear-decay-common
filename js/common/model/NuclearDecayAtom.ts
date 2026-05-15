// Copyright 2026, University of Colorado Boulder

/**
 * NuclearDecayAtom is a model of an atom that can undergo a single nuclear decay. This model is a shared and widely
 * used element within the Nuclear Decay suite of sims.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import AtomInfoUtils, { DecayType, decayTypeValues } from '../../../../shred/js/AtomInfoUtils.js';
import AtomConfig, { AtomConfigStateObject } from '../../../../shred/js/model/AtomConfig.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceArrayIO from '../../../../tandem/js/types/ReferenceArrayIO.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import EjectedDecayParticle, { EjectedDecayParticleStateObject } from './EjectedDecayParticle.js';

export type NuclearDecayAtomStateObject = {
  ejectedDecayParticles: EjectedDecayParticleStateObject[];
  atomConfigBeforeDecay: AtomConfigStateObject;
  atomConfigAfterDecay: AtomConfigStateObject;
  decayType: DecayType;
  halfLife: number;
  isActive: boolean;
  hasDecayed: boolean;
  time: number;
  decayTime: number | null;
  position: Vector2StateObject;
};

type SelfOptions = {

  // Whether this atoms should eject lower mass decay products, such as alpha particle, when decay occurs.  This
  // defaults to `true`, but is useful to turn it off when modelling large numbers of atoms, and it isn't necessary to
  // depict ejected decay products.
  ejectParticlesOnDecay?: boolean;

  // Whether to restrict the angles at which particles are ejected during decay.  As of this writing, this restricts
  // ejected particles to a mostly horizontal range with little up/down motion.  This is needed in screens where the
  // atom has panels above and below, so that the particles aren't hidden from view too quickly.
  restrictEjectionAngles?: boolean;

  // The speed at which ejected decay particles move, in model units per second.
  particleEjectionSpeed?: number;
};

export type NuclearDecayAtomOptions = SelfOptions;

const DEFAULT_PARTICLE_EJECTION_SPEED = NuclearDecayCommonConstants.ATOM_RADIUS * 30; // in model units per second

// Define the angle ranges at which decay produce particles can be ejected when restricted angles are turned on.
const EJECTION_ANGLE_MULTIPLIER = 0.1;
const EJECTED_PARTICLE_ANGLE_RANGES = [
  new Range( -Math.PI * EJECTION_ANGLE_MULTIPLIER, Math.PI * EJECTION_ANGLE_MULTIPLIER ),
  new Range( Math.PI - Math.PI * EJECTION_ANGLE_MULTIPLIER, Math.PI + Math.PI * EJECTION_ANGLE_MULTIPLIER )
];

export default class NuclearDecayAtom {

  // Number of protons, neutrons and electrons before the decay.
  public atomConfigBeforeDecay: AtomConfig;

  // Number of protons, neutrons and electrons after the decay (if it decays at all!)
  public atomConfigAfterDecay: AtomConfig;

  // Half-life of the isotope, in seconds.
  private _halfLife: number;

  // Whether the atom is in the play area or not
  public isActive = false;

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

  // Whether the angles at which ejected decay particles are restricted to a limited range.
  private restrictEjectionAngles: boolean;

  // The speed at which ejected particles move away from the decayed atom.
  private particleEjectionSpeed: number;

  // See related options for description of this field.
  private ejectParticlesOnDecay: boolean;

  // The type of decay that this nucleus will undergo.
  private decayType: DecayType;

  public constructor(
    atomConfigBeforeDecay: AtomConfig,
    decayType: DecayType,
    providedOptions?: NuclearDecayAtomOptions
  ) {

    const options = optionize<NuclearDecayAtomOptions, SelfOptions, NuclearDecayAtomOptions>()( {
      ejectParticlesOnDecay: true,
      restrictEjectionAngles: false,
      particleEjectionSpeed: DEFAULT_PARTICLE_EJECTION_SPEED
    }, providedOptions );

    this.atomConfigBeforeDecay = atomConfigBeforeDecay;
    this.atomConfigAfterDecay = NuclearDecayAtom.deriveAtomConfigAfterDecay( atomConfigBeforeDecay, decayType );
    this.ejectParticlesOnDecay = options.ejectParticlesOnDecay;
    this.restrictEjectionAngles = options.restrictEjectionAngles;
    this.particleEjectionSpeed = options.particleEjectionSpeed;
    this.decayType = decayType;

    const halfLife = AtomInfoUtils.getNuclideHalfLife(
      atomConfigBeforeDecay.protonCount,
      atomConfigBeforeDecay.neutronCount
    );
    this._halfLife = halfLife ? halfLife : Infinity; // Default to a half-life of INFINITY if the nuclide is not found in the data, which means it will decay immediately upon activation.

    // Make sure the code handles the specified decay type.
    affirm( decayType === 'alphaDecay' || decayType === 'betaMinusDecay', `unhandled decay type: ${decayType}` );

    // Add the particles that will be ejected upon a decay event if this atom is so configured.
    if ( options.ejectParticlesOnDecay ) {
      if ( decayType === 'alphaDecay' ) {
        const particle = new EjectedDecayParticle( 'alpha', {

          animationSpeedProperty: new NumberProperty( options.particleEjectionSpeed ),

          // JPB REVIEW: Uh-oh. If we aren't providing tandems, what do we do here?
          tandem: Tandem.OPT_OUT
        } );
        this.ejectedDecayParticles.push( particle );
      }
      else if ( decayType === 'betaMinusDecay' ) {
        this.ejectedDecayParticles.push( new EjectedDecayParticle( 'electron', {
          animationSpeedProperty: new NumberProperty( options.particleEjectionSpeed ),
          tandem: Tandem.OPT_OUT
        } ) );

        // Note: We will also need to add the electron antineutrino as some point.
      }
    }
  }

  /**
   * As a convenience, provide a flag that indicates whether this atom has decayed.
   */
  public get hasDecayed(): boolean {
    return this.decayTime !== null;
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
    this.decayTime = null;
  }

  public copy(): NuclearDecayAtom {
    const newAtom = new NuclearDecayAtom( this.atomConfigBeforeDecay, this.decayType, {
      ejectParticlesOnDecay: this.ejectParticlesOnDecay,
      restrictEjectionAngles: this.restrictEjectionAngles,
      particleEjectionSpeed: this.particleEjectionSpeed
    } );
    newAtom._halfLife = this._halfLife;
    newAtom.isActive = this.isActive;
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
    this.time = referenceAtom.time;
    this.decayTime = referenceAtom.decayTime;
    this.decayType = referenceAtom.decayType;
    this.position = referenceAtom.position.copy();

    // Sets the relevant values for the existing ejected particles to avoid overwriting them
    // This is important since these properties are listened to by the particle respective nodes.
    referenceAtom.ejectedDecayParticles.forEach( ( particleState, i ) => {

      if ( i < this.ejectedDecayParticles.length ) {
        this.ejectedDecayParticles[ i ].isActiveProperty.value = particleState.isActiveProperty.value;
        this.ejectedDecayParticles[ i ].positionProperty.value = particleState.positionProperty.value;
        this.ejectedDecayParticles[ i ].destinationProperty.value = particleState.destinationProperty.value;
      }
    } );
  }

  /**
   * Sets the atomConfigBeforeDecay and derives the atomConfigAfterDecay based on the current decayType.
   */
  public setAtomConfigBeforeDecay( atomConfigBeforeDecay: AtomConfig ): void {
    this.atomConfigBeforeDecay = atomConfigBeforeDecay;
    this.atomConfigAfterDecay = NuclearDecayAtom.deriveAtomConfigAfterDecay( atomConfigBeforeDecay, this.decayType );
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

  /**
   * Step the atom forward in time.  This step function supports a separate, optional parameter for decay time so that
   * the time used to calculate decay can be separate from the time used to do things like animate the movement of the
   * atom.  This was done to support exponential decay times, but may be useful for other things as well.
   * @param dt - delta time, in seconds
   * @param [decayDt] - an optional separate time used in the decay calculation
   */
  public step( dt: number, decayDt = dt ): void {
    if ( this._halfLife && !this.hasDecayed ) {

      // Increment the time experienced by the atom.
      this.time += decayDt;

      // Decide whether the atom will decay in this particular time interval.
      const probabilityOfDecay = NuclearDecayAtom.decayProbabilityOverInterval( this._halfLife, decayDt );
      if ( dotRandom.nextDouble() < probabilityOfDecay ) {
        this.decayTime = this.time;

        // Activate and position the ejected decay particles.
        this.ejectedDecayParticles.forEach( particle => {
          particle.isActiveProperty.value = true;
          particle.positionProperty.value = this.position.copy();
          particle.destinationProperty.value = this.getEjectionDestination();
        } );
      }
    }
    else if ( this.hasDecayed && this.ejectedDecayParticles.length > 0 ) {
      this.ejectedDecayParticles.forEach( particle => {
        particle.step( dt );
      } );
    }
  }

  /**
   * Create a random destination for an ejected particle to travel to, based on the current position of the atom and the
   * settings for ejection angle restrictions.
   */
  private getEjectionDestination(): Vector2 {

    // Set the distance. In reality, ejected particles wouldn't stop until they hit or otherwise interacted with
    // something, but in the sim we don't bother moving them once they are out of view.
    const ejectionTravelDistance = NuclearDecayCommonConstants.ATOM_RADIUS * 500;

    let ejectionAngle: number; // in radians
    if ( !this.restrictEjectionAngles ) {

      // Use a fully random angle for the ejection.
      ejectionAngle = dotRandom.nextDouble() * 2 * Math.PI;
    }
    else {

      // Use a random ejection angle from the allowed ranges.
      const ejectionAngleRange = dotRandom.sample( EJECTED_PARTICLE_ANGLE_RANGES );
      ejectionAngle = ejectionAngleRange.min + dotRandom.nextDouble() * ejectionAngleRange.getLength();
    }
    const travelVector = new Vector2( ejectionTravelDistance, 0 ).rotated( ejectionAngle );
    return this.position.plus( travelVector );
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

  private static deriveAtomConfigAfterDecay( atomConfigBeforeDecay: AtomConfig, decayType: DecayType ): AtomConfig {
    affirm( decayType === 'alphaDecay' || decayType === 'betaMinusDecay', `unhandled decay type: ${decayType}` );
    if ( decayType === 'alphaDecay' ) {
      return new AtomConfig(
        atomConfigBeforeDecay.protonCount - 2,
        atomConfigBeforeDecay.neutronCount - 2,
        atomConfigBeforeDecay.electronCount - 2
      );
    }
    if ( decayType === 'betaMinusDecay' ) {
      return new AtomConfig(
        atomConfigBeforeDecay.protonCount + 1,
        atomConfigBeforeDecay.neutronCount - 1,
        atomConfigBeforeDecay.electronCount + 1
      );
    }

    // This code should be unreachable because of the affirm statements, but we need to return something to satisfy the
    // return type.
    return new AtomConfig( 1, 0, 1 );
  }

  /**
   * Data-type IOType for PhET-iO serialization. NuclearDecayAtom is not a PhetioObject itself — it is serialized
   * by a parent model via aggregate state.
   */
  public static readonly NuclearDecayAtomIO = new IOType<NuclearDecayAtom, NuclearDecayAtomStateObject>( 'NuclearDecayAtomIO', {
    valueType: NuclearDecayAtom,
    stateSchema: {
      atomConfigBeforeDecay: AtomConfig.AtomConfigIO,
      decayType: StringUnionIO( decayTypeValues ),
      atomConfigAfterDecay: AtomConfig.AtomConfigIO,
      halfLife: NumberIO,
      isActive: BooleanIO,
      hasDecayed: BooleanIO,
      time: NumberIO,
      decayTime: NullableIO( NumberIO ),
      position: Vector2.Vector2IO,
      ejectedDecayParticles: ReferenceArrayIO( EjectedDecayParticle.EjectedDecayParticleIO )
    },
    fromStateObject: ( stateObject: NuclearDecayAtomStateObject ) => {
      const atom = new NuclearDecayAtom(
        new AtomConfig( stateObject.atomConfigBeforeDecay.protonCount, stateObject.atomConfigBeforeDecay.neutronCount, stateObject.atomConfigBeforeDecay.electronCount ),
        stateObject.decayType
      );
      atom.isActive = stateObject.isActive;
      atom._halfLife = stateObject.halfLife;
      atom.time = stateObject.time;
      atom.decayTime = stateObject.decayTime;
      atom.position = Vector2.Vector2IO.fromStateObject( stateObject.position );

      stateObject.ejectedDecayParticles.forEach( ( particleState, i ) => {

        if ( i < atom.ejectedDecayParticles.length ) {
          atom.ejectedDecayParticles[ i ].isActiveProperty.value = particleState.isActive;
          atom.ejectedDecayParticles[ i ].positionProperty.value = Vector2.Vector2IO.fromStateObject( particleState.position );
          atom.ejectedDecayParticles[ i ].destinationProperty.value = Vector2.Vector2IO.fromStateObject( particleState.destination );
        }
      } );

      return atom;
    }
  } );
}
