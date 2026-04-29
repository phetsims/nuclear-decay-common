// Copyright 2026, University of Colorado Boulder
/**
 * Model for single atom screens in alpha and beta decay
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Multilink from '../../../axon/js/Multilink.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import NuclearDecayModel, { NuclearDecayModelOptions, SelectableIsotopes } from './NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

export type SingleAtomDecayModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class SingleAtomDecayModel extends NuclearDecayModel {

  // Potential energy
  public readonly potentialEnergyProperty: NumberProperty;

  // Initial energy
  public readonly initialEnergyProperty: NumberProperty;

  public readonly escapeDistanceProperty: NumberProperty;

  // Whether at least one atom has decayed.
  public readonly hasDecayOccurredProperty: BooleanProperty;

  public readonly protonCountProperty: NumberProperty;

  public readonly neutronCountProperty: NumberProperty;

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

    this.potentialEnergyProperty = new NumberProperty( 1, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'potentialEnergyProperty' ),
      phetioFeatured: true
    } );

    this.initialEnergyProperty = new NumberProperty( 0.5, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'initialEnergyProperty' ),
      phetioFeatured: true
    } );

    this.escapeDistanceProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'escapeDistanceProperty' )
    } );

    const particleCountsTandem = options.tandem.createTandem( 'particleCounts' );
    this.protonCountProperty = new NumberProperty( 0, {
      tandem: particleCountsTandem.createTandem( 'protonCountProperty' )
    } );

    this.neutronCountProperty = new NumberProperty( 0, {
      tandem: particleCountsTandem.createTandem( 'neutronCountProperty' )
    } );

    Multilink.multilink(
      [
        this.selectedIsotopeProperty,
        this.hasDecayOccurredProperty
      ], ( isotope, hasDecayOcurred ) => {
        const decayProduct = NuclearDecayModel.getDecayProduct( isotope );
        const isotopeAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
        const decayAtomConfig = NuclearDecayModel.getIsotopeAtomConfig( decayProduct );
        this.protonCountProperty.value = hasDecayOcurred ? decayAtomConfig.protonCount : isotopeAtomConfig.protonCount;
        this.neutronCountProperty.value = hasDecayOcurred ? decayAtomConfig.neutronCount : isotopeAtomConfig.neutronCount;
      }
    );
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.hasDecayOccurredProperty.value = this.activeAtoms.some( atom => atom.hasDecayed );
  }

  public override reset(): void {
    super.reset();
    this.potentialEnergyProperty.reset();
    this.initialEnergyProperty.reset();
  }
}
