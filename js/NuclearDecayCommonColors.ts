// Copyright 2026, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import ProfileColorProperty from '../../scenery/js/util/ProfileColorProperty.js';
import nuclearDecayCommon from './nuclearDecayCommon.js';

const NuclearDecayCommonColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( nuclearDecayCommon, 'foreground', {
    default: 'white',
    projector: 'black'
  }, { disableListenerLimit: true } ),

  backgroundProperty: new ProfileColorProperty( nuclearDecayCommon, 'background', {
    default: 'black',
    projector: 'white'
  } )
};

nuclearDecayCommon.register( 'NuclearDecayCommonColors', NuclearDecayCommonColors );
export default NuclearDecayCommonColors;