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
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import Isotope from './Isotope.js';

export type NuclearDecayModelOptions = EmptySelfOptions;

export default class NuclearDecayModel implements TModel {

  public readonly isPlayingProperty: BooleanProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly timeProperty: NumberProperty;

  public readonly selectedIsotopeProperty: Property<Isotope>;

  public readonly isPlayAreaEmptyProperty: BooleanProperty;

  public constructor( providedOptions?: NuclearDecayModelOptions ) {

    const leadIsotope = new Isotope( 82, 125 );
    const poloniumIsotope = new Isotope( 84, 127, {
      decaysInto: leadIsotope
    } );

    this.selectedIsotopeProperty = new Property<Isotope>( poloniumIsotope );

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

nuclearDecayCommon.register( 'NuclearDecayModel', NuclearDecayModel );