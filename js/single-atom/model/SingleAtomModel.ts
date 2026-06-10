// Copyright 2026, University of Colorado Boulder
/**
 * Model for single atom screens in alpha and beta decay
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { DecayType } from '../../../../shred/js/AtomInfoUtils.js';
import NuclearDecayAtom, { StartingIsotopes } from '../../common/model/NuclearDecayAtom.js';
import NuclearDecayModel, { NuclearDecayModelOptions } from '../../common/model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';

type SelfOptions = EmptySelfOptions;

export type SingleAtomDecayModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class SingleAtomModel extends NuclearDecayModel {

  // Potential energy
  public readonly potentialEnergyProperty: NumberProperty;

  // Initial energy
  public readonly initialEnergyProperty: NumberProperty;

  public readonly escapeDistanceProperty: NumberProperty;

  // Whether at least one atom has decayed.
  public readonly hasDecayOccurredProperty: BooleanProperty;

  public readonly protonCountProperty: NumberProperty;

  public readonly neutronCountProperty: NumberProperty;

  // Since we want halfLife to affect energy levels and viceversa, we use this flag to control when the
  // mapping is being made to avoid circular updates.
  public mappingInProgress = false;

  public constructor(
    StartingIsotopes: StartingIsotopes[],
    decayType: DecayType,
    providedOptions?: SingleAtomDecayModelOptions
  ) {
    const options = optionize<SingleAtomDecayModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
      maxNumberOfAtoms: 1
    }, providedOptions );

    super( StartingIsotopes, decayType, options );

    this.hasDecayOccurredProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'hasDecayOccurredProperty' ),
      phetioReadOnly: true
    } );

    this.potentialEnergyProperty = new NumberProperty( 1, {
      range: new Range( 0.1, 1 ),
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
      ], ( isotope, hasDecayOccurred ) => {
        const decayProduct = NuclearDecayAtom.getDecayProduct( isotope );
        const isotopeAtomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
        const decayAtomConfig = NuclearDecayAtom.getIsotopeAtomConfig( decayProduct );
        this.protonCountProperty.value = hasDecayOccurred ? decayAtomConfig.protonCount : isotopeAtomConfig.protonCount;
        this.neutronCountProperty.value = hasDecayOccurred ? decayAtomConfig.neutronCount : isotopeAtomConfig.neutronCount;
      }
    );

    this.hasDecayOccurredProperty.link( hasDecayOccurred => {
      this.continueAddingTimeProperty.value = !hasDecayOccurred;
    } );

    Multilink.multilink(
      [ this.potentialEnergyProperty, this.initialEnergyProperty ],
      ( potentialEnergy, initialEnergy ) => {
        if ( this.mappingInProgress ) { return; }

        this.mappingInProgress = true;
        this.customHalfLifeProperty.value = NuclearDecayCommonConstants.ENERGIES_TO_HALF_LIFE_EXPONENT_MAPPING( initialEnergy, potentialEnergy );
        this.mappingInProgress = false;
      } );

    this.customHalfLifeProperty.lazyLink( halfLife => {
      if ( this.mappingInProgress ) { return; }

      this.mappingInProgress = true;
      this.initialEnergyProperty.value = NuclearDecayCommonConstants.HALF_LIFE_TO_KINETIC_ENERGY_MAPPING( halfLife, this.potentialEnergyProperty.value );
      this.mappingInProgress = false;
    } );
  }

  /**
   * This function rolls back time to before the decay, essentially reverting the model to right when it's
   * going to happen. If there has been no decay it just goes back to 0.
   */
  public override restart(): void {
    const atom = this.atomPool[ 0 ];
    const rollbackTime = 0.05;

    if ( atom.decayTime !== null ) {

      // For linear time go back 0.1 seconds. For exponential time, go back to when it was an exponent before
      const timeToRestart = this.timescaleProperty.value === 'linear' ?
                            Math.max( atom.decayTime - rollbackTime, 0 ) :
                            Math.max( atom.decayTime / 2, 1e-3 );
      this.setTimes( timeToRestart );
      atom.restartDecay();

      this.decayedAtoms.pop();
      this.decayedCountProperty.value = this.decayedAtoms.length;

      this.hasDecayOccurredProperty.value = false;

      this.updateAtoms();
    }
    else {
      this.resetTimes();
    }
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.hasDecayOccurredProperty.value = this.activeAtoms.some( atom => atom.hasDecayed );
  }

  public override reset(): void {
    super.reset();
    this.hasDecayOccurredProperty.reset();
    this.potentialEnergyProperty.reset();
    this.initialEnergyProperty.reset();
  }
}
