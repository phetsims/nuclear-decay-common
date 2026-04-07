// Copyright 2026, University of Colorado Boulder
/**
 * Base model for the nuclear decay sim, which will hold the state of the nucleus and perform the decay calculations.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
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
import ReferenceArrayIO from '../../../tandem/js/types/ReferenceArrayIO.js';
import StringUnionIO from '../../../tandem/js/types/StringUnionIO.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import HistogramData from './HistogramData.js';
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

// Bounds where the atoms can be placed, in model coordinates.  Decay products are allowed to move outside of these
// bounds.
const DEFAULT_ATOM_AREA_BOUNDS = new Bounds2( -100, -100, 100, 100 );

type SelfOptions = {
  maxNumberOfAtoms?: number;
};

export type NuclearDecayModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class NuclearDecayModel extends PhetioObject implements TModel {

  //JPB-REVIEW - Why defined by subclasses?  Seems like a good thing to pass in with options.
  // List of the selectable isotopes in the sim. Defined by subclasses.
  public readonly abstract selectableIsotopes: SelectableIsotopes[];

  //JPB-REVIEW - Again, why defined by subclasses?  That info seems unnecessary and brittle here.
  // What isotope is currently selected in the sim. Defined by subclasses.
  // 'polonium-211' vs 'custom' in Alpha Decay, or 'carbon-14' vs 'hydrogen-3' vs 'custom' in Beta Decay.
  public readonly selectedIsotopeProperty: Property<SelectableIsotopes>;

  //JPB-REVIEW - The half life isn't selected the way the isotope (or nuclide) is.  Can we call it simply
  //             "halfLifeProperty"?  Or isotopeHalfLifeProperty?
  //JPB-REVIEW - Do we have any enforcement of the disallowing of change when not custom?
  //JPB-REVIEW - It seems a little odd to me to have this for all isotopes.  Why not have it be customHalfLifeProperty
  //             and have the non-custom atoms figure out their own half lives.
  //JPB-REVIEW - Also, shouldn't we retain the custom half life when switching back and forth between custom and non-custom?
  // Set by default to the half-life of the selected isotope, but can be changed by the user if 'custom' is selected.
  public readonly selectedHalfLifeProperty: NumberProperty;

  public readonly isPlayingProperty: BooleanProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly timeProperty: NumberProperty;

  // Pool of all existing atoms originally set to inactive
  public readonly atomPool: NuclearDecayAtom[] = [];

  // Atoms currently in the play area
  public activeAtoms: NuclearDecayAtom[];

  // Subset of activeAtoms, just the ones that have not decayed yet.
  public undecayedAtoms: NuclearDecayAtom[];

  // NOT a subset of activeAtoms, but rather a reference of all the atoms that have fallen.
  // Useful especially for graphing atoms that are no longer active in the play area.
  public readonly decayedAtoms: NuclearDecayAtom[];

  // The area in which atoms can be placed.  This is in model coordinates and can (and should) be updated by the view
  // once the view is constructed and therefore knows what space is available in the screen view.
  public readonly atomPlacementAreaProperty: Property<Shape>;

  public readonly isPlayAreaEmptyProperty: BooleanProperty;

  // TODO: Move to a SingleAtomModel or something https://github.com/phetsims/alpha-decay/issues/3
  // Whether at least one atom has decayed.
  public readonly hasDecayOccurredProperty: BooleanProperty;

  public readonly maxNumberOfAtoms: number;

  public readonly histogramData: HistogramData;

  protected constructor( providedOptions?: NuclearDecayModelOptions ) {

    const options = optionize<NuclearDecayModelOptions, SelfOptions, PhetioObjectOptions>()( {
      maxNumberOfAtoms: NuclearDecayCommonConstants.MAX_ATOMS,
      phetioType: NuclearDecayModel.NuclearDecayModelIO,
      phetioState: true
    }, providedOptions );

    super( options );

    this.selectedIsotopeProperty = new Property<SelectableIsotopes>( 'polonium-211', {
      tandem: options.tandem.createTandem( 'selectedIsotopeProperty' ),
      phetioValueType: StringUnionIO( SelectableIsotopesValues ),
      phetioFeatured: true
    } );

    this.selectedHalfLifeProperty = new NumberProperty( 1, {
      tandem: options.tandem.createTandem( 'selectedHalfLifeProperty' )
    } );

    this.atomPlacementAreaProperty = new Property<Shape>( Shape.bounds( DEFAULT_ATOM_AREA_BOUNDS ), {
      tandem: Tandem.OPT_OUT
    } );

    this.hasDecayOccurredProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'hasDecayOccurredProperty' )
    } );

    this.maxNumberOfAtoms = options.maxNumberOfAtoms!;

    const selectedIsotope = this.selectedIsotopeProperty.value;
    const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( selectedIsotope );
    const postDecayAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( NuclearDecayModel.getDecayProduct( selectedIsotope ) );

    // Prepopulate all the atoms
    _.times( this.maxNumberOfAtoms, () => {
      const atom = new NuclearDecayAtom( atomConfig, postDecayAtomConfig );
      this.atomPool.push( atom );
    } );
    this.selectedHalfLifeProperty.value = this.getHalfLife( selectedIsotope );

    this.selectedIsotopeProperty.lazyLink( selectedIsotope => {
      this.setNewIsotope( selectedIsotope );
    } );

    this.activeAtoms = [];
    this.undecayedAtoms = [];
    this.decayedAtoms = [];

    this.histogramData = new HistogramData( this );

    this.isPlayAreaEmptyProperty = new BooleanProperty( true );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' ),
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

    this.selectedHalfLifeProperty.lazyLink( halfLife => {
      console.log( `halfLife = ${halfLife}` );
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
      this.hasDecayOccurredProperty.value = this.activeAtoms.some( atom => atom.hasDecayed );
      const timeSpeedScale = this.timeSpeedProperty.value === TimeSpeed.NORMAL ?
                             NuclearDecayCommonConstants.NORMAL_SPEED_SCALE :
                             NuclearDecayCommonConstants.SLOW_SPEED_SCALE;
      this.stepModel( dt * timeSpeedScale );
      this.activeAtoms.forEach( ( atom: NuclearDecayAtom ) => {
        const hadDecayed = atom.hasDecayed;
        atom.step( dt * timeSpeedScale );

        if ( !hadDecayed && atom.hasDecayed ) {
          atom.decayTime = this.timeProperty.value;
          this.undecayedAtoms = this.activeAtoms.filter( atom => !atom.hasDecayed );
          this.decayedAtoms.push( atom.copy() );
        }
      } );
    }

    this.histogramData.step();
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
   * When adding many atoms, reset everything and then add them.
   */
  public activateMultipleAtoms( n: number ): void {
    this.reset();
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
    const selectedIsotope = this.selectedIsotopeProperty.value;
    if ( selectedIsotope !== 'custom' ) {
      const atom = this.atomPool.find( atom => !atom.isActive );
      affirm( atom, 'No available atoms to activate!' );
      atom.isActive = true;
      if ( randomizePosition ) {
        atom.position = this.getRandomPositionWithinBounds();
      }
      this.activeAtoms.push( atom );
    }
    else {
      console.warn( 'Custom atoms not yet supported.' );
    }
  }

  private setNewIsotope( newIsotope: SelectableIsotopes ): void {

    this.clearAtomLists();

    this.selectedHalfLifeProperty.value = this.getHalfLife( newIsotope );

    const newDecayProduct = NuclearDecayModel.getDecayProduct( newIsotope );
    const newAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( newIsotope );
    const newPostDecayAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( newDecayProduct );

    this.atomPool.forEach( atom => {
      atom.reset();
      atom.atomConfigBeforeDecay = newAtomConfig;
      atom.atomConfigAfterDecay = newPostDecayAtomConfig;
      atom.halfLife = this.getHalfLife( newIsotope );
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
    this.decayedAtoms.push();
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
      model.hasDecayOccurredProperty.value = model.activeAtoms.some( atom => atom.hasDecayed );
    }
  } );
}
