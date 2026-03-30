// Copyright 2026, University of Colorado Boulder
/**
 * Base model for the nuclear decay sim, which will hold the state of the nucleus and perform the decay calculations.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import createObservableArray, { ObservableArray } from '../../../axon/js/createObservableArray.js';
import Emitter from '../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Range from '../../../dot/js/Range.js';
import TModel from '../../../joist/js/TModel.js';
import Shape from '../../../kite/js/Shape.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import AtomInfoUtils from '../../../shred/js/AtomInfoUtils.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import AtomConfig from '../../../shred/js/model/AtomConfig.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayAtom from './NuclearDecayAtom.js';

export const ValidIsotopeValues = [ 'custom', 'polonium-211', 'lead-207', 'carbon-14', 'nitrogen-14', 'hydrogen-3', 'helium-3', 'helium-2' ] as const;
export type ValidIsotopes = ( typeof ValidIsotopeValues )[ number ];

export const SelectableIsotopesValues = [ 'custom', 'polonium-211', 'hydrogen-3', 'carbon-14' ] as const;
export type SelectableIsotopes = ( typeof SelectableIsotopesValues )[ number ];

const ISOTOPE_TO_ATOM_CONFIG = new Map<ValidIsotopes, AtomConfig>( [
  [ 'polonium-211', NuclearDecayCommonConstants.POLONIUM_211 ],
  [ 'lead-207', NuclearDecayCommonConstants.LEAD_207 ],
  [ 'carbon-14', NuclearDecayCommonConstants.CARBON_14 ],
  [ 'nitrogen-14', NuclearDecayCommonConstants.NITROGEN_14 ],
  [ 'hydrogen-3', NuclearDecayCommonConstants.HYDROGEN_3 ],
  [ 'helium-3', NuclearDecayCommonConstants.HELIUM_3 ],
  [ 'helium-2', NuclearDecayCommonConstants.ALPHA_PARTICLE ],
  [ 'custom', new AtomConfig( 1, 1, 1 ) ]
] );

// Bounds where the atoms can be placed, in model coordinates.
const ATOM_AREA_BOUNDS = new Bounds2( -375, -100, 375, 100 );

type SelfOptions = {
  maxNumberOfAtoms?: number;
};

export type NuclearDecayModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class NuclearDecayModel implements TModel {

  // List of the selectable isotopes in the sim. Defined by subclasses.
  public readonly abstract selectableIsotopes: SelectableIsotopes[];

  // What isotope is currently selected in the sim. Defined by subclasses.
  // 'polonium-211' vs 'custom' in Alpha Decay, or 'carbon-14' vs 'hydrogen-3' vs 'custom' in Beta Decay.
  public readonly abstract selectedIsotopeProperty: Property<SelectableIsotopes>;

  // Set by default to the half-life of the selected isotope, but can be changed by the user if 'custom' is selected.
  public readonly selectedHalfLifeProperty: NumberProperty;

  public readonly isPlayingProperty: BooleanProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly timeProperty: NumberProperty;

  // Atoms currently in the play area
  public readonly activeAtoms: ObservableArray<NuclearDecayAtom>;

  // How many atoms we'll add to play area when pressing the 'Add Atoms' button
  public readonly atomsToAddProperty: NumberProperty;

  // Subset of activeAtoms, just the ones that have not decayed yet.
  public undecayedAtoms: NuclearDecayAtom[];

  // NOT a subset of activeAtoms, but rather a reference of all the atoms that have fallen.
  // Useful especially for graphing atoms that are no longer active in the play area.
  public readonly decayedAtoms: ObservableArray<NuclearDecayAtom>;

  // The area in which atoms can be placed.  This is in model coordinates.
  public readonly atomPlacementArea: Shape = Shape.bounds( ATOM_AREA_BOUNDS );

  public readonly isPlayAreaEmptyProperty: BooleanProperty;

  public readonly maxNumberOfAtoms: number;

  // TODO: Temporary update emitter while we decide how to wire up graph updates; https://github.com/phetsims/alpha-decay/issues/3
  public readonly updateEmitter = new Emitter();

  protected constructor( providedOptions?: NuclearDecayModelOptions ) {

    const options = combineOptions<NuclearDecayModelOptions>( {
      maxNumberOfAtoms: 1000 // NuclearDecayCommonConstants.MAX_ATOMS
    }, providedOptions );

    this.selectedHalfLifeProperty = new NumberProperty( 1, {
      tandem: options.tandem.createTandem( 'selectedHalfLifeProperty' )
    } );

    this.maxNumberOfAtoms = options.maxNumberOfAtoms!;

    // For second and third screens we'll start with this many. Using min to handle first screen.
    const DEFAULT_ATOMS_TO_ADD = 100;
    this.atomsToAddProperty = new NumberProperty(
      Math.min( this.maxNumberOfAtoms, DEFAULT_ATOMS_TO_ADD ), {
        range: new Range( 1, this.maxNumberOfAtoms ),
        tandem: options.tandem.createTandem( 'atomsToAddProperty' )
      } );

    this.activeAtoms = createObservableArray();
    this.undecayedAtoms = createObservableArray();
    this.decayedAtoms = createObservableArray();

    this.activeAtoms.lengthProperty.link( () => {
      this.undecayedAtoms = this.activeAtoms.filter( atom => !atom.hasDecayed );
    } );

    this.isPlayAreaEmptyProperty = new BooleanProperty( true );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' )
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: options.tandem.createTandem( 'timeSpeedProperty' )
    } );
  }

  /**
   * Function for the model to return the currently selected isotope's AtomConfig.
   */
  public getSelectedIsotopeAtomConfig(): AtomConfig {
    const selectedIsotope = this.selectedIsotopeProperty.value;
    affirm( selectedIsotope !== 'custom', 'Should not be called when custom is selected' );
    return NuclearDecayModel.getIsotopeAtomConfig( selectedIsotope );
  }

  /**
   * Get the atom config of an arbitrary isotope
   */
  public static getIsotopeAtomConfig( isotope: ValidIsotopes ): AtomConfig {
    affirm( ISOTOPE_TO_ATOM_CONFIG.has( isotope ), `No AtomConfig found for selected isotope: ${isotope}` );
    return ISOTOPE_TO_ATOM_CONFIG.get( isotope )!;
  }

  /**
   * Get a string with the mass and symbol of an isotope (211-Pb) for example, or a custom string if 'custom' is selected.
   */
  public static getIsotopeMassAndSymbolString( isotope: ValidIsotopes, customAnswer = '' ): string {
    if ( isotope === 'custom' ) { return customAnswer; }
    const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
    return AtomNameUtils.getMassAndSymbol( atomConfig.protonCount, atomConfig.neutronCount );
  }

  /**
   * Get the decay product for the provided isotope. The provided product is a single isotope, and is the decay that is
   * modeled in this simulation. It may not be generally true for all isotopes in physical reality, since different
   * decay paths are sometimes possible.
   */
  public static getDecayProduct( isotope: SelectableIsotopes ): ValidIsotopes {
    let decayProduct: ValidIsotopes | null = null;
    if ( isotope === 'custom' ) {
      decayProduct = 'custom';
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

  public getHalfLife( isotope: SelectableIsotopes ): number {
    if ( isotope === 'custom' ) {
      return this.selectedHalfLifeProperty.value;
    }
    const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
    const halfLife = AtomInfoUtils.getNuclideHalfLife( atomConfig.protonCount, atomConfig.neutronCount );
    affirm( halfLife !== null, 'Should provide a valid isotope with a known half-life' );
    return halfLife;
  }

  /**
   * Adds exactly one instance of the selected isotope into the model.
   */
  public addAtom(): void {
    affirm( this.activeAtoms.length < this.maxNumberOfAtoms, 'Cannot add more atoms, max number of atoms reached' );
    const selectedIsotope = this.selectedIsotopeProperty.value;
    if ( selectedIsotope !== 'custom' ) {
      const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( selectedIsotope );
      const postDecayAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( NuclearDecayModel.getDecayProduct( selectedIsotope ) );
      const atom = new NuclearDecayAtom( atomConfig, postDecayAtomConfig );
      atom.isActive = true;
      this.activeAtoms.add( atom );
    }
    else {
      console.warn( 'Custom atoms not yet supported.' );
    }
  }

  /**
   * When adding many atoms, reset everything and then add them.
   */
  public addNAtoms( n: number ): void {
    this.reset();
    _.times( n, () => this.addAtom() );
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {

    this.isPlayAreaEmptyProperty.value = this.activeAtoms.length === 0;

    if ( this.isPlayingProperty.value && !this.isPlayAreaEmptyProperty.value ) {
      const timeSpeedScale = this.timeSpeedProperty.value === TimeSpeed.NORMAL ?
                             NuclearDecayCommonConstants.NORMAL_SPEED_SCALE :
                             NuclearDecayCommonConstants.SLOW_SPEED_SCALE;
      this.stepModel( dt * timeSpeedScale );
      this.activeAtoms.forEach( ( atom: NuclearDecayAtom ) => {
        const hadDecayed = atom.hasDecayed;
        atom.step( dt * timeSpeedScale );

        if ( !hadDecayed && atom.hasDecayed ) {
          this.undecayedAtoms = this.activeAtoms.filter( atom => !atom.hasDecayed );
          this.decayedAtoms.add( atom );
        }
      } );
    }

    // TODO: Gross https://github.com/phetsims/alpha-decay/issues/3
    this.updateEmitter.emit();
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.activeAtoms.clear();
    this.decayedAtoms.clear();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
    this.timeProperty.reset();
  }

  /**
   * Steps the model forward by a single manual step (when paused).
   */
  public manualStep(): void {
    this.stepModel( NuclearDecayCommonConstants.MANUAL_STEP_DT );
  }

  /**
   * Restarts the simulation to its initial state. Override in subclasses to implement specific restart behavior.
   */
  public restart(): void {
    // no-op in base class, but can be overridden in subclasses to implement specific restart behavior
  }

  /**
   * Steps the model by the given dt. Override in subclasses to implement actual model behavior.
   * @param dt - effective time step, in seconds (can be negative for backward steps)
   */
  protected stepModel( dt: number ): void {
    this.timeProperty.value += dt;
  }
}
