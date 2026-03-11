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
  } ),

  // TODO are these the proper names? Surely not https://github.com/phetsims/alpha-decay/issues/3
  //  Don't call me Shirley!
  pinkProperty: new ProfileColorProperty( nuclearDecayCommon, 'pink', {
    default: '#ff00ff'
  } ),

  blueProperty: new ProfileColorProperty( nuclearDecayCommon, 'blue', {
    default: '#5555ff'
  } ),

  greenProperty: new ProfileColorProperty( nuclearDecayCommon, 'green', {
    default: '#ec4123'
  } ),

  addButtonProperty: new ProfileColorProperty( nuclearDecayCommon, 'addButton', {
    default: '#00aa00'
  } ),

  resetButtonProperty: new ProfileColorProperty( nuclearDecayCommon, 'resetButton', {
    default: '#79aee3'
  } )
};

nuclearDecayCommon.register( 'NuclearDecayCommonColors', NuclearDecayCommonColors );
export default NuclearDecayCommonColors;