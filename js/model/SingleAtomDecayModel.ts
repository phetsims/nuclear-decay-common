// Copyright 2026, University of Colorado Boulder
/**
 * Model for single atom screens in alpha and beta decay
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import NuclearDecayModel, { NuclearDecayModelOptions, SelectableIsotopes } from './NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

export type SingleAtomDecayModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class SingleAtomDecayModel extends NuclearDecayModel {

  // Potential energy
  public readonly potentialEnergyProperty: NumberProperty;

  // Initial energy
  public readonly initialEnergyProperty: NumberProperty;

  // Whether at least one atom has decayed.
  public readonly hasDecayOccurredProperty: BooleanProperty;

  public constructor(
    selectableIsotopes: SelectableIsotopes[],
    providedOptions?: SingleAtomDecayModelOptions
  ) {
    const options = optionize<SingleAtomDecayModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
      maxNumberOfAtoms: 1
    }, providedOptions );

    super( selectableIsotopes, options );

    this.hasDecayOccurredProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'hasDecayOccurredProperty' ),
      phetioReadOnly: true
    } );

    this.potentialEnergyProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'potentialEnergyProperty' )
    } );

    this.initialEnergyProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'initialEnergyProperty' )
    } );
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.hasDecayOccurredProperty.value = this.activeAtoms.some( atom => atom.hasDecayed );
  }

  public override reset(): void {
    super.reset();
  }
}
