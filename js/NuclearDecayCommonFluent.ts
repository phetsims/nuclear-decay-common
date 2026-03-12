// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from nuclear-decay-common-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import nuclearDecayCommon from './nuclearDecayCommon.js';
import NuclearDecayCommonStrings from './NuclearDecayCommonStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( NuclearDecayCommonStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'nuclear_decay_common_title', 'nuclear-decay-common.titleStringProperty' );
addToMapIfDefined( 'resetNucleus', 'resetNucleusStringProperty' );
addToMapIfDefined( 'equation', 'equationStringProperty' );
addToMapIfDefined( 'halfLife', 'halfLifeStringProperty' );
addToMapIfDefined( 'isotope', 'isotopeStringProperty' );
addToMapIfDefined( 'time', 'timeStringProperty' );
addToMapIfDefined( 'addAtom', 'addAtomStringProperty' );
addToMapIfDefined( 'alphaParticleEnergy', 'alphaParticleEnergyStringProperty' );
addToMapIfDefined( 'initialEnergy', 'initialEnergyStringProperty' );
addToMapIfDefined( 'finalEnergy', 'finalEnergyStringProperty' );
addToMapIfDefined( 'distance', 'distanceStringProperty' );
addToMapIfDefined( 'energy', 'energyStringProperty' );
addToMapIfDefined( 'custom', 'customStringProperty' );
addToMapIfDefined( 'decayTime', 'decayTimeStringProperty' );
addToMapIfDefined( 'proton', 'protonStringProperty' );
addToMapIfDefined( 'neutron', 'neutronStringProperty' );
addToMapIfDefined( 'alphaParticle', 'alphaParticleStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const NuclearDecayCommonFluent = {
  "nuclear-decay-common": {
    titleStringProperty: _.get( NuclearDecayCommonStrings, 'nuclear-decay-common.titleStringProperty' )
  },
  resetNucleusStringProperty: _.get( NuclearDecayCommonStrings, 'resetNucleusStringProperty' ),
  equationStringProperty: _.get( NuclearDecayCommonStrings, 'equationStringProperty' ),
  halfLifeStringProperty: _.get( NuclearDecayCommonStrings, 'halfLifeStringProperty' ),
  isotopeStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeStringProperty' ),
  timeStringProperty: _.get( NuclearDecayCommonStrings, 'timeStringProperty' ),
  addAtomStringProperty: _.get( NuclearDecayCommonStrings, 'addAtomStringProperty' ),
  alphaParticleEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'alphaParticleEnergyStringProperty' ),
  initialEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'initialEnergyStringProperty' ),
  finalEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'finalEnergyStringProperty' ),
  distanceStringProperty: _.get( NuclearDecayCommonStrings, 'distanceStringProperty' ),
  energyStringProperty: _.get( NuclearDecayCommonStrings, 'energyStringProperty' ),
  customStringProperty: _.get( NuclearDecayCommonStrings, 'customStringProperty' ),
  decayTimeStringProperty: _.get( NuclearDecayCommonStrings, 'decayTimeStringProperty' ),
  protonStringProperty: _.get( NuclearDecayCommonStrings, 'protonStringProperty' ),
  neutronStringProperty: _.get( NuclearDecayCommonStrings, 'neutronStringProperty' ),
  timeSecondsStringProperty: _.get( NuclearDecayCommonStrings, 'timeSecondsStringProperty' ),
  alphaParticleStringProperty: _.get( NuclearDecayCommonStrings, 'alphaParticleStringProperty' ),
  protonsPatternStringProperty: _.get( NuclearDecayCommonStrings, 'protonsPatternStringProperty' ),
  neutronsPatternStringProperty: _.get( NuclearDecayCommonStrings, 'neutronsPatternStringProperty' ),
  isotopeNameNumberPatternStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeNameNumberPatternStringProperty' ),
  isotopeNumberSymbolPatternStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeNumberSymbolPatternStringProperty' ),
  isotopeInfoTitleStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeInfoTitleStringProperty' )
};

export default NuclearDecayCommonFluent;

nuclearDecayCommon.register('NuclearDecayCommonFluent', NuclearDecayCommonFluent);
