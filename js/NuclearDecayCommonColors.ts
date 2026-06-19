// Copyright 2026, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Color from '../../scenery/js/util/Color.js';
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

  // "polonium" is the name used in the color editor for the undecayed nucleus color.
  poloniumColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'polonium', {
    default: new Color( 184, 0, 184 )
  } ),

  decayedProperty: new ProfileColorProperty( nuclearDecayCommon, 'decayed', {
    default: 'black'
  } ),

  potentialEnergyProperty: new ProfileColorProperty( nuclearDecayCommon, 'potentialEnergy', {
    default: new Color( 102, 45, 145 )
  } ),

  initialEnergyColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'initialEnergy', {
    default: new Color( 5, 130, 0 )
  } ),

  halfLifeColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'halfLife', {
    default: new Color( 255, 59, 48 )
  } ),

  // Also used for the add atom button.
  setSampleButtonProperty: new ProfileColorProperty( nuclearDecayCommon, 'setSampleButton', {
    default: new Color( 240, 175, 0 )
  } ),

  // Also used for the sort button.
  resetButtonProperty: new ProfileColorProperty( nuclearDecayCommon, 'resetButton', {
    default: new Color( 153, 206, 255 )
  } ),

  dataProbeColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'dataProbe', {
    default: new Color( 128, 128, 128 )
  } ),

  labelHighlightProperty: new ProfileColorProperty( nuclearDecayCommon, 'labelHighlight', {
    default: new Color( 252, 238, 33 )
  } ),

  labelHighlightBorderProperty: new ProfileColorProperty( nuclearDecayCommon, 'labelHighlightBorder', {
    default: new Color( 224, 112, 0 )
  } ),

  isotopeAColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'isotopeA', {
    default: new Color( 0, 85, 233 )
  } ),

  grayPanelColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'grayPanel', {
    default: new Color( 242, 242, 242 )
  } ),

  bluePanelColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'bluePanel', {
    default: new Color( 241, 250, 254 )
  } ),

  electronCloudColorProperty: new ProfileColorProperty( nuclearDecayCommon, 'electronCloud', {
    default: new Color( 0, 0, 255 )
  } )
};

export default NuclearDecayCommonColors;
