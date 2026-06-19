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

  undecayedProperty: new ProfileColorProperty( nuclearDecayCommon, 'undecayed', {
    default: '#B800B8'
  } ),

  decayedProperty: new ProfileColorProperty( nuclearDecayCommon, 'decayed', {
    default: 'black'
  } ),

  potentialEnergyProperty: new ProfileColorProperty( nuclearDecayCommon, 'potentialEnergy', {
    default: '#5555ff'
  } ),

  initialEnergyColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'initialEnergy', {
    default: '#36ac0d'
  } ),

  halfLifeColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'halfLife', {
    default: '#ec4123'
  } ),

  setSampleButtonProperty: new ProfileColorProperty( nuclearDecayCommon, 'setSampleButton', {
    default: 'orange'
  } ),

  resetButtonProperty: new ProfileColorProperty( nuclearDecayCommon, 'resetButton', {
    default: '#79aee3'
  } ),

  dataProbeColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'dataProbe', {
    default: '#aaaaaa'
  } )
};

export default NuclearDecayCommonColors;
