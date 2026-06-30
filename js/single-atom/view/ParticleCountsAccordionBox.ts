// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the ParticleCounts title as well as the number of particles in the nucleus.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../../shred/js/AtomNameUtils.js';
import NuclearDecayAtom, { ISOTOPE_TO_COLOR } from '../../common/model/NuclearDecayAtom.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from '../../common/view/NuclearDecayAccordionBox.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import SingleAtomModel from '../model/SingleAtomModel.js';

type SelfOptions = EmptySelfOptions;

export type ParticleCountsAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class ParticleCountsAccordionBox extends NuclearDecayAccordionBox {
  public constructor( model: SingleAtomModel, providedOptions: ParticleCountsAccordionBoxOptions ) {

    const accordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'accordionBoxExpandedProperty' )
    } );

    const isotopeInfoTitleStringProperty = new DerivedStringProperty(
      [
        model.selectedIsotopeProperty,
        model.isPlayAreaEmptyProperty,
        model.hasDecayOccurredProperty,
        accordionBoxExpandedProperty,
        NuclearDecayCommonFluent.isotopeInfoTitleStringProperty,
        NuclearDecayCommonFluent.particleCountsStringProperty,
        NuclearDecayCommonFluent.isotopeAStringProperty,
        NuclearDecayCommonFluent.isotopeBStringProperty
      ], (
        selectedIsotope,
        isPlayAreaEmpty,
        hasDecayOccurred,
        expanded,
        pattern,
        closedTitle,
        isotopeA,
        isotopeB
      ) => {
        if ( expanded ) {
          if ( isPlayAreaEmpty ) {
            return '--';
          }
          else if ( selectedIsotope === 'custom' ) {
            return !hasDecayOccurred ? isotopeA : isotopeB;
          }
          const isotope = hasDecayOccurred ? NuclearDecayAtom.getDecayProduct( selectedIsotope ) : selectedIsotope;
          const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
          return StringUtils.fillIn( pattern, {
            nameAndNumber: AtomNameUtils.getName( atomConfig.protonCount ),
            numberSymbol: AtomNameUtils.getMassAndSymbol( atomConfig.protonCount, atomConfig.neutronCount )
          } );
        }
        else {
          return closedTitle;
        }
      } );

    const titleNode = new RichText( isotopeInfoTitleStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    titleNode.maxHeight = titleNode.height;

    Multilink.multilink(
      [
        model.hasDecayOccurredProperty,
        model.selectedIsotopeProperty,
        accordionBoxExpandedProperty
      ], ( hasDecayed, isotope, expanded ) => {
        titleNode.fill = hasDecayed || !expanded ? 'black' : ISOTOPE_TO_COLOR.get( isotope )!;
      }
    );

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
          // p or p minus 2
          return StringUtils.fillIn( pattern, { protons: !hasDecayOccurred ? 'p' : 'p\u22122' } );
        }
        const isotope = hasDecayOccurred ? NuclearDecayAtom.getDecayProduct( selectedIsotope ) : selectedIsotope;
        const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
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
          // n or n minus 2
          return StringUtils.fillIn( pattern, { neutrons: !hasDecayOccurred ? 'n' : 'n\u22122' } );
        }
        const isotope = hasDecayOccurred ? NuclearDecayAtom.getDecayProduct( selectedIsotope ) : selectedIsotope;
        const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
        return StringUtils.fillIn( pattern, { neutrons: atomConfig.neutronCount } );
      } );

    const options = optionize<ParticleCountsAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH,
      accessibleName: NuclearDecayCommonFluent.a11y.particleCounts.accessibleNameStringProperty,
      accessibleHelpTextCollapsed: NuclearDecayCommonFluent.a11y.particleCounts.accessibleHelpTextCollapsedStringProperty,
      expandedProperty: accordionBoxExpandedProperty
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
        const isotope = hasDecayOccurred ? NuclearDecayAtom.getDecayProduct( selectedIsotope ) : selectedIsotope;
        const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
        if ( selectedIsotope !== 'custom' ) {
          const isotopeName = AtomNameUtils.getNameAndMass( atomConfig.protonCount, atomConfig.neutronCount ).value;
          return NuclearDecayCommonFluent.a11y.particleCounts.accessibleParagraph.format( {
            isotope: isotopeName,
            protons: atomConfig.protonCount,
            neutrons: atomConfig.neutronCount
          } );
        }
        else {
          return NuclearDecayCommonFluent.a11y.particleCounts.accessibleParagraph.format( {
            isotope: hasDecayOccurred ? isotopeBName : isotopeAName,
            protons: hasDecayOccurred ? 'p\u22122' : 'p',
            neutrons: hasDecayOccurred ? 'n\u22122' : 'n'
          } );
        }
      } );

    const contentsNode = new VBox( {
      spacing: 5,
      align: 'left',
      xMargin: 16,
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

  public override reset(): void {
    super.reset();

    // Since we provided the expanded property, we own it and have to reset
    this.expandedProperty.reset();
  }
}
