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
import TModel from '../../../joist/js/TModel.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import AtomConfig from '../../../shred/js/model/AtomConfig.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayAtom from './NuclearDecayAtom.js';

export const ValidIsotopeValues = [ 'custom', 'polonium-211', 'lead-207', 'carbon-14', 'nitrogen-14', 'hydrogen-3', 'helium-3', 'helium-2' ] as const;
export type ValidIsotopes = ( typeof ValidIsotopeValues )[ number ];

export const SelectableIsotopesValues = [ 'custom', 'polonium-211', 'hydrogen-3', 'carbon-14' ] as const;
export type SelectableIsotopes = ( typeof SelectableIsotopesValues )[ number ];

const ISOTOPE_TO_ATOM_CONFIG: Record<ValidIsotopes, AtomConfig> = {
  'polonium-211': NuclearDecayCommonConstants.POLONIUM_211,
  'lead-207': NuclearDecayCommonConstants.LEAD_207,
  'carbon-14': NuclearDecayCommonConstants.CARBON_14,
  'nitrogen-14': NuclearDecayCommonConstants.NITROGEN_14,
  'hydrogen-3': NuclearDecayCommonConstants.HYDROGEN_3,
  'helium-3': NuclearDecayCommonConstants.HELIUM_3,
  'helium-2': NuclearDecayCommonConstants.ALPHA_PARTICLE,
  custom: new AtomConfig( 1, 1, 1 )
};

export type NuclearDecayModelOptions = EmptySelfOptions;

export default abstract class NuclearDecayModel implements TModel {

  // List of the selectable isotopes in the sim. Defined by subclasses.
  public readonly abstract selectableIsotopes: SelectableIsotopes[];

  // What isotope is currently selected in the sim. Defined by subclasses.
  // 'polonium-211' vs 'custom' in Alpha Decay, or 'carbon-14' vs 'hydrogen-3' vs 'custom' in Beta Decay.
  public readonly abstract selectedIsotopeProperty: Property<SelectableIsotopes>;

  public readonly isPlayingProperty: BooleanProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly timeProperty: NumberProperty;

  // Atoms currently in the play area
  public readonly activeAtoms: NuclearDecayAtom[];

  public readonly isPlayAreaEmptyProperty: BooleanProperty;

  public constructor( providedOptions: NuclearDecayModelOptions ) {

    // const options = combineOptions<NuclearDecayModelOptions>( {
    // }, providedOptions );

    this.activeAtoms = [];

    this.isPlayAreaEmptyProperty = new BooleanProperty( true );

    this.timeProperty = new NumberProperty( 0, {
      // tandem: ???
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      // tandem: ???
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      // tandem: ???
    } );
  }

  /**
   * Function for the model to return the currently selected isotope's AtomConfig.
   */
  public getSelectedIsotopeAtomConfig(): AtomConfig {
    const selectedIsotope = this.selectedIsotopeProperty.value;
    affirm( selectedIsotope !== 'custom', 'Should not be called when custom is selected' );
    return ISOTOPE_TO_ATOM_CONFIG[ selectedIsotope ];
  }

  /**
   * Get the atom config of an arbitrary isotope
   */
  public static getIsotopeAtomConfig( isotope: ValidIsotopes ): AtomConfig {
    return ISOTOPE_TO_ATOM_CONFIG[ isotope ];
  }

  /**
   * Get a string with the mass and symbol of an isotope (211-Pb) for example, or a custom string if 'custom' is selected.
   */
  public static getIsotopeMassAndSymbolString( isotope: ValidIsotopes, customAnswer = '' ): string {
    if ( isotope === 'custom' ) { return customAnswer; }
    const atomConfig = ISOTOPE_TO_ATOM_CONFIG[ isotope ];
    return AtomNameUtils.getMassAndSymbol( atomConfig.protonCount, atomConfig.neutronCount );
  }

  public static getDecayProduct( isotope: SelectableIsotopes ): ValidIsotopes {
    if ( isotope === 'custom' ) {
      return 'custom';
    }
    else if ( isotope === 'polonium-211' ) {
      return 'lead-207';
    }
    else if ( isotope === 'hydrogen-3' ) {
      return 'helium-3';
    }
    else if ( isotope === 'carbon-14' ) {
      return 'nitrogen-14';
    }
    return 'custom';
  }

  /**
   * Resets the model.
   */
  public reset(): void {
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
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.isPlayingProperty.value && !this.isPlayAreaEmptyProperty.value ) {
      const timeSpeedScale = this.timeSpeedProperty.value === TimeSpeed.NORMAL ?
                             NuclearDecayCommonConstants.NORMAL_SPEED_SCALE :
                             NuclearDecayCommonConstants.SLOW_SPEED_SCALE;
      this.stepModel( dt * timeSpeedScale );
    }
  }

  /**
   * Steps the model by the given dt. Override in subclasses to implement actual model behavior.
   * @param dt - effective time step, in seconds (can be negative for backward steps)
   */
  protected stepModel( dt: number ): void {
    this.timeProperty.value += dt;
  }
}
