// Copyright 2026, University of Colorado Boulder

/**
 * Class that controls the visibility of UI elements for the second screens of the Decay suite.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';


export default class MultipleAtomsVisibleProperties {

  public readonly electronCloudVisibleProperty: BooleanProperty;
  public readonly labelsVisibleProperty: BooleanProperty;
  public readonly stopwatchVisibleProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {

    this.electronCloudVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'electronCloudVisibleProperty' ),
      phetioFeatured: true
    } );
    this.labelsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'labelsVisibleProperty' ),
      phetioFeatured: true
    } );
    this.stopwatchVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'stopwatchVisibleProperty' ),
      phetioFeatured: true
    } );

  }

  public reset(): void {
    this.electronCloudVisibleProperty.reset();
    this.stopwatchVisibleProperty.reset();
  }
}