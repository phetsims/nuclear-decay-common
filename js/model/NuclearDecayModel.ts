// Copyright 2026, University of Colorado Boulder
/**
 * Base model for the nuclear decay sim, which will hold the state of the nucleus and perform the decay calculations.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import TModel from '../../../joist/js/TModel.js';
import Shape from '../../../kite/js/Shape.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../phet-core/js/types/IntentionalAny.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import AtomInfoUtils from '../../../shred/js/AtomInfoUtils.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import AtomConfig from '../../../shred/js/model/AtomConfig.js';
import PhetioObject, { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import NullableIO from '../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import ReferenceArrayIO from '../../../tandem/js/types/ReferenceArrayIO.js';
import StringUnionIO from '../../../tandem/js/types/StringUnionIO.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import HistogramData from './HistogramData.js';
import NuclearDecayAtom from './NuclearDecayAtom.js';

// Isotopes that could be selected in the alpha decay or beta decay sim
export const SelectableIsotopesValues = [ 'polonium-211', 'hydrogen-3', 'carbon-14', 'custom' ] as const;
export type SelectableIsotopes = ( typeof SelectableIsotopesValues )[ number ];

// Decay products that could be produced in the alpha decay or beta decay sim.
// These are not selectable by the user, but are used for internal logic and for display purposes.
export const DecayProductValues = [ 'lead-207', 'nitrogen-14', 'helium-3', 'custom-decayed' ];
export type DecayProducts = ( typeof DecayProductValues )[ number ];

// All isotopes that are valid in the sim, whether selectable or decay products.
export const ValidIsotopeValues = [ ...SelectableIsotopesValues, ...DecayProductValues ] as const;
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

// Bounds where the atoms can be placed, in model coordinates.  Decay products are allowed to move outside of these
// bounds.
const DEFAULT_ATOM_AREA_BOUNDS = new Bounds2( -100, -100, 100, 100 );

type SelfOptions = {
  maxNumberOfAtoms?: number;
};

export type NuclearDecayModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class NuclearDecayModel extends PhetioObject implements TModel {

  public readonly isSingleAtomMode: boolean;

  // List of the selectable isotopes in the sim. Provided by subclasses
  public readonly selectableIsotopes: SelectableIsotopes[];

  // What isotope is currently selected in the sim.
  // 'polonium-211' vs 'custom' in Alpha Decay, or 'carbon-14' vs 'hydrogen-3' vs 'custom' in Beta Decay.
  public readonly selectedIsotopeProperty: Property<SelectableIsotopes>;

  // The user-editable half-life for custom isotopes, in seconds.
  public readonly customHalfLifeProperty: NumberProperty;

  // The effective half-life for the currently selected isotope. For non-custom isotopes this is derived from the
  // nuclide database; for custom isotopes it reflects the user-controlled customHalfLifeProperty.
  public readonly halfLifeProperty: TReadOnlyProperty<number>;

  public readonly isPlayingProperty: BooleanProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly timeProperty: NumberProperty;

  // The time at which the last atom decayed, or null if it hasn't decayed yet.
  public readonly lastDecayTimeProperty: Property<number | null>;

  // Pool of all existing atoms originally set to inactive
  public readonly atomPool: NuclearDecayAtom[] = [];

  // Atoms currently in the play area
  public activeAtoms: NuclearDecayAtom[];

  // Subset of activeAtoms, just the ones that have not decayed yet.
  public undecayedAtoms: NuclearDecayAtom[];

  // NOT a subset of activeAtoms, but rather a reference of all the atoms that have fallen.
  // Useful especially for graphing atoms that are no longer active in the play area.
  public readonly decayedAtoms: NuclearDecayAtom[];

  // Number of active atoms
  public readonly activeAtomsCountProperty: TReadOnlyProperty<number>;

  // Number of undecayed atoms remaining.
  public readonly undecayedCountProperty: NumberProperty;

  // Number of decayed atoms.
  public readonly decayedCountProperty: NumberProperty;

  // Current percentage of undecayed atoms (0-1).
  public readonly percentageOfUndecayedProperty: TReadOnlyProperty<number>;

  // Current percentage of decayed atoms (0-1).
  public readonly percentageOfDecayedProperty: TReadOnlyProperty<number>;

  // The area in which atoms can be placed.  This is in model coordinates and can (and should) be updated by the view
  // once the view is constructed and therefore knows what space is available in the screen view.
  public readonly atomPlacementAreaProperty: Property<Shape>;

  public readonly isPlayAreaEmptyProperty: BooleanProperty;

  public readonly maxNumberOfAtoms: number;

  public readonly histogramData: HistogramData;

  protected constructor(
    selectableIsotopes: SelectableIsotopes[],
    providedOptions?: NuclearDecayModelOptions
  ) {

    const options = optionize<NuclearDecayModelOptions, SelfOptions, PhetioObjectOptions>()( {
      maxNumberOfAtoms: NuclearDecayCommonConstants.MAX_ATOMS,
      phetioType: NuclearDecayModel.NuclearDecayModelIO,
      phetioState: true
    }, providedOptions );

    super( options );

    this.selectableIsotopes = selectableIsotopes;

    this.selectedIsotopeProperty = new Property<SelectableIsotopes>( 'polonium-211', {
      tandem: options.tandem.createTandem( 'selectedIsotopeProperty' ),
      phetioValueType: StringUnionIO( SelectableIsotopesValues ),
      validValues: SelectableIsotopesValues,
      phetioFeatured: true
    } );

    this.customHalfLifeProperty = new NumberProperty( 2, {
      tandem: options.tandem.createTandem( 'customHalfLifeProperty' ),
      range: new Range( 0, Number.POSITIVE_INFINITY ),
      phetioFeatured: true
    } );

    // The effective half-life for the selected isotope. For real isotopes (e.g. polonium-211), this looks up the
    // known half-life from the nuclide database via AtomInfoUtils. For the 'custom' isotope, it reflects the
    // user-controlled customHalfLifeProperty, allowing the half-life to be set via a slider. Because this is a
    // DerivedProperty, it automatically updates when the user switches isotopes or adjusts the custom half-life.
    this.halfLifeProperty = new DerivedProperty(
      [ this.selectedIsotopeProperty, this.customHalfLifeProperty ],
      ( selectedIsotope, customHalfLife ) => {
        if ( selectedIsotope === 'custom' ) {
          return customHalfLife;
        }
        const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( selectedIsotope );
        const halfLife = AtomInfoUtils.getNuclideHalfLife( atomConfig.protonCount, atomConfig.neutronCount );
        affirm( halfLife !== null, 'Should provide a valid isotope with a known half-life' );
        return halfLife;
      }, {
        tandem: options.tandem.createTandem( 'halfLifeProperty' ),
        phetioValueType: NumberIO
      }
    );

    this.atomPlacementAreaProperty = new Property<Shape>( Shape.bounds( DEFAULT_ATOM_AREA_BOUNDS ), {
      tandem: Tandem.OPT_OUT
    } );

    this.maxNumberOfAtoms = options.maxNumberOfAtoms!;

    this.isSingleAtomMode = options.maxNumberOfAtoms === 1;

    const selectedIsotope = this.selectedIsotopeProperty.value;
    const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( selectedIsotope );
    const postDecayAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( NuclearDecayModel.getDecayProduct( selectedIsotope ) );

    // Prepopulate all the atoms
    _.times( this.maxNumberOfAtoms, () => {
      const atom = new NuclearDecayAtom( atomConfig, postDecayAtomConfig );
      this.atomPool.push( atom );
    } );

    this.selectedIsotopeProperty.lazyLink( selectedIsotope => {
      this.setNewIsotope( selectedIsotope );
    } );

    // When the custom half-life changes, push the new value to all atoms in the pool.
    this.customHalfLifeProperty.lazyLink( customHalfLife => {
      if ( this.selectedIsotopeProperty.value === 'custom' ) {
        this.atomPool.forEach( atom => {
          atom.halfLife = customHalfLife;
        } );
      }
    } );

    this.activeAtoms = [];
    this.undecayedAtoms = [];
    this.decayedAtoms = [];

    this.undecayedCountProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'undecayedCountProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.decayedCountProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'decayedCountProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.activeAtomsCountProperty = new DerivedProperty(
      [ this.undecayedCountProperty, this.decayedCountProperty ],
      ( undecayed, decayed ) => undecayed + decayed, {
        tandem: options.tandem.createTandem( 'activeAtomsCountProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO
      }
    );

    this.percentageOfUndecayedProperty = new DerivedProperty(
      [ this.undecayedCountProperty, this.decayedCountProperty ],
      ( undecayed, decayed ) => {
        const total = undecayed + decayed;
        return total > 0 ? undecayed / total : 1;
      }, {
        phetioValueType: NumberIO,
        tandem: options.tandem.createTandem( 'percentageOfUndecayedProperty' )
      }
    );

    this.percentageOfDecayedProperty = new DerivedProperty(
      [ this.undecayedCountProperty, this.decayedCountProperty ],
      ( undecayed, decayed ) => {
        const total = undecayed + decayed;
        return total > 0 ? decayed / total : 1;
      }, {
        phetioValueType: NumberIO,
        tandem: options.tandem.createTandem( 'percentageOfDecayedProperty' )
      }
    );

    this.histogramData = new HistogramData( this );

    this.isPlayAreaEmptyProperty = new BooleanProperty( true );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.lastDecayTimeProperty = new Property<number | null>( null, {
      tandem: options.tandem.createTandem( 'lastDecayTimeProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: options.tandem.createTandem( 'timeSpeedProperty' ),
      phetioFeatured: true
    } );
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {

    this.undecayedAtoms = this.activeAtoms.filter( atom => !atom.hasDecayed );

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
          this.lastDecayTimeProperty.value = this.timeProperty.value;
          atom.decayTime = this.timeProperty.value;
          this.undecayedAtoms = this.activeAtoms.filter( atom => !atom.hasDecayed );
          this.decayedAtoms.push( atom.copy() );

          // Update the count inside the loop is important to trigger the sound in the view
          this.decayedCountProperty.value = this.decayedAtoms.length;

        }
      } );
    }

    this.histogramData.step();
    this.undecayedCountProperty.value = this.undecayedAtoms.length;
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
    if ( isotope === 'custom' || isotope === 'custom-decayed' ) { return customAnswer; }
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

  public getHalfLife( isotope: SelectableIsotopes ): number {
    if ( isotope === 'custom' ) {
      return this.customHalfLifeProperty.value;
    }
    const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
    const halfLife = AtomInfoUtils.getNuclideHalfLife( atomConfig.protonCount, atomConfig.neutronCount );
    affirm( halfLife !== null, 'Should provide a valid isotope with a known half-life' );
    return halfLife;
  }

  /**
   * When adding many atoms, clear the existing atoms and then add new ones.
   */
  public activateMultipleAtoms( n: number ): void {
    this.clearAtomLists();
    this.timeProperty.reset();
    // Activate multiple atoms with random positions
    _.times( n, () => this.activateAtom( true ) );
  }

  /**
   * Adds exactly one instance of the selected isotope into the model.
   */
  public activateAtom( randomizePosition = false ): void {
    if ( this.activeAtoms.length === this.maxNumberOfAtoms ) {
      // Max number of atoms already active, do not add more.
      return;
    }
    const atom = this.atomPool.find( atom => !atom.isActive );
    affirm( atom, 'No available atoms to activate!' );

    // Activate the atom.
    atom.isActive = true;

    // TODO: We probably need to make sure the config is correct here, see https://github.com/phetsims/alpha-decay/issues/3.

    if ( randomizePosition ) {
      atom.position = this.getRandomPositionWithinBounds();
    }
    this.activeAtoms.push( atom );
  }

  private setNewIsotope( newIsotope: SelectableIsotopes ): void {
    this.lastDecayTimeProperty.reset();
    this.timeProperty.reset();
    this.clearAtomLists();

    const newDecayProduct = NuclearDecayModel.getDecayProduct( newIsotope );
    const newAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( newIsotope );
    const newPostDecayAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( newDecayProduct );

    this.atomPool.forEach( atom => {
      atom.reset();
      atom.atomConfigBeforeDecay = newAtomConfig;
      atom.atomConfigAfterDecay = newPostDecayAtomConfig;

      if ( newIsotope === 'custom' ) {
        atom.halfLife = this.getHalfLife( newIsotope );
      }
      else {
        atom.deriveHalfLife();
      }
    } );
  }

  /**
   * Clears all the atom lists, including decayAtoms.
   */
  public clearAtomLists(): void {
    this.resetAtoms();
    this.activeAtoms.length = 0;
    this.decayedAtoms.length = 0;
  }

  public resetAtoms(): void {
    this.atomPool.forEach( atom => atom.reset() );
    this.activeAtoms.length = 0;
  }

  /**
   * Returns a random position within the atom placement area bounds in model coordinates.
   */
  private getRandomPositionWithinBounds(): Vector2 {
    const modelBounds = this.atomPlacementAreaProperty.value.bounds;

    return new Vector2(
      dotRandom.nextDoubleInRange( new Range( modelBounds.minX, modelBounds.maxX ) ),
      dotRandom.nextDoubleInRange( new Range( modelBounds.minY, modelBounds.maxY ) )
    );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.clearAtomLists();
    this.selectedIsotopeProperty.reset();
    this.customHalfLifeProperty.reset();
    this.decayedAtoms.push();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
    this.timeProperty.reset();
    this.lastDecayTimeProperty.reset();
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

  /**
   * Reference-type IOType for PhET-iO serialization. The model persists for the lifetime of the sim;
   * its mutable atom arrays are serialized as composites of NuclearDecayAtomIO data-type elements.
   */
  public static readonly NuclearDecayModelIO = new IOType<NuclearDecayModel, IntentionalAny>( 'NuclearDecayModelIO', {
    valueType: NuclearDecayModel,
    documentation: 'The model for nuclear decay, containing pools and lists of atoms.',
    stateSchema: {
      atomPool: ReferenceArrayIO( NuclearDecayAtom.NuclearDecayAtomIO ),
      decayedAtoms: ReferenceArrayIO( NuclearDecayAtom.NuclearDecayAtomIO )
    },
    applyState: ( model, stateObject ) => {

      // Restore atomPool state from the serialized data.
      const atomPoolIO = ReferenceArrayIO( NuclearDecayAtom.NuclearDecayAtomIO );
      atomPoolIO.fromStateObject( stateObject.atomPool ).forEach( ( atom, i ) => {
        model.atomPool[ i ].set( atom );
      } );

      // Rebuild activeAtoms and undecayedAtoms from the restored pool.
      model.activeAtoms = model.atomPool.filter( atom => atom.isActive );
      model.undecayedAtoms = model.activeAtoms.filter( atom => !atom.hasDecayed );

      // Restore decayedAtoms (these are independent copies, not pool references).
      const decayedAtomsIO = ReferenceArrayIO( NuclearDecayAtom.NuclearDecayAtomIO );
      model.decayedAtoms.length = 0;
      model.decayedAtoms.push( ...decayedAtomsIO.fromStateObject( stateObject.decayedAtoms ) );

      model.isPlayAreaEmptyProperty.value = model.activeAtoms.length === 0;
    }
  } );
}
