// Copyright 2026, University of Colorado Boulder
/**
 * Class that controls the visibility of UI elements of the third screen of the Decay suite.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';


export default class DecayRateVisibleProperties {

  public readonly showUndecayedProperty: BooleanProperty;
  public readonly showDecayedProperty: BooleanProperty;
  public readonly showHalfLivesProperty: BooleanProperty;
  public readonly showDataProbeProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {

    this.showUndecayedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'showUndecayedProperty' ),
      phetioFeatured: true
    } );
    this.showDecayedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'showDecayedProperty' ),
      phetioFeatured: true
    } );
    this.showHalfLivesProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'showHalfLivesProperty' ),
      phetioFeatured: true
    } );
    this.showDataProbeProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'showDataProbeProperty' ),
      phetioFeatured: true
    } );

  }

  public reset(): void {
    this.showUndecayedProperty.reset();
    this.showDecayedProperty.reset();
    this.showHalfLivesProperty.reset();
    this.showDataProbeProperty.reset();
  }
}