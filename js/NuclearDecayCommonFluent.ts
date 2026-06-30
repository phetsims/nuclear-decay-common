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
addToMapIfDefined( 'halfLives', 'halfLivesStringProperty' );
addToMapIfDefined( 'isotope', 'isotopeStringProperty' );
addToMapIfDefined( 'time', 'timeStringProperty' );
addToMapIfDefined( 'addAtom', 'addAtomStringProperty' );
addToMapIfDefined( 'alphaParticleEnergy', 'alphaParticleEnergyStringProperty' );
addToMapIfDefined( 'potentialEnergy', 'potentialEnergyStringProperty' );
addToMapIfDefined( 'preDecayWell', 'preDecayWellStringProperty' );
addToMapIfDefined( 'distance', 'distanceStringProperty' );
addToMapIfDefined( 'energy', 'energyStringProperty' );
addToMapIfDefined( 'energyDiagram', 'energyDiagramStringProperty' );
addToMapIfDefined( 'custom', 'customStringProperty' );
addToMapIfDefined( 'decayTime', 'decayTimeStringProperty' );
addToMapIfDefined( 'proton', 'protonStringProperty' );
addToMapIfDefined( 'neutron', 'neutronStringProperty' );
addToMapIfDefined( 'particleCounts', 'particleCountsStringProperty' );
addToMapIfDefined( 'seconds', 'secondsStringProperty' );
addToMapIfDefined( 'alphaParticle', 'alphaParticleStringProperty' );
addToMapIfDefined( 'isotopeA', 'isotopeAStringProperty' );
addToMapIfDefined( 'isotopeB', 'isotopeBStringProperty' );
addToMapIfDefined( 'customIsotope', 'customIsotopeStringProperty' );
addToMapIfDefined( 'decayedIsotope', 'decayedIsotopeStringProperty' );
addToMapIfDefined( 'labels', 'labelsStringProperty' );
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
addToMapIfDefined( 'a11y_qualitative_equal', 'a11y.qualitative.equalStringProperty' );
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
addToMapIfDefined( 'a11y_scientificNotation', 'a11y.scientificNotationStringProperty' );
addToMapIfDefined( 'a11y_signSelector', 'a11y.signSelectorStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_screenSummary_playArea', 'a11y.alphaDecay.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_screenSummary_energyGraph', 'a11y.alphaDecay.screenSummary.energyGraphStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_screenSummary_playAreaSelector', 'a11y.alphaDecay.screenSummary.playAreaSelectorStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_screenSummary_controlArea', 'a11y.alphaDecay.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_screenSummary_currentDetails', 'a11y.alphaDecay.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_screenSummary_interactionHint_addAtom', 'a11y.alphaDecay.screenSummary.interactionHint.addAtomStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_screenSummary_interactionHint_afterDecay', 'a11y.alphaDecay.screenSummary.interactionHint.afterDecayStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_radioactiveAtomHeading', 'a11y.alphaDecay.radioactiveAtomHeadingStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_addAtomButton_accessibleContextResponse', 'a11y.alphaDecay.addAtomButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_atomInPlayArea_readyToDecay', 'a11y.alphaDecay.atomInPlayArea.readyToDecayStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_atomInPlayArea_nowPresent', 'a11y.alphaDecay.atomInPlayArea.nowPresentStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_atomDecay_alphaParticleEmitted', 'a11y.alphaDecay.atomDecay.alphaParticleEmittedStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_resetAtomButton_accessibleName', 'a11y.alphaDecay.resetAtomButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_resetAtomButton_accessibleContextResponse', 'a11y.alphaDecay.resetAtomButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_decayDataHeading', 'a11y.alphaDecay.decayDataHeadingStringProperty' );
addToMapIfDefined( 'a11y_alphaDecay_multipleAtomsScreen_decayParticle', 'a11y.alphaDecay.multipleAtomsScreen.decayParticleStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleName', 'a11y.energyDiagram.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleHelpTextCollapsed', 'a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_staticDescription', 'a11y.energyDiagram.staticDescriptionStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_beforeDecay_leadingParagraph', 'a11y.energyDiagram.beforeDecay.leadingParagraphStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_beforeDecay_alphaParticleInWell', 'a11y.energyDiagram.beforeDecay.alphaParticleInWellStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_beforeDecay_escapeDistance', 'a11y.energyDiagram.beforeDecay.escapeDistanceStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_beforeDecay_escapeDistanceDescription', 'a11y.energyDiagram.beforeDecay.escapeDistanceDescriptionStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_afterDecay_accessibleParagraph', 'a11y.energyDiagram.afterDecay.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_escapeDistanceContextResponse', 'a11y.escapeDistanceContextResponseStringProperty' );
addToMapIfDefined( 'a11y_potentialEnergySlider_accessibleName', 'a11y.potentialEnergySlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_potentialEnergySlider_accessibleHelpText', 'a11y.potentialEnergySlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_alphaParticleEnergySlider_accessibleName', 'a11y.alphaParticleEnergySlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_alphaParticleEnergySlider_accessibleHelpText', 'a11y.alphaParticleEnergySlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayTimeHistogram_accessibleParagraph', 'a11y.decayTimeHistogram.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_decayTimeHistogram_scale', 'a11y.decayTimeHistogram.scaleStringProperty' );
addToMapIfDefined( 'a11y_halfLifeSlider_accessibleHelpText', 'a11y.halfLifeSlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_halfLifeSlider_accessibleContextResponse', 'a11y.halfLifeSlider.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_dataProbeSlider_accessibleHelpText', 'a11y.dataProbeSlider.accessibleHelpTextStringProperty' );
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
addToMapIfDefined( 'a11y_nuclearEquation_afterDecay', 'a11y.nuclearEquation.afterDecayStringProperty' );
addToMapIfDefined( 'a11y_timeControls_accessibleHeading', 'a11y.timeControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_replayDecay_accessibleName', 'a11y.replayDecay.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_replayDecay_accessibleHelpText', 'a11y.replayDecay.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_speedControls_accessibleHelpText', 'a11y.speedControls.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_screenSummary_playArea', 'a11y.multipleAtoms.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_screenSummary_controlArea', 'a11y.multipleAtoms.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_screenSummary_currentDetails', 'a11y.multipleAtoms.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_screenSummary_interactionHint_addAtoms', 'a11y.multipleAtoms.screenSummary.interactionHint.addAtomsStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_screenSummary_interactionHint_afterDecay', 'a11y.multipleAtoms.screenSummary.interactionHint.afterDecayStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_radioactiveSampleHeading', 'a11y.multipleAtoms.radioactiveSampleHeadingStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_radioactiveSample_noAtoms', 'a11y.multipleAtoms.radioactiveSample.noAtomsStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_radioactiveSample_readyToDecay', 'a11y.multipleAtoms.radioactiveSample.readyToDecayStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_radioactiveSample_decayOccurring', 'a11y.multipleAtoms.radioactiveSample.decayOccurringStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_numberOfAtomsControl_accessibleName', 'a11y.multipleAtoms.numberOfAtomsControl.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_addAtomsButton_accessibleName', 'a11y.multipleAtoms.addAtomsButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_resetSampleButton_accessibleName', 'a11y.multipleAtoms.resetSampleButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_decayDataHeading', 'a11y.multipleAtoms.decayDataHeadingStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_decayTimeHistogramAtHalfLife', 'a11y.multipleAtoms.decayTimeHistogramAtHalfLifeStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_labelsCheckbox_accessibleName', 'a11y.multipleAtoms.labelsCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_labelsCheckbox_accessibleHelpText', 'a11y.multipleAtoms.labelsCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_stopwatchCheckbox_accessibleName', 'a11y.multipleAtoms.stopwatchCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_multipleAtoms_stopwatchCheckbox_accessibleHelpText', 'a11y.multipleAtoms.stopwatchCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayRate_screenSummary_playArea', 'a11y.decayRate.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_decayRate_screenSummary_controlArea', 'a11y.decayRate.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_decayRate_screenSummary_currentDetails', 'a11y.decayRate.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_decayRate_screenSummary_interactionHint_addAtoms', 'a11y.decayRate.screenSummary.interactionHint.addAtomsStringProperty' );
addToMapIfDefined( 'a11y_decayRate_screenSummary_interactionHint_afterDecay', 'a11y.decayRate.screenSummary.interactionHint.afterDecayStringProperty' );
addToMapIfDefined( 'a11y_decayRate_radioactiveSample_decayOccurring', 'a11y.decayRate.radioactiveSample.decayOccurringStringProperty' );
addToMapIfDefined( 'a11y_decayRate_decayGraphHeading', 'a11y.decayRate.decayGraphHeadingStringProperty' );
addToMapIfDefined( 'a11y_decayRate_decayGraphPanel_accessibleParagraph', 'a11y.decayRate.decayGraphPanel.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_decayRate_undecayedCheckbox_accessibleName', 'a11y.decayRate.undecayedCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_decayRate_undecayedCheckbox_accessibleHelpText', 'a11y.decayRate.undecayedCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayRate_decayedCheckbox_accessibleName', 'a11y.decayRate.decayedCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_decayRate_decayedCheckbox_accessibleHelpText', 'a11y.decayRate.decayedCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayRate_halfLivesCheckbox_accessibleName', 'a11y.decayRate.halfLivesCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_decayRate_halfLivesCheckbox_accessibleHelpText', 'a11y.decayRate.halfLivesCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayRate_dataProbeCheckbox_accessibleName', 'a11y.decayRate.dataProbeCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_decayRate_dataProbeCheckbox_accessibleHelpText', 'a11y.decayRate.dataProbeCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayRate_sortButton_accessibleName', 'a11y.decayRate.sortButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_decayRate_sortButton_accessibleHelpText', 'a11y.decayRate.sortButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_decayRate_resetSampleButton_accessibleName', 'a11y.decayRate.resetSampleButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_particlesLegendPanel_accessibleList_leadingParagraph', 'a11y.particlesLegendPanel.accessibleList.leadingParagraphStringProperty' );
addToMapIfDefined( 'a11y_particlesLegendPanel_accessibleList_proton', 'a11y.particlesLegendPanel.accessibleList.protonStringProperty' );
addToMapIfDefined( 'a11y_particlesLegendPanel_accessibleList_neutron', 'a11y.particlesLegendPanel.accessibleList.neutronStringProperty' );
addToMapIfDefined( 'a11y_particlesLegendPanel_accessibleList_alphaParticle', 'a11y.particlesLegendPanel.accessibleList.alphaParticleStringProperty' );

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
  halfLivesStringProperty: _.get( NuclearDecayCommonStrings, 'halfLivesStringProperty' ),
  isotopeStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeStringProperty' ),
  timeStringProperty: _.get( NuclearDecayCommonStrings, 'timeStringProperty' ),
  addAtomStringProperty: _.get( NuclearDecayCommonStrings, 'addAtomStringProperty' ),
  alphaParticleEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'alphaParticleEnergyStringProperty' ),
  potentialEnergyStringProperty: _.get( NuclearDecayCommonStrings, 'potentialEnergyStringProperty' ),
  preDecayWellStringProperty: _.get( NuclearDecayCommonStrings, 'preDecayWellStringProperty' ),
  distanceStringProperty: _.get( NuclearDecayCommonStrings, 'distanceStringProperty' ),
  energyStringProperty: _.get( NuclearDecayCommonStrings, 'energyStringProperty' ),
  energyDiagramStringProperty: _.get( NuclearDecayCommonStrings, 'energyDiagramStringProperty' ),
  customStringProperty: _.get( NuclearDecayCommonStrings, 'customStringProperty' ),
  decayTimeStringProperty: _.get( NuclearDecayCommonStrings, 'decayTimeStringProperty' ),
  protonStringProperty: _.get( NuclearDecayCommonStrings, 'protonStringProperty' ),
  neutronStringProperty: _.get( NuclearDecayCommonStrings, 'neutronStringProperty' ),
  particleCountsStringProperty: _.get( NuclearDecayCommonStrings, 'particleCountsStringProperty' ),
  timeSecondsStringProperty: _.get( NuclearDecayCommonStrings, 'timeSecondsStringProperty' ),
  secondsStringProperty: _.get( NuclearDecayCommonStrings, 'secondsStringProperty' ),
  dataProbeTimePatternStringProperty: _.get( NuclearDecayCommonStrings, 'dataProbeTimePatternStringProperty' ),
  alphaParticleStringProperty: _.get( NuclearDecayCommonStrings, 'alphaParticleStringProperty' ),
  isotopeAStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeAStringProperty' ),
  isotopeBStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeBStringProperty' ),
  customIsotopeStringProperty: _.get( NuclearDecayCommonStrings, 'customIsotopeStringProperty' ),
  decayedIsotopeStringProperty: _.get( NuclearDecayCommonStrings, 'decayedIsotopeStringProperty' ),
  protonsPatternStringProperty: _.get( NuclearDecayCommonStrings, 'protonsPatternStringProperty' ),
  neutronsPatternStringProperty: _.get( NuclearDecayCommonStrings, 'neutronsPatternStringProperty' ),
  isotopeNameNumberPatternStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeNameNumberPatternStringProperty' ),
  isotopeNumberSymbolPatternStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeNumberSymbolPatternStringProperty' ),
  isotopeInfoTitleStringProperty: _.get( NuclearDecayCommonStrings, 'isotopeInfoTitleStringProperty' ),
  labelsStringProperty: _.get( NuclearDecayCommonStrings, 'labelsStringProperty' ),
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
      equalStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitative_equal', _.get( NuclearDecayCommonStrings, 'a11y.qualitative.equalStringProperty' ) ),
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
    scientificNotation: new FluentPattern<{ exponent: FluentVariable, mantissa: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_scientificNotation', _.get( NuclearDecayCommonStrings, 'a11y.scientificNotationStringProperty' ), [{"name":"exponent"},{"name":"mantissa"}] ),
    signSelector: new FluentPattern<{ sign: 'positive' | 'negative' | TReadOnlyProperty<'positive' | 'negative'>, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_signSelector', _.get( NuclearDecayCommonStrings, 'a11y.signSelectorStringProperty' ), [{"name":"sign","variants":["positive","negative"]},{"name":"value"}] ),
    alphaDecay: {
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_screenSummary_playArea', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.screenSummary.playAreaStringProperty' ) ),
        energyGraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_screenSummary_energyGraph', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.screenSummary.energyGraphStringProperty' ) ),
        playAreaSelector: new FluentPattern<{ quantum: 'true' | 'false' | TReadOnlyProperty<'true' | 'false'> }>( fluentSupport.bundleProperty, 'a11y_alphaDecay_screenSummary_playAreaSelector', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.screenSummary.playAreaSelectorStringProperty' ), [{"name":"quantum","variants":["true","false"]}] ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_screenSummary_controlArea', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: new FluentPattern<{ atom: 'noAtom' | 'withAtom' | TReadOnlyProperty<'noAtom' | 'withAtom'>, isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_alphaDecay_screenSummary_currentDetails', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.screenSummary.currentDetailsStringProperty' ), [{"name":"atom","variants":["noAtom","withAtom"]},{"name":"isotope"}] ),
        interactionHint: {
          addAtomStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_screenSummary_interactionHint_addAtom', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.screenSummary.interactionHint.addAtomStringProperty' ) ),
          afterDecayStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_screenSummary_interactionHint_afterDecay', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.screenSummary.interactionHint.afterDecayStringProperty' ) )
        }
      },
      radioactiveAtomHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_radioactiveAtomHeading', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.radioactiveAtomHeadingStringProperty' ) ),
      addAtomButton: {
        accessibleContextResponse: new FluentPattern<{ isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_alphaDecay_addAtomButton_accessibleContextResponse', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.addAtomButton.accessibleContextResponseStringProperty' ), [{"name":"isotope"}] )
      },
      atomInPlayArea: {
        readyToDecay: new FluentPattern<{ isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_alphaDecay_atomInPlayArea_readyToDecay', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.atomInPlayArea.readyToDecayStringProperty' ), [{"name":"isotope"}] ),
        nowPresent: new FluentPattern<{ decayTime: FluentVariable, isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_alphaDecay_atomInPlayArea_nowPresent', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.atomInPlayArea.nowPresentStringProperty' ), [{"name":"decayTime"},{"name":"isotope"}] )
      },
      atomDecay: {
        alphaParticleEmitted: new FluentPattern<{ decayTime: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_alphaDecay_atomDecay_alphaParticleEmitted', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.atomDecay.alphaParticleEmittedStringProperty' ), [{"name":"decayTime"}] )
      },
      resetAtomButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_resetAtomButton_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.resetAtomButton.accessibleNameStringProperty' ) ),
        accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_resetAtomButton_accessibleContextResponse', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.resetAtomButton.accessibleContextResponseStringProperty' ) )
      },
      decayDataHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_decayDataHeading', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.decayDataHeadingStringProperty' ) ),
      multipleAtomsScreen: {
        decayParticleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaDecay_multipleAtomsScreen_decayParticle', _.get( NuclearDecayCommonStrings, 'a11y.alphaDecay.multipleAtomsScreen.decayParticleStringProperty' ) )
      }
    },
    energyDiagram: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.accessibleNameStringProperty' ) ),
      accessibleHelpTextCollapsedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleHelpTextCollapsed', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.accessibleHelpTextCollapsedStringProperty' ) ),
      staticDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_staticDescription', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.staticDescriptionStringProperty' ) ),
      beforeDecay: {
        leadingParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_beforeDecay_leadingParagraph', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.beforeDecay.leadingParagraphStringProperty' ) ),
        alphaParticleInWell: new FluentPattern<{ position: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_energyDiagram_beforeDecay_alphaParticleInWell', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.beforeDecay.alphaParticleInWellStringProperty' ), [{"name":"position"}] ),
        escapeDistance: new FluentPattern<{ distance: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_energyDiagram_beforeDecay_escapeDistance', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.beforeDecay.escapeDistanceStringProperty' ), [{"name":"distance"}] ),
        escapeDistanceDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_beforeDecay_escapeDistanceDescription', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.beforeDecay.escapeDistanceDescriptionStringProperty' ) )
      },
      afterDecay: {
        accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_afterDecay_accessibleParagraph', _.get( NuclearDecayCommonStrings, 'a11y.energyDiagram.afterDecay.accessibleParagraphStringProperty' ) )
      }
    },
    escapeDistanceContextResponse: new FluentPattern<{ distanceProgress: FluentVariable, hLifeProgress: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_escapeDistanceContextResponse', _.get( NuclearDecayCommonStrings, 'a11y.escapeDistanceContextResponseStringProperty' ), [{"name":"distanceProgress"},{"name":"hLifeProgress"}] ),
    potentialEnergySlider: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialEnergySlider_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.potentialEnergySlider.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialEnergySlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.potentialEnergySlider.accessibleHelpTextStringProperty' ) )
    },
    alphaParticleEnergySlider: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaParticleEnergySlider_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.alphaParticleEnergySlider.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_alphaParticleEnergySlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.alphaParticleEnergySlider.accessibleHelpTextStringProperty' ) )
    },
    decayTimeHistogram: {
      accessibleParagraph: new FluentPattern<{ hLifeTime: FluentVariable, isotope: FluentVariable, scale: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_decayTimeHistogram_accessibleParagraph', _.get( NuclearDecayCommonStrings, 'a11y.decayTimeHistogram.accessibleParagraphStringProperty' ), [{"name":"hLifeTime"},{"name":"isotope"},{"name":"scale"}] ),
      scale: new FluentPattern<{ scale: 'linear' | 'logarithmic' | TReadOnlyProperty<'linear' | 'logarithmic'> }>( fluentSupport.bundleProperty, 'a11y_decayTimeHistogram_scale', _.get( NuclearDecayCommonStrings, 'a11y.decayTimeHistogram.scaleStringProperty' ), [{"name":"scale","variants":["linear","logarithmic"]}] )
    },
    halfLifeSlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_halfLifeSlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.halfLifeSlider.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponse: new FluentPattern<{ distanceProgress: FluentVariable, initialEProgress: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_halfLifeSlider_accessibleContextResponse', _.get( NuclearDecayCommonStrings, 'a11y.halfLifeSlider.accessibleContextResponseStringProperty' ), [{"name":"distanceProgress"},{"name":"initialEProgress"}] )
    },
    dataProbeSlider: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_dataProbeSlider_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.dataProbeSlider.accessibleHelpTextStringProperty' ) )
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
      afterDecay: new FluentPattern<{ daughterIsotope: FluentVariable, parentIsotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_nuclearEquation_afterDecay', _.get( NuclearDecayCommonStrings, 'a11y.nuclearEquation.afterDecayStringProperty' ), [{"name":"daughterIsotope"},{"name":"parentIsotope"}] )
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
    },
    multipleAtoms: {
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_screenSummary_playArea', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_screenSummary_controlArea', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: new FluentPattern<{ atom: 'noAtoms' | 'withAtoms' | TReadOnlyProperty<'noAtoms' | 'withAtoms'>, percentage: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_multipleAtoms_screenSummary_currentDetails', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.screenSummary.currentDetailsStringProperty' ), [{"name":"atom","variants":["noAtoms","withAtoms"]},{"name":"percentage"}] ),
        interactionHint: {
          addAtomsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_screenSummary_interactionHint_addAtoms', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.screenSummary.interactionHint.addAtomsStringProperty' ) ),
          afterDecayStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_screenSummary_interactionHint_afterDecay', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.screenSummary.interactionHint.afterDecayStringProperty' ) )
        }
      },
      radioactiveSampleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_radioactiveSampleHeading', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.radioactiveSampleHeadingStringProperty' ) ),
      radioactiveSample: {
        noAtoms: new FluentPattern<{ isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_multipleAtoms_radioactiveSample_noAtoms', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.radioactiveSample.noAtomsStringProperty' ), [{"name":"isotope"}] ),
        readyToDecay: new FluentPattern<{ addedAtoms: FluentVariable, isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_multipleAtoms_radioactiveSample_readyToDecay', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.radioactiveSample.readyToDecayStringProperty' ), [{"name":"addedAtoms"},{"name":"isotope"}] ),
        decayOccurring: new FluentPattern<{ addedAtoms: FluentVariable, decayedCount: FluentVariable, decayParticle: FluentVariable, isotope: FluentVariable, percentageUndecayed: FluentVariable, time: FluentVariable, undecayedCount: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_multipleAtoms_radioactiveSample_decayOccurring', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.radioactiveSample.decayOccurringStringProperty' ), [{"name":"addedAtoms"},{"name":"decayedCount"},{"name":"decayParticle"},{"name":"isotope"},{"name":"percentageUndecayed"},{"name":"time"},{"name":"undecayedCount"}] )
      },
      numberOfAtomsControl: {
        accessibleName: new FluentPattern<{ isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_multipleAtoms_numberOfAtomsControl_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.numberOfAtomsControl.accessibleNameStringProperty' ), [{"name":"isotope"}] )
      },
      addAtomsButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_addAtomsButton_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.addAtomsButton.accessibleNameStringProperty' ) )
      },
      resetSampleButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_resetSampleButton_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.resetSampleButton.accessibleNameStringProperty' ) )
      },
      decayDataHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_decayDataHeading', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.decayDataHeadingStringProperty' ) ),
      decayTimeHistogramAtHalfLife: new FluentPattern<{ halfLifePercentageUndecayed: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_multipleAtoms_decayTimeHistogramAtHalfLife', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.decayTimeHistogramAtHalfLifeStringProperty' ), [{"name":"halfLifePercentageUndecayed"}] ),
      labelsCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_labelsCheckbox_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.labelsCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_labelsCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.labelsCheckbox.accessibleHelpTextStringProperty' ) )
      },
      stopwatchCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_stopwatchCheckbox_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.stopwatchCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_multipleAtoms_stopwatchCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.multipleAtoms.stopwatchCheckbox.accessibleHelpTextStringProperty' ) )
      }
    },
    decayRate: {
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_screenSummary_playArea', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_screenSummary_controlArea', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: new FluentPattern<{ atom: 'noAtoms' | 'withAtoms' | TReadOnlyProperty<'noAtoms' | 'withAtoms'>, percentage: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_decayRate_screenSummary_currentDetails', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.screenSummary.currentDetailsStringProperty' ), [{"name":"atom","variants":["noAtoms","withAtoms"]},{"name":"percentage"}] ),
        interactionHint: {
          addAtomsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_screenSummary_interactionHint_addAtoms', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.screenSummary.interactionHint.addAtomsStringProperty' ) ),
          afterDecayStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_screenSummary_interactionHint_afterDecay', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.screenSummary.interactionHint.afterDecayStringProperty' ) )
        }
      },
      radioactiveSample: {
        decayOccurring: new FluentPattern<{ addedAtoms: FluentVariable, decayedCount: FluentVariable, isotope: FluentVariable, percentageUndecayed: FluentVariable, time: FluentVariable, undecayedCount: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_decayRate_radioactiveSample_decayOccurring', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.radioactiveSample.decayOccurringStringProperty' ), [{"name":"addedAtoms"},{"name":"decayedCount"},{"name":"isotope"},{"name":"percentageUndecayed"},{"name":"time"},{"name":"undecayedCount"}] )
      },
      decayGraphHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_decayGraphHeading', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.decayGraphHeadingStringProperty' ) ),
      decayGraphPanel: {
        accessibleParagraph: new FluentPattern<{ checkedComponents: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_decayRate_decayGraphPanel_accessibleParagraph', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.decayGraphPanel.accessibleParagraphStringProperty' ), [{"name":"checkedComponents"}] )
      },
      undecayedCheckbox: {
        accessibleName: new FluentPattern<{ isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_decayRate_undecayedCheckbox_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.undecayedCheckbox.accessibleNameStringProperty' ), [{"name":"isotope"}] ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_undecayedCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.undecayedCheckbox.accessibleHelpTextStringProperty' ) )
      },
      decayedCheckbox: {
        accessibleName: new FluentPattern<{ isotope: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_decayRate_decayedCheckbox_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.decayedCheckbox.accessibleNameStringProperty' ), [{"name":"isotope"}] ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_decayedCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.decayedCheckbox.accessibleHelpTextStringProperty' ) )
      },
      halfLivesCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_halfLivesCheckbox_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.halfLivesCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_halfLivesCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.halfLivesCheckbox.accessibleHelpTextStringProperty' ) )
      },
      dataProbeCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_dataProbeCheckbox_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.dataProbeCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_dataProbeCheckbox_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.dataProbeCheckbox.accessibleHelpTextStringProperty' ) )
      },
      sortButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_sortButton_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.sortButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_sortButton_accessibleHelpText', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.sortButton.accessibleHelpTextStringProperty' ) )
      },
      resetSampleButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_decayRate_resetSampleButton_accessibleName', _.get( NuclearDecayCommonStrings, 'a11y.decayRate.resetSampleButton.accessibleNameStringProperty' ) )
      }
    },
    particlesLegendPanel: {
      accessibleList: {
        leadingParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particlesLegendPanel_accessibleList_leadingParagraph', _.get( NuclearDecayCommonStrings, 'a11y.particlesLegendPanel.accessibleList.leadingParagraphStringProperty' ) ),
        protonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particlesLegendPanel_accessibleList_proton', _.get( NuclearDecayCommonStrings, 'a11y.particlesLegendPanel.accessibleList.protonStringProperty' ) ),
        neutronStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particlesLegendPanel_accessibleList_neutron', _.get( NuclearDecayCommonStrings, 'a11y.particlesLegendPanel.accessibleList.neutronStringProperty' ) ),
        alphaParticleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_particlesLegendPanel_accessibleList_alphaParticle', _.get( NuclearDecayCommonStrings, 'a11y.particlesLegendPanel.accessibleList.alphaParticleStringProperty' ) )
      }
    }
  }
};

export default NuclearDecayCommonFluent;

nuclearDecayCommon.register('NuclearDecayCommonFluent', NuclearDecayCommonFluent);
