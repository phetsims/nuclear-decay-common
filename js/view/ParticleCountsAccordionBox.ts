// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the ParticleCounts title as well as the number of particles in the nucleus.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import DynamicProperty from '../../../axon/js/DynamicProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import Isotope from '../model/Isotope.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type ParticleCountsAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class ParticleCountsAccordionBox extends NuclearDecayAccordionBox {
  public constructor( model: NuclearDecayModel, providedOptions?: ParticleCountsAccordionBoxOptions ) {

    // TODO: This is not yet dynamic! https://github.com/phetsims/alpha-decay/issues/3
    const currentIsotopeNameProperty = model.selectedIsotopeProperty.derived( ( isotope: Isotope ) => {
      return AtomNameUtils.getNameAndMass(
        isotope.protonCountProperty.value,
        isotope.neutronCountProperty.value
      );
    } );

    const currentIsotopeSymbolStringProperty = model.selectedIsotopeProperty.derived( ( isotope: Isotope ) => {
      return AtomNameUtils.getMassAndSymbol( isotope.protonCountProperty.value, isotope.neutronCountProperty.value );
    } );

    const currentIsotopeProtonCountProperty = new DynamicProperty<number, number, Isotope>( model.selectedIsotopeProperty, {
      derive: 'protonCountProperty'
    } );

    const currentIsotopeNeutronCountProperty = new DynamicProperty<number, number, Isotope>( model.selectedIsotopeProperty, {
      derive: 'neutronCountProperty'
    } );

    const isotopeInfoTitleStringProperty = new DerivedStringProperty(
      [
        currentIsotopeNameProperty,
        currentIsotopeSymbolStringProperty,
        NuclearDecayCommonFluent.isotopeInfoTitleStringProperty
      ], ( nameAndNumber, numberSymbol, pattern ) => {
        return StringUtils.fillIn( pattern, { nameAndNumber: nameAndNumber, numberSymbol: numberSymbol } );
      } );

    const titleNode = new RichText( isotopeInfoTitleStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      fill: NuclearDecayCommonColors.pinkProperty,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const protonsStringProperty = new DerivedStringProperty(
      [
        currentIsotopeProtonCountProperty,
        NuclearDecayCommonFluent.protonsPatternStringProperty
      ], ( protons, pattern ) => {
        return StringUtils.fillIn( pattern, { protons: protons } );
      } );

    const neutronsStringProperty = new DerivedStringProperty(
      [
        currentIsotopeNeutronCountProperty,
        NuclearDecayCommonFluent.neutronsPatternStringProperty
      ], ( neutrons, pattern ) => {
        return StringUtils.fillIn( pattern, { neutrons: neutrons } );
      } );

    const options = optionize<ParticleCountsAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    const contentsNode = new VBox( {
      spacing: 5,
      align: 'left',
      children: [
        new Text( protonsStringProperty, {
          font: NuclearDecayCommonConstants.CONTROL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
        } ),
        new Text( neutronsStringProperty, {
          font: NuclearDecayCommonConstants.CONTROL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
        } )
      ]
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'ParticleCountsAccordionBox', ParticleCountsAccordionBox );
