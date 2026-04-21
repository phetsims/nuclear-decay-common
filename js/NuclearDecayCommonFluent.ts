// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from nuclear-decay-common-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
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
addToMapIfDefined( 'nuclearEquation', 'nuclearEquationStringProperty' );
addToMapIfDefined( 'halfLife', 'halfLifeStringProperty' );
addToMapIfDefined( 'isotope', 'isotopeStringProperty' );
addToMapIfDefined( 'time', 'timeStringProperty' );
addToMapIfDefined( 'addAtom', 'addAtomStringProperty' );
addToMapIfDefined( 'alphaParticleEnergy', 'alphaParticleEnergyStringProperty' );
addToMapIfDefined( 'initialEnergy', 'initialEnergyStringProperty' );
addToMapIfDefined( 'potentialEnergy', 'potentialEnergyStringProperty' );
addToMapIfDefined( 'distance', 'distanceStringProperty' );
addToMapIfDefined( 'energy', 'energyStringProperty' );
addToMapIfDefined( 'custom', 'customStringProperty' );
addToMapIfDefined( 'decayTime', 'decayTimeStringProperty' );
addToMapIfDefined( 'proton', 'protonStringProperty' );
addToMapIfDefined( 'neutron', 'neutronStringProperty' );
addToMapIfDefined( 'alphaParticle', 'alphaParticleStringProperty' );
addToMapIfDefined( 'isotopeA', 'isotopeAStringProperty' );
addToMapIfDefined( 'isotopeB', 'isotopeBStringProperty' );
addToMapIfDefined( 'electronCloud', 'electronCloudStringProperty' );
addToMapIfDefined( 'stopwatch', 'stopwatchStringProperty' );
addToMapIfDefined( 'dataProbe', 'dataProbeStringProperty' );
addToMapIfDefined( 'percentRemaining', 'percentRemainingStringProperty' );
addToMapIfDefined( 'timeScale', 'timeScaleStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleName', 'a11y.energyDiagram.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleHelpTextCollapsed', 'a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_staticDescription', 'a11y.energyDiagram.staticDescriptionStringProperty' );
addToMapIfDefined( 'a11y_potentialEnergyBarrierHeight', 'a11y.potentialEnergyBarrierHeightStringProperty' );
addToMapIfDefined( 'a11y_potentialEnergySlider_accessibleHelpText', 'a11y.potentialEnergySlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_initialEnergySlider_accessibleHelpText', 'a11y.initialEnergySlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_halfLifeSlider_accessibleHelpText', 'a11y.halfLifeSlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeScaleCheckbox_accessibleHelpText', 'a11y.timeScaleCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleName', 'a11y.eraserButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_isotopePanel_accessibleHelpText', 'a11y.isotopePanel.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_particleCounts_accessibleName', 'a11y.particleCounts.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_particleCounts_accessibleHelpTextCollapsed', 'a11y.particleCounts.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_particleCounts_noData', 'a11y.particleCounts.noDataStringProperty' );
addToMapIfDefined( 'a11y_nuclearEquation_accessibleHelpTextCollapsed', 'a11y.nuclearEquation.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_nuclearEquation_noEquation', 'a11y.nuclearEquation.noEquationStringProperty' );
addToMapIfDefined( 'a11y_timeControls_accessibleHeading', 'a11y.timeControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_replayDecay_accessibleName', 'a11y.replayDecay.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_replayDecay_accessibleHelpText', 'a11y.replayDecay.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_speedControls_accessibleHelpText', 'a11y.speedControls.accessibleHelpTextStringProperty' );

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
  nuclearEquationStringProperty: _.get( NuclearDecayCommonStrings, 'nuclearEquationStringProperty' ),
  halfLifeStringProperty: _.get( NuclearDecayCommonStrings, 'halfLifeStringProperty' ),
  isotopeStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeStringProperty' ),
  timeStringProperty: _.get( NuclearDecayCommonStrings, 'timeStringProperty' ),
  addAtomStringProperty: _.get( NuclearDecayCommonStrings, 'addAtomStringProperty' ),
  alphaParticleEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'alphaParticleEnergyStringProperty' ),
  initialEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'initialEnergyStringProperty' ),
  potentialEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'potentialEnergyStringProperty' ),
  distanceStringProperty: _.get( NuclearDecayCommonStrings, 'distanceStringProperty' ),
  energyStringProperty: _.get( NuclearDecayCommonStrings, 'energyStringProperty' ),
  customStringProperty: _.get( NuclearDecayCommonStrings, 'customStringProperty' ),
  decayTimeStringProperty: _.get( NuclearDecayCommonStrings, 'decayTimeStringProperty' ),
  protonStringProperty: _.get( NuclearDecayCommonStrings, 'protonStringProperty' ),
  neutronStringProperty: _.get( NuclearDecayCommonStrings, 'neutronStringProperty' ),
  timeSecondsStringProperty: _.get( NuclearDecayCommonStrings, 'timeSecondsStringProperty' ),
  alphaParticleStringProperty: _.get( NuclearDecayCommonStrings, 'alphaParticleStringProperty' ),
  isotopeAStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeAStringProperty' ),
  isotopeBStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeBStringProperty' ),
  protonsPatternStringProperty: _.get( NuclearDecayCommonStrings, 'protonsPatternStringProperty' ),
  neutronsPatternStringProperty: _.get( NuclearDecayCommonStrings, 'neutronsPatternStringProperty' ),
  isotopeNameNumberPatternStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeNameNumberPatternStringProperty' ),
  isotopeNumberSymbolPatternStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeNumberSymbolPatternStringProperty' ),
  isotopeInfoTitleStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeInfoTitleStringProperty' ),
  electronCloudStringProperty: _.get( NuclearDecayCommonStrings, 'electronCloudStringProperty' ),
  stopwatchStringProperty: _.get( NuclearDecayCommonStrings, 'stopwatchStringProperty' ),
  dataProbeStringProperty: _.get( NuclearDecayCommonStrings, 'dataProbeStringProperty' ),
  percentRemainingStringProperty: _.get( NuclearDecayCommonStrings, 'percentRemainingStringProperty' ),
  timeScaleStringProperty: _.get( NuclearDecayCommonStrings, 'timeScaleStringProperty' ),
  a11y: {
    energyDiagram: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.accessibleNameStringProperty' ) ),
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleHelpTextCollapsed', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty' ) ),
      staticDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_staticDescription', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.staticDescriptionStringProperty' ) ),
      beforeDecayStringProperty: _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.beforeDecayStringProperty' ),
      afterDecayStringProperty: _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.afterDecayStringProperty' )
    },
    potentialEnergyBarrierHeightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialEnergyBarrierHeight', _.get( NuclearDecayCommonStrings, 'a11y.potentialEnergyBarrierHeightStringProperty' ) ),
    potentialEnergySlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialEnergySlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.potentialEnergySlider.accessibleHelpTextStringProperty' ) )
    },
    initialEnergySlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_initialEnergySlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.initialEnergySlider.accessibleHelpTextStringProperty' ) )
    },
    decayTimeHistogram: {
      accessibleParagraphStringProperty: _.get( NuclearDecayCommonStrings, 'a11y.decayTimeHistogram.accessibleParagraphStringProperty' )
    },
    halfLifeSlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_halfLifeSlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.halfLifeSlider.accessibleHelpTextStringProperty' ) )
    },
    timeScaleCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeScaleCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.timeScaleCheckbox.accessibleHelpTextStringProperty' ) )
    },
    eraserButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.eraserButton.accessibleNameStringProperty' ) )
    },
    isotopePanel: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_isotopePanel_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.isotopePanel.accessibleHelpTextStringProperty' ) )
    },
    particleCounts: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particleCounts_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.accessibleNameStringProperty' ) ),
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particleCounts_accessibleHelpTextCollapsed', _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.accessibleHelpTextCollapsedStringProperty' ) ),
      accessibleParagraphStringProperty: _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.accessibleParagraphStringProperty' ),
      noDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particleCounts_noData', _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.noDataStringProperty' ) )
    },
    nuclearEquation: {
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_nuclearEquation_accessibleHelpTextCollapsed', _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.accessibleHelpTextCollapsedStringProperty' ) ),
      noEquationStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_nuclearEquation_noEquation', _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.noEquationStringProperty' ) ),
      beforeDecayStringProperty: _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.beforeDecayStringProperty' ),
      afterDecayStringProperty: _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.afterDecayStringProperty' )
    },
    timeControls: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_accessibleHeading', _.get( NuclearDecayCommonStrings, 'a11y.timeControls.accessibleHeadingStringProperty' ) )
    },
    replayDecay: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_replayDecay_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.replayDecay.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_replayDecay_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.replayDecay.accessibleHelpTextStringProperty' ) )
    },
    speedControls: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_speedControls_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.speedControls.accessibleHelpTextStringProperty' ) )
    }
  }
};

export default NuclearDecayCommonFluent;

nuclearDecayCommon.register('NuclearDecayCommonFluent', NuclearDecayCommonFluent);
