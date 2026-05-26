// Copyright 2026, University of Colorado Boulder
/**
 * Model for decay rates screens in alpha and beta decay. Tracks decay percentages over time for plotting on the decay
 * rate graph.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import { DecayType } from '../../../../shred/js/AtomInfoUtils.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { StartingIsotopes } from '../../common/model/NuclearDecayAtom.js';
import NuclearDecayModel, { NuclearDecayModelOptions } from '../../common/model/NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

export type DecayRateModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class DecayRateModel extends NuclearDecayModel {

  // Number of half-lives that have elapsed since the start. Derived from timeProperty / halfLifeProperty.
  public readonly elapsedHalfLivesProperty: TReadOnlyProperty<number>;

  // Time series data for plotting. Each entry is (time, percentage).
  public readonly undecayedDataPoints: Vector2[] = [];
  public readonly decayedDataPoints: Vector2[] = [];

  public constructor(
    StartingIsotopes: StartingIsotopes[],
    decayType: DecayType,
    providedOptions?: DecayRateModelOptions
  ) {
    const options = optionize<DecayRateModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
      maxNumberOfAtoms: 1000,
      ejectParticlesOnDecay: false,
      phetioType: DecayRateModel.DecayRateModelIO
    }, providedOptions );

    super( StartingIsotopes, decayType, options );

    this.elapsedHalfLivesProperty = new DerivedProperty(
      [ this.timeProperty, this.halfLifeProperty ],
      ( time, halfLife ) => halfLife > 0 ? time / halfLife : 0,
      {
        phetioValueType: NumberIO
      }
    );
  }

  public override step( dt: number ): void {
    super.step( dt );

    if ( this.activeAtoms.length > 0 && this.timeProperty.value !== 0 ) {
      // Accumulate data points for the graph lines.
      const time = this.timeProperty.value;
      this.undecayedDataPoints.push( new Vector2( time, this.percentageOfUndecayedProperty.value ) );
      this.decayedDataPoints.push( new Vector2( time, this.percentageOfDecayedProperty.value ) );
    }
  }

  public override reset(): void {
    super.reset();
    this.resetAtoms();
  }

  public resetData(): void {
    this.undecayedCountProperty.reset();
    this.decayedCountProperty.reset();
    this.resetDataPoints();
  }

  public override clearAtomLists(): void {
    super.clearAtomLists();
    this.resetDataPoints();
  }

  public override activateMultipleAtoms( n: number ): void {
    super.activateMultipleAtoms( n );

    // Adding the initial datapoints for 100% and 0%
    this.undecayedDataPoints.push( new Vector2( 0, 1 ) );
    this.decayedDataPoints.push( new Vector2( 0, 0 ) );
  }

  public resetDataPoints(): void {
    this.undecayedDataPoints.length = 0;
    this.decayedDataPoints.length = 0;
  }


  /**
   * Reference-type IOType for PhET-iO serialization. The model persists for the lifetime of the sim;
   * its mutable data point arrays are serialized as ArrayIO types of Vectors.
   */
  public static readonly DecayRateModelIO = new IOType<DecayRateModel, IntentionalAny>( 'DecayRateModelIO', {
    valueType: DecayRateModel,
    supertype: NuclearDecayModel.NuclearDecayModelIO,
    documentation: 'The model for decay rate screen, containing data points of decay throughout time.',
    stateSchema: {
      undecayedDataPoints: ArrayIO( Vector2.Vector2IO ),
      decayedDataPoints: ArrayIO( Vector2.Vector2IO )
    },
    applyState: ( model, stateObject ) => {

      DecayRateModel.DecayRateModelIO.supertype?.applyState( model, stateObject );

      model.undecayedDataPoints.length = 0;
      model.undecayedDataPoints.push( ...ArrayIO( Vector2.Vector2IO ).fromStateObject( stateObject.undecayedDataPoints ) );

      model.decayedDataPoints.length = 0;
      model.decayedDataPoints.push( ...ArrayIO( Vector2.Vector2IO ).fromStateObject( stateObject.decayedDataPoints ) );
    }
  } );
}
