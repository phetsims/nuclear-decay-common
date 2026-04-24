// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from nuclear-decay-common-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import {TReadOnlyProperty} from '../../axon/js/TReadOnlyProperty.js';
import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import type {FluentVariable} from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
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
addToMapIfDefined( 'timesMap_ms', 'timesMap.msStringProperty' );
addToMapIfDefined( 'timesMap_s', 'timesMap.sStringProperty' );
addToMapIfDefined( 'timesMap_min', 'timesMap.minStringProperty' );
addToMapIfDefined( 'timesMap_hr', 'timesMap.hrStringProperty' );
addToMapIfDefined( 'timesMap_day', 'timesMap.dayStringProperty' );
addToMapIfDefined( 'timesMap_yr', 'timesMap.yrStringProperty' );
addToMapIfDefined( 'a11y_qualitative_positionAbove', 'a11y.qualitative.positionAboveStringProperty' );
addToMapIfDefined( 'a11y_qualitative_positionBelow', 'a11y.qualitative.positionBelowStringProperty' );
addToMapIfDefined( 'a11y_qualitative_positionEqualTo', 'a11y.qualitative.positionEqualToStringProperty' );
addToMapIfDefined( 'a11y_qualitative_distanceSmall', 'a11y.qualitative.distanceSmallStringProperty' );
addToMapIfDefined( 'a11y_qualitative_distanceMedium', 'a11y.qualitative.distanceMediumStringProperty' );
addToMapIfDefined( 'a11y_qualitative_distanceLarge', 'a11y.qualitative.distanceLargeStringProperty' );
addToMapIfDefined( 'a11y_qualitative_distanceInfinite', 'a11y.qualitative.distanceInfiniteStringProperty' );
addToMapIfDefined( 'a11y_qualitative_progressSmaller', 'a11y.qualitative.progressSmallerStringProperty' );
addToMapIfDefined( 'a11y_qualitative_progressLarger', 'a11y.qualitative.progressLargerStringProperty' );
addToMapIfDefined( 'a11y_qualitative_progressShorter', 'a11y.qualitative.progressShorterStringProperty' );
addToMapIfDefined( 'a11y_qualitative_progressLonger', 'a11y.qualitative.progressLongerStringProperty' );
addToMapIfDefined( 'a11y_qualitative_progressLower', 'a11y.qualitative.progressLowerStringProperty' );
addToMapIfDefined( 'a11y_qualitative_progressHigher', 'a11y.qualitative.progressHigherStringProperty' );
addToMapIfDefined( 'a11y_qualitative_valueLow', 'a11y.qualitative.valueLowStringProperty' );
addToMapIfDefined( 'a11y_qualitative_valueMedium', 'a11y.qualitative.valueMediumStringProperty' );
addToMapIfDefined( 'a11y_qualitative_valueHigh', 'a11y.qualitative.valueHighStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleName', 'a11y.energyDiagram.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleHelpTextCollapsed', 'a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_staticDescription', 'a11y.energyDiagram.staticDescriptionStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_beforeDecay_initialEnergy', 'a11y.energyDiagram.beforeDecay.initialEnergyStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_beforeDecay_escapeDistance', 'a11y.energyDiagram.beforeDecay.escapeDistanceStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_afterDecay_finalEnergy', 'a11y.energyDiagram.afterDecay.finalEnergyStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_afterDecay_escapeDistance', 'a11y.energyDiagram.afterDecay.escapeDistanceStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_afterDecay_potentialWell', 'a11y.energyDiagram.afterDecay.potentialWellStringProperty' );
addToMapIfDefined( 'a11y_energyDiagramSliders_accessibleContextResponse', 'a11y.energyDiagramSliders.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_potentialEnergyBarrierHeight', 'a11y.potentialEnergyBarrierHeightStringProperty' );
addToMapIfDefined( 'a11y_potentialEnergySlider_accessibleHelpText', 'a11y.potentialEnergySlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_initialEnergySlider_accessibleHelpText', 'a11y.initialEnergySlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayTimeHistogram_accessibleParagraph', 'a11y.decayTimeHistogram.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_decayTimeHistogram_scale', 'a11y.decayTimeHistogram.scaleStringProperty' );
addToMapIfDefined( 'a11y_halfLifeSlider_accessibleHelpText', 'a11y.halfLifeSlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_halfLifeSlider_accessibleContextResponse', 'a11y.halfLifeSlider.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_timeScaleCheckbox_accessibleHelpText', 'a11y.timeScaleCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeScaleCheckbox_accessibleContextResponseChecked', 'a11y.timeScaleCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_timeScaleCheckbox_accessibleContextResponseUnchecked', 'a11y.timeScaleCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleName', 'a11y.eraserButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleContextResponse', 'a11y.eraserButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_isotopePanel_accessibleHelpText', 'a11y.isotopePanel.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_particleCounts_accessibleName', 'a11y.particleCounts.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_particleCounts_accessibleHelpTextCollapsed', 'a11y.particleCounts.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_particleCounts_accessibleParagraph', 'a11y.particleCounts.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_particleCounts_noData', 'a11y.particleCounts.noDataStringProperty' );
addToMapIfDefined( 'a11y_nuclearEquation_accessibleHelpTextCollapsed', 'a11y.nuclearEquation.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_nuclearEquation_noEquation', 'a11y.nuclearEquation.noEquationStringProperty' );
addToMapIfDefined( 'a11y_nuclearEquation_beforeDecay', 'a11y.nuclearEquation.beforeDecayStringProperty' );
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
  timesMap: {
    msStringProperty: _.get( NuclearDecayCommonStrings, 'timesMap.msStringProperty' ),
    sStringProperty: _.get( NuclearDecayCommonStrings, 'timesMap.sStringProperty' ),
    minStringProperty: _.get( NuclearDecayCommonStrings, 'timesMap.minStringProperty' ),
    hrStringProperty: _.get( NuclearDecayCommonStrings, 'timesMap.hrStringProperty' ),
    dayStringProperty: _.get( NuclearDecayCommonStrings, 'timesMap.dayStringProperty' ),
    yrStringProperty: _.get( NuclearDecayCommonStrings, 'timesMap.yrStringProperty' )
  },
  a11y: {
    qualitative: {
      positionAboveStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_positionAbove', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.positionAboveStringProperty' ) ),
      positionBelowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_positionBelow', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.positionBelowStringProperty' ) ),
      positionEqualToStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_positionEqualTo', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.positionEqualToStringProperty' ) ),
      distanceSmallStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_distanceSmall', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.distanceSmallStringProperty' ) ),
      distanceMediumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_distanceMedium', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.distanceMediumStringProperty' ) ),
      distanceLargeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_distanceLarge', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.distanceLargeStringProperty' ) ),
      distanceInfiniteStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_distanceInfinite', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.distanceInfiniteStringProperty' ) ),
      progressSmallerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_progressSmaller', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.progressSmallerStringProperty' ) ),
      progressLargerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_progressLarger', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.progressLargerStringProperty' ) ),
      progressShorterStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_progressShorter', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.progressShorterStringProperty' ) ),
      progressLongerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_progressLonger', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.progressLongerStringProperty' ) ),
      progressLowerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_progressLower', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.progressLowerStringProperty' ) ),
      progressHigherStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_progressHigher', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.progressHigherStringProperty' ) ),
      valueLowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_valueLow', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.valueLowStringProperty' ) ),
      valueMediumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_valueMedium', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.valueMediumStringProperty' ) ),
      valueHighStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_valueHigh', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.valueHighStringProperty' ) )
    },
    energyDiagram: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.accessibleNameStringProperty' ) ),
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleHelpTextCollapsed', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty' ) ),
      staticDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_staticDescription', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.staticDescriptionStringProperty' ) ),
      beforeDecay: {
        initialEnergy: new FluentPattern<{ position: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_energyDiagram_beforeDecay_initialEnergy', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.beforeDecay.initialEnergyStringProperty' ), [{"name":"position"}] ),
        escapeDistance: new FluentPattern<{ distance: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_energyDiagram_beforeDecay_escapeDistance', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.beforeDecay.escapeDistanceStringProperty' ), [{"name":"distance"}] )
      },
      afterDecay: {
        finalEnergyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_afterDecay_finalEnergy', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.afterDecay.finalEnergyStringProperty' ) ),
        escapeDistance: new FluentPattern<{ distance: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_energyDiagram_afterDecay_escapeDistance', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.afterDecay.escapeDistanceStringProperty' ), [{"name":"distance"}] ),
        potentialWellStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_afterDecay_potentialWell', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.afterDecay.potentialWellStringProperty' ) )
      }
    },
    energyDiagramSliders: {
      accessibleContextResponse: new FluentPattern<{ distanceProgress: FluentVariable, hLifeProgress: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_energyDiagramSliders_accessibleContextResponse', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagramSliders.accessibleContextResponseStringProperty' ), [{"name":"distanceProgress"},{"name":"hLifeProgress"}] )
    },
    potentialEnergyBarrierHeightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialEnergyBarrierHeight', _.get( NuclearDecayCommonStrings, 'a11y.potentialEnergyBarrierHeightStringProperty' ) ),
    potentialEnergySlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialEnergySlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.potentialEnergySlider.accessibleHelpTextStringProperty' ) )
    },
    initialEnergySlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_initialEnergySlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.initialEnergySlider.accessibleHelpTextStringProperty' ) )
    },
    decayTimeHistogram: {
      accessibleParagraph: new FluentPattern<{ hLifeTime: FluentVariable, isotope: FluentVariable, scale: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_decayTimeHistogram_accessibleParagraph', _.get( NuclearDecayCommonStrings, 'a11y.decayTimeHistogram.accessibleParagraphStringProperty' ), [{"name":"hLifeTime"},{"name":"isotope"},{"name":"scale"}] ),
      scale: new FluentPattern<{ scale: 'linear' | 'logarithmic' | TReadOnlyProperty<'linear' | 'logarithmic'> }>( fluentSupport.bundleProperty, 'a11y_decayTimeHistogram_scale', _.get( NuclearDecayCommonStrings, 'a11y.decayTimeHistogram.scaleStringProperty' ), [{"name":"scale","variants":["linear","logarithmic"]}] )
    },
    halfLifeSlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_halfLifeSlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.halfLifeSlider.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponse: new FluentPattern<{ distanceProgress: FluentVariable, initialEProgress: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_halfLifeSlider_accessibleContextResponse', _.get( NuclearDecayCommonStrings, 'a11y.halfLifeSlider.accessibleContextResponseStringProperty' ), [{"name":"distanceProgress"},{"name":"initialEProgress"}] )
    },
    timeScaleCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeScaleCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.timeScaleCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeScaleCheckbox_accessibleContextResponseChecked', _.get( NuclearDecayCommonStrings, 'a11y.timeScaleCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeScaleCheckbox_accessibleContextResponseUnchecked', _.get( NuclearDecayCommonStrings, 'a11y.timeScaleCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    eraserButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.eraserButton.accessibleNameStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleContextResponse', _.get( NuclearDecayCommonStrings, 'a11y.eraserButton.accessibleContextResponseStringProperty' ) )
    },
    isotopePanel: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_isotopePanel_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.isotopePanel.accessibleHelpTextStringProperty' ) )
    },
    particleCounts: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particleCounts_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.accessibleNameStringProperty' ) ),
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particleCounts_accessibleHelpTextCollapsed', _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.accessibleHelpTextCollapsedStringProperty' ) ),
      accessibleParagraph: new FluentPattern<{ isotope: FluentVariable, neutrons: FluentVariable, protons: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_particleCounts_accessibleParagraph', _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.accessibleParagraphStringProperty' ), [{"name":"isotope"},{"name":"neutrons"},{"name":"protons"}] ),
      noDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particleCounts_noData', _.get( NuclearDecayCommonStrings, 'a11y.particleCounts.noDataStringProperty' ) )
    },
    nuclearEquation: {
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_nuclearEquation_accessibleHelpTextCollapsed', _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.accessibleHelpTextCollapsedStringProperty' ) ),
      noEquationStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_nuclearEquation_noEquation', _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.noEquationStringProperty' ) ),
      beforeDecay: new FluentPattern<{ parentIsotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_nuclearEquation_beforeDecay', _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.beforeDecayStringProperty' ), [{"name":"parentIsotope"}] ),
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
