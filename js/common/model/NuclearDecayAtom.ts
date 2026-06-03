// Copyright 2026, University of Colorado Boulder

/**
 * NuclearDecayAtom is a model of an atom that can undergo a single nuclear decay. This model is a shared and widely
 * used element within the Nuclear Decay suite of sims.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import AtomInfoUtils, { DecayType, decayTypeValues } from '../../../../shred/js/AtomInfoUtils.js';
import AtomNameUtils from '../../../../shred/js/AtomNameUtils.js';
import AtomConfig from '../../../../shred/js/model/AtomConfig.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import EjectedDecayParticle, { EjectedDecayParticleStateObject } from './EjectedDecayParticle.js';

export type NuclearDecayAtomStateObject = {
  isotope: ValidIsotopes;
  ejectedDecayParticles: EjectedDecayParticleStateObject[];
  decayType: DecayType;
  halfLife: number;
  isActive: boolean;
  hasDecayed: boolean;
  time: number;
  decayTime: number | null;
  position: Vector2StateObject;
  ejectParticlesOnDecay: boolean;
};

// Isotopes that could be selected in the alpha decay or beta decay sim
export const StartingIsotopesValues = [ 'polonium-211', 'hydrogen-3', 'carbon-14', 'custom' ] as const;
export type StartingIsotopes = ( typeof StartingIsotopesValues )[ number ];

// Decay products that could be produced in the alpha decay or beta decay sim.
// These are not selectable by the user, but are used for internal logic and for display purposes.
export const DecayProductValues = [ 'lead-207', 'nitrogen-14', 'helium-3', 'custom-decayed' ];
export type DecayProducts = ( typeof DecayProductValues )[ number ];

// All isotopes that are valid in the sim, whether selectable or decay products.
export const ValidIsotopeValues = [ ...StartingIsotopesValues, ...DecayProductValues ] as const;
export type ValidIsotopes = ( typeof ValidIsotopeValues )[ number ];

const ISOTOPE_TO_ATOM_CONFIG = new Map<ValidIsotopes, AtomConfig>( [
  [ 'polonium-211', NuclearDecayCommonConstants.POLONIUM_211 ],
  [ 'lead-207', NuclearDecayCommonConstants.LEAD_207 ],
  [ 'carbon-14', NuclearDecayCommonConstants.CARBON_14 ],
  [ 'nitrogen-14', NuclearDecayCommonConstants.NITROGEN_14 ],
  [ 'hydrogen-3', NuclearDecayCommonConstants.HYDROGEN_3 ],
  [ 'helium-3', NuclearDecayCommonConstants.HELIUM_3 ],
  [ 'helium-2', NuclearDecayCommonConstants.ALPHA_PARTICLE ],
  [ 'custom', NuclearDecayCommonConstants.CUSTOM_UNDECAYED ],
  [ 'custom-decayed', NuclearDecayCommonConstants.CUSTOM_DECAYED ]
] );

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

  public isotope: ValidIsotopes;

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

  // An emitter that view elements can use to listen for when step function is called and catch updates.  This fires
  // at the end of the step function, so that all updates to the atom's state have already been made when this fires.
  public readonly steppedEmitter: Emitter<[ number ]> = new Emitter<[ number ]>( {
    parameters: [ { valueType: 'number' } ]
  } );

  // Whether the angles at which ejected decay particles are restricted to a limited range.
  private readonly restrictEjectionAngles: boolean;

  // The speed at which ejected particles move away from the decayed atom.
  private readonly particleEjectionSpeed: number;

  // See related options for description of this field.
  private readonly ejectParticlesOnDecay: boolean;

  // The type of decay that this nucleus will undergo.
  private decayType: DecayType;

  public constructor(
    isotope: ValidIsotopes,
    decayType: DecayType,
    providedOptions?: NuclearDecayAtomOptions
  ) {

    const options = optionize<NuclearDecayAtomOptions, SelfOptions, NuclearDecayAtomOptions>()( {
      ejectParticlesOnDecay: true,
      restrictEjectionAngles: false,
      particleEjectionSpeed: DEFAULT_PARTICLE_EJECTION_SPEED
    }, providedOptions );

    this.isotope = isotope;

    const atomConfigBeforeDecay = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
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
    this._halfLife = halfLife ? halfLife : Infinity; // Default to a half-life of INFINITY if the nuclide is not found in the data, which means it will never decay

    // Make sure the code handles the specified decay type.
    affirm( decayType === 'alphaDecay' || decayType === 'betaMinusDecay', `unhandled decay type: ${decayType}` );

    // Add the particles that will be ejected upon a decay event if this atom is so configured.
    if ( options.ejectParticlesOnDecay ) {
      if ( decayType === 'alphaDecay' ) {
        const particle = new EjectedDecayParticle( 'alpha', {
          animationSpeedProperty: new NumberProperty( options.particleEjectionSpeed ),
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

    if ( DecayProductValues.includes( this.isotope ) ) {
      this.setIsotope( NuclearDecayAtom.getDecayOrigin( this.isotope ) );
    }
  }

  public copy(): NuclearDecayAtom {
    const newAtom = new NuclearDecayAtom( this.isotope, this.decayType, {
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
    this.isotope = referenceAtom.isotope;
    this.setAtomConfigBeforeDecay( referenceAtom.atomConfigBeforeDecay );
    this.isActive = referenceAtom.isActive;
    this.time = referenceAtom.time;
    this.decayTime = referenceAtom.decayTime;
    this.decayType = referenceAtom.decayType;
    this.position = referenceAtom.position.copy();

    // Sets the relevant values for the existing ejected particles to avoid overwriting them
    // This is important since these properties are listened to by the particle respective nodes.
    this.setEjectedDecayParticles( referenceAtom.ejectedDecayParticles );
  }

  /**
   * Sets values for individual ejected decay particles based on a reference array
   */
  public setEjectedDecayParticles( referenceParticles: EjectedDecayParticle[] ): void {
    affirm( referenceParticles.length === this.ejectedDecayParticles.length, 'Should be same length!' );

    referenceParticles.forEach( ( particleState, i ) => {
      this.ejectedDecayParticles[ i ].set( particleState );
    } );
  }

  public setIsotope( newIsotope: StartingIsotopes ): void {
    this.isotope = newIsotope;
    const newAtomConfig = NuclearDecayAtom.getIsotopeAtomConfig( newIsotope );
    this.setAtomConfigBeforeDecay( newAtomConfig );
    this.deriveHalfLife();
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

  /**
   * Utility function to get the half-life of a starting isotope
   */
  public static getHalfLife( isotope: StartingIsotopes ): number | null {
    const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
    return AtomInfoUtils.getNuclideHalfLife( atomConfig.protonCount, atomConfig.neutronCount );
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
   * Get the atom config of an arbitrary isotope
   */
  public static getIsotopeAtomConfig( isotope: ValidIsotopes ): AtomConfig {
    affirm( ISOTOPE_TO_ATOM_CONFIG.has( isotope ), `No AtomConfig found for selected isotope: ${isotope}` );
    return ISOTOPE_TO_ATOM_CONFIG.get( isotope )!;
  }

  /**
   * Creates a reactive string property that tracks the name-and-mass of the currently selected isotope.
   * Callers pass a customStringProperty for the 'custom' case so this method stays free of i18n imports.
   * Similar to AtomNameUtils.createDynamicNameProperty but with name and mass.
   * e.g. Polonium-211
   */
  public static createDynamicIsotopeNameAndMassStringProperty(
    selectedIsotopeProperty: TReadOnlyProperty<StartingIsotopes>,
    customStringProperty: TReadOnlyProperty<string>
  ): TReadOnlyProperty<string> {
    const currentStringProperty = new Property<TReadOnlyProperty<string>>( customStringProperty );
    const dynamicNameProperty = new DynamicProperty<string, string, TReadOnlyProperty<string>>( currentStringProperty );
    selectedIsotopeProperty.link( isotope => {
      if ( isotope === 'custom' ) {
        currentStringProperty.value = customStringProperty;
      }
      else {
        const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
        currentStringProperty.value = AtomNameUtils.getNameAndMass( atomConfig.protonCount, atomConfig.neutronCount );
      }
    } );
    return dynamicNameProperty;
  }

  /**
   * Creates a reactive string property that tracks the name-and-mass of the decay product for the currently selected
   * isotope. Callers pass a customDecayedStringProperty for the 'custom-decayed' case so this method stays free of
   * i18n imports. e.g. Lead-207
   */
  public static createDynamicDecayProductNameAndMassStringProperty(
    selectedIsotopeProperty: TReadOnlyProperty<StartingIsotopes>,
    customDecayedStringProperty: TReadOnlyProperty<string>
  ): TReadOnlyProperty<string> {
    const currentStringProperty = new Property<TReadOnlyProperty<string>>( customDecayedStringProperty );
    const dynamicNameProperty = new DynamicProperty<string, string, TReadOnlyProperty<string>>( currentStringProperty );
    selectedIsotopeProperty.link( isotope => {
      const decayProduct = NuclearDecayAtom.getDecayProduct( isotope );
      if ( decayProduct === 'custom-decayed' ) {
        currentStringProperty.value = customDecayedStringProperty;
      }
      else {
        const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( decayProduct );
        currentStringProperty.value = AtomNameUtils.getNameAndMass( atomConfig.protonCount, atomConfig.neutronCount );
      }
    } );
    return dynamicNameProperty;
  }

  /**
   * Get a string with the mass and symbol of an isotope (211-Pb) for example, or a custom string if 'custom' is selected.
   */
  public static getIsotopeMassAndSymbolString( isotope: ValidIsotopes ): string {
    if ( isotope === 'custom' ) { return 'A'; }
    if ( isotope === 'custom-decayed' ) { return 'B';}
    const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
    return AtomNameUtils.getMassAndSymbol( atomConfig.protonCount, atomConfig.neutronCount );
  }

  /**
   * Get the decay product for the provided isotope. The provided product is a single isotope, and is the decay that is
   * modeled in this simulation. It may not be generally true for all isotopes in physical reality, since different
   * decay paths are sometimes possible.
   */
  public static getDecayProduct( isotope: StartingIsotopes ): DecayProducts {
    let decayProduct: DecayProducts | null = null;
    if ( isotope === 'custom' ) {
      decayProduct = 'custom-decayed';
    }
    else if ( isotope === 'polonium-211' ) {
      decayProduct = 'lead-207';
    }
    else if ( isotope === 'hydrogen-3' ) {
      decayProduct = 'helium-3';
    }
    else if ( isotope === 'carbon-14' ) {
      decayProduct = 'nitrogen-14';
    }
    affirm( decayProduct !== null, 'Unhandled isotope type' );
    return decayProduct;
  }

  public static getDecayOrigin( isotope: DecayProducts ): StartingIsotopes {
    let decayOrigin: StartingIsotopes | null = null;
    if ( isotope === 'custom-decayed' ) {
      decayOrigin = 'custom';
    }
    else if ( isotope === 'lead-207' ) {
      decayOrigin = 'polonium-211';
    }
    else if ( isotope === 'helium-3' ) {
      decayOrigin = 'hydrogen-3';
    }
    else if ( isotope === 'nitrogen-14' ) {
      decayOrigin = 'carbon-14';
    }
    affirm( decayOrigin !== null, 'Unhandled isotope type' );
    return decayOrigin;
  }


  /**
   * Step the atom forward in time.  This step function supports a separate, optional parameter for decay time so that
   * the time used to calculate decay can be separate from the time used to do things like animate the movement of the
   * atom.  This was done to support exponential decay times, but may be useful for other things as well.
   * @param dt - delta time, in seconds
   * @param [decayDt] - an optional separate time used in the decay calculation
   */
  public step( dt: number, decayDt = dt ): void {

    // If this atom is undecayed and could decay, run the calculations to decide whether it will decay in this step.
    if ( this._halfLife !== Infinity && !this.hasDecayed ) {

      // Increment the time experienced by the atom.
      this.time += decayDt;

      // If half-life is infinity, only step the atom but not calculate for any decay
      // Decide whether the atom will decay in this particular time interval.
      const probabilityOfDecay = NuclearDecayAtom.decayProbabilityOverInterval( this._halfLife, decayDt );
      if ( dotRandom.nextDouble() < probabilityOfDecay ) {
        this.decayTime = this.time;

        affirm( !DecayProductValues.includes( this.isotope ), 'Atom must not have a decayed isotope type before decaying' );
        this.isotope = NuclearDecayAtom.getDecayProduct( this.isotope as StartingIsotopes );

        // Activate and position the ejected decay particles.
        this.ejectedDecayParticles.forEach( particle => {
          particle.isActiveProperty.value = true;
          particle.positionProperty.value = this.position.copy();
          particle.destinationProperty.value = this.getEjectionDestination();
        } );
      }
    }
    else if ( this.hasDecayed && this.ejectedDecayParticles.length > 0 ) {

      // Step any particles were ejected when this atom decayed.
      this.ejectedDecayParticles.forEach( particle => {
        particle.step( dt );
      } );
    }

    this.steppedEmitter.emit( dt );
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
      isotope: StringUnionIO( StartingIsotopesValues ),
      decayType: StringUnionIO( decayTypeValues ),
      halfLife: NumberIO,
      isActive: BooleanIO,
      hasDecayed: BooleanIO,
      time: NumberIO,
      decayTime: NullableIO( NumberIO ),
      position: Vector2.Vector2IO,
      ejectedDecayParticles: ArrayIO( EjectedDecayParticle.EjectedDecayParticleIO ),
      ejectParticlesOnDecay: BooleanIO
    },
    fromStateObject: ( stateObject: NuclearDecayAtomStateObject ) => {
      const atom = new NuclearDecayAtom(
        stateObject.isotope,
        stateObject.decayType,
        { ejectParticlesOnDecay: stateObject.ejectParticlesOnDecay }
      );
      atom.isActive = stateObject.isActive;
      atom._halfLife = stateObject.halfLife;
      atom.time = stateObject.time;
      atom.decayTime = stateObject.decayTime;
      atom.position = Vector2.Vector2IO.fromStateObject( stateObject.position );

      const deserializedEjectedParticles = ArrayIO( EjectedDecayParticle.EjectedDecayParticleIO ).fromStateObject( stateObject.ejectedDecayParticles );

      atom.setEjectedDecayParticles( deserializedEjectedParticles );

      return atom;
    }
  } );
}
