// Copyright 2026, University of Colorado Boulder

/**
 * Base model for the nuclear decay sim, which will hold the state of the nucleus and perform the decay calculations.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import { DecayType } from '../../../../shred/js/AtomInfoUtils.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import HistogramData from './HistogramData.js';
import NuclearDecayAtom, { StartingIsotopes, StartingIsotopesValues } from './NuclearDecayAtom.js';

// Bounds where the atoms can be placed, in model coordinates.  Decay products are allowed to move outside of these
// bounds.
const DEFAULT_ATOM_AREA_BOUNDS = new Bounds2( -100, -100, 100, 100 );

// a type the defines whether time grows in a linear fashion or exponentially
export const TimescaleValues = [ 'linear', 'exponential' ] as const;
export type Timescale = ( typeof TimescaleValues )[ number ];

type SelfOptions = {
  maxNumberOfAtoms?: number;
  useStopwatch?: boolean;
  ejectParticlesOnDecay?: boolean;
};

export type NuclearDecayModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class NuclearDecayModel extends PhetioObject implements TModel {

  // Flag to distinguish features that are only needed in the single atom model
  public readonly isSingleAtomMode: boolean;

  // List of the selectable isotopes in the sim. Provided by subclasses
  public readonly selectableIsotopes: StartingIsotopes[];

  // What isotope is currently selected in the sim.
  // 'polonium-211' vs 'custom' in Alpha Decay, or 'carbon-14' vs 'hydrogen-3' vs 'custom' in Beta Decay.
  public readonly selectedIsotopeProperty: Property<StartingIsotopes>;

  // The maximum number of atoms that can be in a screen
  public readonly maxNumberOfAtoms: number;

  // Pool of all existing atoms, originally set to inactive
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

  // The user-editable half-life for custom isotopes, in normalized value [0,1] to be mapped according to other factors.
  public readonly customHalfLifeProperty: NumberProperty;

  // The effective half-life for the currently selected isotope. For non-custom isotopes this is derived from the
  // shred's database; for custom isotopes it reflects the user-controlled customHalfLifeProperty.
  public readonly halfLifeProperty: TReadOnlyProperty<number>;

  // Whether the nucleus is stable. Derived for when the half-life is above a certain threshold.
  public readonly isNucleusStableProperty: TReadOnlyProperty<boolean>;

  // Whether ths model is running or paused.
  public readonly isPlayingProperty: BooleanProperty;

  // Whether the model is running at normal or slow speed.
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  // Whether time progresses in a linear or exponential fashion.
  public readonly timescaleProperty: Property<Timescale>;

  // The time experienced by the model when playing.
  public readonly timeProperty: NumberProperty;

  // Whether the elapsed time has passed the threshold to be considered infinite
  public readonly isTimeInfiniteProperty: TReadOnlyProperty<boolean>;

  // The linear time experienced by the model since the last reset or clearing of decays.
  // Different to timeProperty since in exponential time some phenomena still behave linearly
  // i.e. nucleus jiggling, which would be too overwhelming if it was speeding up exponentially
  private accumulatedLinearTime = 0;

  // The time at which the last atom decayed, or null if it hasn't decayed yet.
  public readonly lastDecayTimeProperty: Property<number | null>;

  // The area in which atoms can be placed. This is in model coordinates and can (and should) be updated by the view
  // once the view is constructed and therefore knows what space is available in the screen view.
  public readonly atomPlacementAreaProperty: Property<Shape>;

  // A boolean Property that indicates whether there are any atoms in the play area.
  public readonly isPlayAreaEmptyProperty: BooleanProperty;

  // Data that can be presented in a histogram in the view that represents the decay state of the atoms.
  public readonly histogramData: HistogramData;

  // Whether to continue adding time to the clock, specially after decay has occurred.
  public readonly continueAddingTimeProperty: BooleanProperty;

  // Second screen will include a stopwatch, we might create it here for stepping but not on other screens.
  public readonly stopwatch: Stopwatch | null;

  protected constructor(
    StartingIsotopes: StartingIsotopes[],
    decayType: DecayType,
    providedOptions?: NuclearDecayModelOptions
  ) {

    const options = optionize<NuclearDecayModelOptions, SelfOptions, PhetioObjectOptions>()( {
      maxNumberOfAtoms: NuclearDecayCommonConstants.MAX_ATOMS,
      phetioType: NuclearDecayModel.NuclearDecayModelIO,
      phetioState: true,
      useStopwatch: false,
      ejectParticlesOnDecay: true
    }, providedOptions );

    super( options );

    this.isSingleAtomMode = options.maxNumberOfAtoms === 1;

    this.maxNumberOfAtoms = options.maxNumberOfAtoms!;

    this.selectableIsotopes = StartingIsotopes;

    this.selectedIsotopeProperty = new Property<StartingIsotopes>( 'custom', {
      tandem: options.tandem.createTandem( 'selectedIsotopeProperty' ),
      phetioValueType: StringUnionIO( StartingIsotopesValues ),
      validValues: StartingIsotopesValues,
      phetioFeatured: true
    } );

    this.customHalfLifeProperty = new NumberProperty( 0.5, {
      tandem: options.tandem.createTandem( 'customHalfLifeProperty' ),
      range: new Range( 0, 1 ),
      phetioFeatured: true
    } );

    this.timescaleProperty = new Property<Timescale>( 'linear', {
      tandem: options.tandem.createTandem( 'timescaleProperty' ),
      phetioFeatured: true,
      phetioValueType: StringUnionIO( TimescaleValues ),
      phetioReadOnly: true
    } );

    // The effective half-life for the selected isotope. For real isotopes (e.g. polonium-211), this looks up the
    // known half-life from the nuclide database via AtomInfoUtils. For the 'custom' isotope, it reflects the
    // user-controlled customHalfLifeProperty, allowing the half-life to be set via a slider. Because this is a
    // DerivedProperty, it automatically updates when the user switches isotopes or adjusts the custom half-life.
    this.halfLifeProperty = new DerivedProperty(
      [ this.selectedIsotopeProperty, this.customHalfLifeProperty ],
      ( selectedIsotope, customHalfLife ) => {
        if ( selectedIsotope === 'custom' ) {
          return this.expandNormalizedTime( customHalfLife, this.timescaleProperty.value === 'exponential' );
        }
        const halfLife = NuclearDecayAtom.getHalfLife( selectedIsotope );
        affirm( halfLife !== null, 'Should provide a valid isotope with a known half-life' );
        return halfLife;
      }, {
        tandem: options.tandem.createTandem( 'halfLifeProperty' ),
        phetioValueType: NumberIO
      }
    );

    // If the half-life is bigger than a certain threshold, we assume the atom is stable
    this.isNucleusStableProperty = this.halfLifeProperty.derived( halfLife => {
      return Math.log10( halfLife ) > NuclearDecayCommonConstants.MAX_HALF_LIFE_EXPONENT;
    } );

    this.atomPlacementAreaProperty = new Property<Shape>( Shape.bounds( DEFAULT_ATOM_AREA_BOUNDS ), {
      tandem: Tandem.OPT_OUT
    } );

    // Prepopulate all the atoms
    _.times( this.maxNumberOfAtoms, () => {
      const atom = new NuclearDecayAtom( this.selectedIsotopeProperty.value, decayType, {

        // In the single-atom case, the angle at which decay products are ejected is restricted to a horizontal band so
        // that the particles don't go behind panels.  This is due to the layout for the single-atom screens, and does
        // not correspond to anything physical that is being modeled.
        restrictEjectionAngles: this.isSingleAtomMode,
        ejectParticlesOnDecay: options.ejectParticlesOnDecay
      } );
      this.atomPool.push( atom );
    } );

    this.selectedIsotopeProperty.lazyLink( selectedIsotope => {
      this.setNewIsotope( selectedIsotope );
      this.timescaleProperty.value = selectedIsotope === 'custom' && this.isSingleAtomMode ?
                                     'exponential' :
                                     'linear';
    } );

    // When the custom half-life changes, push the new value to all atoms in the pool.
    this.customHalfLifeProperty.lazyLink( () => {
      this.resetTimes();
      this.clearAtomLists( false, true );
      this.resetAtomsDecay();

      if ( this.selectedIsotopeProperty.value === 'custom' ) {
        this.atomPool.forEach( atom => {
          atom.halfLife = this.getCustomHalfLife();
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

    this.decayedCountProperty.link( () => this.histogramData.update() );

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

    this.continueAddingTimeProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'continueAddingTimeProperty' ),
      phetioFeatured: true
    } );

    this.isTimeInfiniteProperty = this.timeProperty.derived( time => {
      return time > NuclearDecayCommonConstants.MAX_TIME;
    } );

    this.isTimeInfiniteProperty.link( isInfinite => {
      this.continueAddingTimeProperty.value = isInfinite;
    } );

    this.stopwatch = options.useStopwatch ? new Stopwatch( {
      isVisible: false,
      tandem: options.tandem.createTandem( 'stopwatch' )
    } ) : null;
  }

  public expandNormalizedTime( normalizedTime: number, exponential: boolean ): number {
    return exponential ?
           NuclearDecayCommonConstants.EXPONENTIAL_TIME(
             NuclearDecayCommonConstants.EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE.expandNormalizedValue( normalizedTime ) ) :
           NuclearDecayCommonConstants.LINEAR_HALF_LIFE.expandNormalizedValue( normalizedTime );
  }

  /**
   * Steps the model from the PhET framework. Adjusts the time step based on the settings, and handles whether the
   * screen is paused or not.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      const timeSpeedScale = this.timeSpeedProperty.value === TimeSpeed.NORMAL ?
                             NuclearDecayCommonConstants.NORMAL_SPEED_SCALE :
                             NuclearDecayCommonConstants.SLOW_SPEED_SCALE;
      const scaledLinearTimeStep = dt * timeSpeedScale;
      this.stepModel( scaledLinearTimeStep );
    }
    this.histogramData.step();
  }

  /**
   * Step the model forward in time.
   * @param dt
   */
  private stepModel( dt: number ): void {

    this.isPlayAreaEmptyProperty.value = this.activeAtoms.length === 0;

    if ( !this.isPlayAreaEmptyProperty.value ) {

      this.accumulatedLinearTime += dt;

      // Calculate the time step to feed to the model based on the time mode, either linear or exponential.
      let timeStep;
      if ( this.continueAddingTimeProperty.value ) {
        if ( this.timescaleProperty.value === 'linear' ) {
          timeStep = dt;
          this.timeProperty.value += timeStep;
        }
        else {
          affirm( this.timescaleProperty.value === 'exponential', 'unexpected time mode' );

          // The model is in exponential time mode, so calculate the size of the time step based on an exponential
          // function.  This exponential function maps a linear time of 0 to 1 ms and adds a scale factor to get the rate
          // of change that we want based on the design.  It also limits the max value, since this rate of exponential
          // growth can lead to unsupported values after only a few minutes.
          const exponentialTime = NuclearDecayCommonConstants.EXPONENTIAL_TIME( 6 * this.accumulatedLinearTime - 3 );
          timeStep = exponentialTime - this.timeProperty.value;
          this.timeProperty.value = exponentialTime;
        }

        this.stopwatch?.step( timeStep );

        this.updateAtoms( dt, timeStep );
      }
      else {
        this.updateAtoms();
      }
    }
  }

  /**
   * Updates the atom lists. They are not stepped by default unless provided with dt.
   * @param dt - delta time, in seconds
   * @param [decayDt] - an optional separate time used in the decay calculation
   */
  public updateAtoms( dt = 0, decayDt = 0 ): void {
    this.activeAtoms.forEach( ( atom: NuclearDecayAtom ) => {
      const hadDecayed = atom.hasDecayed;
      if ( dt && decayDt ) {
        atom.step( dt, decayDt );
      }

      if ( !hadDecayed && atom.hasDecayed ) {
        this.lastDecayTimeProperty.value = this.timeProperty.value;
        this.decayedAtoms.push( atom.copy() );

        // Update the count inside this loop is important to trigger the sound in the view
        this.decayedCountProperty.value = this.decayedAtoms.length;
      }
    } );

    // Update several variables used to control and present the view.
    this.undecayedAtoms = this.activeAtoms.filter( atom => !atom.hasDecayed );
    this.undecayedCountProperty.value = this.undecayedAtoms.length;

    this.isPlayAreaEmptyProperty.value = this.activeAtoms.length === 0;
  }

  /**
   * Convert the [0,1] custom half-life to the proper number value.
   *   If it is beyond a certain threshold we consider it to be infinity.
   *   However, the infinity is only used within the atoms; the model will still use a number
   *   in order to place it easily in the line.
   */
  public getCustomHalfLife(): number {
    const halfLife = this.expandNormalizedTime( this.customHalfLifeProperty.value, this.timescaleProperty.value === 'exponential' );
    if ( Math.log10( halfLife ) > NuclearDecayCommonConstants.MAX_HALF_LIFE_EXPONENT ) {
      return Infinity;
    }
    else {
      return halfLife;
    }
  }

  /**
   * When adding many atoms, clear the existing atoms and then add new ones.
   */
  public activateMultipleAtoms( n: number ): void {
    this.clearAtomLists();
    this.resetTimes();
    // Activate multiple atoms with random positions
    _.times( n, () => this.activateAtom( true ) );
    this.updateAtoms();
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

    if ( randomizePosition ) {
      atom.position = this.getRandomPositionWithinBounds();
    }
    this.activeAtoms.push( atom );

    if ( this.isSingleAtomMode ) {

      // Step the model to update the screen with the new atom. But not if we're activating multiple atoms
      this.updateAtoms();
    }
  }

  private setNewIsotope( newIsotope: StartingIsotopes ): void {
    this.clearAtomLists();
    this.resetTimes();

    this.atomPool.forEach( atom => {
      atom.reset();
      atom.setIsotope( newIsotope );
      if ( newIsotope === 'custom' ) {
        atom.halfLife = this.getCustomHalfLife();
      }
    } );
    this.updateAtoms();
  }

  /**
   * Clears all the atom lists.
   * With optional parameters to specify whether to clear the undecayed and decayed lists,
   * since in some cases we want to clear one but not the other.
   */
  public clearAtomLists( clearUndecayed = true, clearDecayed = true ): void {

    if ( clearDecayed ) {
      this.decayedAtoms.length = 0;
      this.decayedCountProperty.reset();
    }

    if ( clearUndecayed ) {
      this.resetTimes();
      this.resetAtoms();
      this.undecayedAtoms.length = 0;
      this.undecayedCountProperty.reset();
    }
    else {
      this.undecayedAtoms = this.activeAtoms.filter( atom => !atom.hasDecayed );
    }

    this.histogramData.reset();
  }

  /**
   * Resets all atoms and empties the active atoms list
   */
  public resetAtoms(): void {
    this.atomPool.forEach( atom => atom.reset() );
    this.activeAtoms.length = 0;
  }

  /**
   * Resets all atoms to their original undecayed state
   */
  public resetAtomsDecay(): void {
    this.atomPool.forEach( atom => atom.resetDecay() );
  }

  private resetTimes(): void {
    this.timeProperty.reset();
    this.accumulatedLinearTime = 0;
    this.lastDecayTimeProperty.reset();
    this.stopwatch?.setTime( 0 );
  }

  /**
   * Reset the decay state of all atoms, meaning that for each atom, if it had decayed, it will go back to its
   * pre-decayed configuration.
   */
  public resetAtomDecayStates(): void {
    this.atomPool.forEach( atom => atom.resetDecay() );

    // Because the time may be progressing exponentially, we need to reset the time value here too.
    this.resetTimes();
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
    this.selectedIsotopeProperty.reset();
    this.atomPool.forEach( atom => { atom.reset(); } );
    this.customHalfLifeProperty.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
    this.resetTimes();
    this.clearAtomLists();
    this.histogramData.reset();
    this.stopwatch?.reset();
  }

  /**
   * Steps the model forward by a single manual step (when paused).
   */
  public manualStep(): void {
    this.stepModel( NuclearDecayCommonConstants.MANUAL_STEP_DT );
  }

  /**
   * Sorts active atoms into a grid, with undecayed atoms first and decayed atoms after.
   * The number of columns scales with the total atom count to fill the available play area.
   */
  public sort(): void {
    this.isPlayingProperty.value = false;
    const bounds = this.atomPlacementAreaProperty.value.bounds.erodedX( 100 );
    const n = this.activeAtoms.length;
    if ( n === 0 ) { return; }

    const sorted = [
      ...this.activeAtoms.filter( atom => !atom.hasDecayed ),
      ...this.activeAtoms.filter( atom => atom.hasDecayed )
    ];

    const aspectRatio = bounds.width / bounds.height;

    // Initial estimate of cols and rows, we'll try some up and down to see if there are exact solutions
    let cols = Math.ceil( Math.sqrt( n * aspectRatio ) );
    let rows = Math.ceil( n / cols );

    // If the division is not exact, try values around the estimate
    if ( n % cols !== 0 ) {

      // How many values to try
      const exactSolutionAttempts = 20; // Half of this above and half below
      const minimumDivisor = 5;
      let exactSolutionFound = false;

      _.times( exactSolutionAttempts, i => {

        i += 1; // Start at 1

        if ( exactSolutionFound ) { return; }

        // Try one up, one down, two up, two down, etc.
        const potentialCols = cols + i * Math.pow( -1, i );

        // Below these rows or columns it's no longer worth to search for visual purposes
        if ( potentialCols < minimumDivisor || n / potentialCols < minimumDivisor ) { return; }

        if ( n % potentialCols === 0 ) {
          const potentialRows = n / potentialCols;
          rows = Math.min( potentialRows, potentialCols );
          cols = Math.max( potentialCols, potentialRows );
          console.log( `Solution for  ${n}: ${cols}x${rows}` );
          exactSolutionFound = true;
        }
      } );

      if ( !exactSolutionFound ) { console.log( 'No solution' ); }
    }

    const spacingX = bounds.width / cols;
    const spacingY = bounds.height / rows;

    sorted.forEach( ( atom, index ) => {
      const col = index % cols;
      const row = Math.floor( index / cols );
      atom.position = new Vector2(
        bounds.minX + spacingX * col,
        bounds.maxY - spacingY * row
      );
    } );
  }

  /**
   * Restarts the simulation to its initial state. Override in subclasses to implement specific restart behavior.
   */
  public restart(): void {
    // no-op in base class, but can be overridden in subclasses to implement specific restart behavior
  }

  /**
   * Reference-type IOType for PhET-iO serialization. The model persists for the lifetime of the sim;
   * its mutable atom arrays are serialized as composites of NuclearDecayAtomIO data-type elements.
   */
  public static readonly NuclearDecayModelIO = new IOType<NuclearDecayModel, IntentionalAny>( 'NuclearDecayModelIO', {
    valueType: NuclearDecayModel,
    documentation: 'The model for nuclear decay, containing pools and lists of atoms.',
    stateSchema: {
      atomPool: ArrayIO( NuclearDecayAtom.NuclearDecayAtomIO ),

      // Decayed atoms needs its own referencing because it contains atoms beyond the atomPool.
      // Mostly important for first screen where atom pool is a single atom, but we store the
      // information of all the atoms that have decayed beforehand.
      decayedAtoms: ArrayIO( NuclearDecayAtom.NuclearDecayAtomIO )
    },
    applyState: ( model, stateObject ) => {

      // Restore atomPool state from the serialized data.

      const deserializedAtomPool = ArrayIO( NuclearDecayAtom.NuclearDecayAtomIO ).fromStateObject( stateObject.atomPool );

      affirm( deserializedAtomPool.length === model.atomPool.length, 'Atom pools should be the same length' );

      deserializedAtomPool.forEach( ( atom, i ) => {
        model.atomPool[ i ].set( atom );
      } );

      // Rebuild activeAtoms and undecayedAtoms from the restored pool.
      model.activeAtoms = model.atomPool.filter( atom => atom.isActive );
      model.undecayedAtoms = model.activeAtoms.filter( atom => !atom.hasDecayed );

      // Restore decayedAtoms (these are independent copies, not pool references).
      model.decayedAtoms.length = 0;
      model.decayedAtoms.push( ...ArrayIO( NuclearDecayAtom.NuclearDecayAtomIO ).fromStateObject( stateObject.decayedAtoms ) );

      model.isPlayAreaEmptyProperty.value = model.activeAtoms.length === 0;
    }
  } );
}
