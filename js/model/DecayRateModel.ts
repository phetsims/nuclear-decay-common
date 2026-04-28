// Copyright 2026, University of Colorado Boulder
/**
 * Model for decay rates screens in alpha and beta decay. Tracks decay percentages over time
 * for plotting on the decay rate graph.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import NuclearDecayModel, { NuclearDecayModelOptions, SelectableIsotopes } from './NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

export type DecayRateModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class DecayRateModel extends NuclearDecayModel {

  // Number of half-lives that have elapsed since the start. Derived from timeProperty / halfLifeProperty.
  public readonly elapsedHalfLivesProperty: TReadOnlyProperty<number>;

  // Time series data for plotting. Each entry is (time, percentage).
  public readonly undecayedDataPoints: Vector2[] = [];
  public readonly decayedDataPoints: Vector2[] = [];

  public constructor(
    selectableIsotopes: SelectableIsotopes[],
    providedOptions?: DecayRateModelOptions
  ) {
    const options = optionize<DecayRateModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
      maxNumberOfAtoms: 1000
    }, providedOptions );

    super( selectableIsotopes, options );

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

    if ( this.activeAtoms.length > 0 ) {
      // Accumulate data points for the graph lines.
      const time = this.timeProperty.value;
      this.undecayedDataPoints.push( new Vector2( time, this.percentageOfUndecayedProperty.value ) );
      this.decayedDataPoints.push( new Vector2( time, this.percentageOfDecayedProperty.value ) );
    }
  }

  public override reset(): void {
    super.reset();
    this.undecayedCountProperty.reset();
    this.decayedCountProperty.reset();
    this.resetDataPoints();
  }

  public override clearAtomLists(): void {
    super.clearAtomLists();
    this.resetDataPoints();
  }

  public resetDataPoints(): void {
    this.undecayedDataPoints.length = 0;
    this.decayedDataPoints.length = 0;
    this.undecayedDataPoints.push( new Vector2( 0, 1 ) );
    this.decayedDataPoints.push( new Vector2( 0, 0 ) );
  }
}
