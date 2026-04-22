// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the ParticleCounts title as well as the number of particles in the nucleus.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import SingleAtomDecayModel from '../model/SingleAtomDecayModel.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type ParticleCountsAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class ParticleCountsAccordionBox extends NuclearDecayAccordionBox {
  public constructor( model: SingleAtomDecayModel, providedOptions?: ParticleCountsAccordionBoxOptions ) {

    const isotopeInfoTitleStringProperty = new DerivedStringProperty(
      [
        model.selectedIsotopeProperty,
        model.isPlayAreaEmptyProperty,
        model.hasDecayOccurredProperty,
        NuclearDecayCommonFluent.isotopeInfoTitleStringProperty
      ], ( selectedIsotope, isPlayAreaEmpty, hasDecayOccurred, pattern ) => {
        if ( isPlayAreaEmpty ) {
          return '--';
        }
        else if ( selectedIsotope === 'custom' ) {
          return NuclearDecayCommonFluent.isotopeAStringProperty.value;
        }
        const isotope = hasDecayOccurred ? NuclearDecayModel.getDecayProduct( selectedIsotope ) : selectedIsotope;
        const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
        return StringUtils.fillIn( pattern, {
          nameAndNumber: AtomNameUtils.getName( atomConfig.protonCount ),
          numberSymbol: AtomNameUtils.getMassAndSymbol( atomConfig.protonCount, atomConfig.neutronCount )
        } );
      } );

    const titleNode = new RichText( isotopeInfoTitleStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );
    model.hasDecayOccurredProperty.link( hasDecayed => {
      titleNode.fill = hasDecayed ? 'black' : NuclearDecayCommonColors.undecayedProperty;
    } );

    const protonsStringProperty = new DerivedStringProperty(
      [
        model.selectedIsotopeProperty,
        model.isPlayAreaEmptyProperty,
        model.hasDecayOccurredProperty,
        NuclearDecayCommonFluent.protonsPatternStringProperty
      ], ( selectedIsotope, isPlayAreaEmpty, hasDecayOccurred, pattern ) => {
        if ( isPlayAreaEmpty ) {
          return StringUtils.fillIn( pattern, { protons: '--' } );
        }
        else if ( selectedIsotope === 'custom' ) {
          return StringUtils.fillIn( pattern, { protons: 'p' } );
        }
        const isotope = hasDecayOccurred ? NuclearDecayModel.getDecayProduct( selectedIsotope ) : selectedIsotope;
        const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
        return StringUtils.fillIn( pattern, { protons: atomConfig.protonCount } );
      } );

    const neutronsStringProperty = new DerivedStringProperty(
      [
        model.selectedIsotopeProperty,
        model.isPlayAreaEmptyProperty,
        model.hasDecayOccurredProperty,
        NuclearDecayCommonFluent.neutronsPatternStringProperty
      ], ( selectedIsotope, isPlayAreaEmpty, hasDecayOccurred, pattern ) => {
        if ( isPlayAreaEmpty ) {
          return StringUtils.fillIn( pattern, { neutrons: '--' } );
        }
        else if ( selectedIsotope === 'custom' ) {
          return StringUtils.fillIn( pattern, { neutrons: 'n' } );
        }
        const isotope = hasDecayOccurred ? NuclearDecayModel.getDecayProduct( selectedIsotope ) : selectedIsotope;
        const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
        return StringUtils.fillIn( pattern, { neutrons: atomConfig.neutronCount } );
      } );

    const options = optionize<ParticleCountsAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH,
      accessibleName: NuclearDecayCommonFluent.a11y.particleCounts.accessibleNameStringProperty,
      accessibleHelpTextCollapsed: NuclearDecayCommonFluent.a11y.particleCounts.accessibleHelpTextCollapsedStringProperty
    }, providedOptions );

    const particleCountsParagraphStringProperty = new DerivedStringProperty(
      [
        model.selectedIsotopeProperty,
        model.isPlayAreaEmptyProperty,
        model.hasDecayOccurredProperty,
        NuclearDecayCommonFluent.a11y.particleCounts.noDataStringProperty,
        NuclearDecayCommonFluent.isotopeAStringProperty,
        NuclearDecayCommonFluent.isotopeBStringProperty
      ], ( selectedIsotope, isPlayAreaEmpty, hasDecayOccurred, noDataString, isotopeAName, isotopeBName ) => {
        if ( isPlayAreaEmpty ) {
          return noDataString;
        }
        const isotope = hasDecayOccurred ? NuclearDecayModel.getDecayProduct( selectedIsotope ) : selectedIsotope;
        const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
        const isotopeName = selectedIsotope === 'custom'
          ? ( hasDecayOccurred ? isotopeBName : isotopeAName )
          : AtomNameUtils.getNameAndMass( atomConfig.protonCount, atomConfig.neutronCount ).value;
        return NuclearDecayCommonFluent.a11y.particleCounts.accessibleParagraph.format( {
          isotope: isotopeName,
          protons: atomConfig.protonCount,
          neutrons: atomConfig.neutronCount
        } );
      } );

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
        } ),
        new Node( { accessibleParagraph: particleCountsParagraphStringProperty } )
      ]
    } );

    super( contentsNode, options );
  }
}
