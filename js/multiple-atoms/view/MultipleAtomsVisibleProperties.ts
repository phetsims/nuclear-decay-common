// Copyright 2026, University of Colorado Boulder
/**
 * Class that controls the visibility of UI elements.
 * In this case only the electron cloud and stopwatch, but it can be extended to control more elements if needed.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';


export default class MultipleAtomsVisibleProperties {

  public readonly electronCloudVisibleProperty: BooleanProperty;
  public readonly stopwatchVisibleProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {

    this.electronCloudVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'electronCloudVisibleProperty' ),
      phetioFeatured: true
    } );
    this.stopwatchVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'stopwatchVisibleProperty' ),
      phetioFeatured: true
    } );

  }
}