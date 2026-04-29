// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the Equation title as well as the decay equation
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../../shred/js/AtomNameUtils.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayModel, { SelectableIsotopes } from '../model/NuclearDecayModel.js';
import EquationNode from './EquationNode.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type EquationAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class EquationAccordionBox extends NuclearDecayAccordionBox {

  public constructor(
    isotopeProperty: TReadOnlyProperty<SelectableIsotopes>,
    isPlayAreaEmptyProperty: TReadOnlyProperty<boolean>,
    hasDecayOcurredProperty: TReadOnlyProperty<boolean>,
    providedOptions?: EquationAccordionBoxOptions
  ) {

    const titleNode = new Text( NuclearDecayCommonFluent.nuclearEquationStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const options = optionize<EquationAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH,
      accessibleHelpTextCollapsed: NuclearDecayCommonFluent.a11y.nuclearEquation.accessibleHelpTextCollapsedStringProperty
    }, providedOptions );

    const equationNode = EquationNode.createEquation(
      isotopeProperty,
      isPlayAreaEmptyProperty,
      hasDecayOcurredProperty
    );

    const equationParagraphStringProperty = new DerivedStringProperty(
      [
        isotopeProperty,
        isPlayAreaEmptyProperty,
        hasDecayOcurredProperty,
        NuclearDecayCommonFluent.a11y.nuclearEquation.noEquationStringProperty,
        NuclearDecayCommonFluent.a11y.nuclearEquation.afterDecayStringProperty,
        NuclearDecayCommonFluent.isotopeAStringProperty,
        NuclearDecayCommonFluent.isotopeBStringProperty
      ], ( isotope, isPlayAreaEmpty, hasDecayOccurred, noEquation, afterDecayPattern, isotopeAName, isotopeBName ) => {
        if ( isPlayAreaEmpty ) {
          return noEquation;
        }
        const decayProduct = NuclearDecayModel.getDecayProduct( isotope );
        const parentConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
        const daughterConfig = NuclearDecayModel.getIsotopeAtomConfig( decayProduct );
        const parentIsotopeName = isotope === 'custom' ? isotopeAName :
          AtomNameUtils.getNameAndMass( parentConfig.protonCount, parentConfig.neutronCount ).value;

        if ( !hasDecayOccurred ) {
          return NuclearDecayCommonFluent.a11y.nuclearEquation.beforeDecay.format( { parentIsotope: parentIsotopeName } );
        }

        const daughterIsotopeName = isotope === 'custom' ? isotopeBName :
          AtomNameUtils.getNameAndMass( daughterConfig.protonCount, daughterConfig.neutronCount ).value;
        return StringUtils.fillIn( afterDecayPattern, {
          parentIsotope: parentIsotopeName,
          daughterIsotope: daughterIsotopeName,
          parentMass: parentConfig.protonCount + parentConfig.neutronCount,
          daughterMass: daughterConfig.protonCount + daughterConfig.neutronCount,
          parentCharge: parentConfig.protonCount,
          daughterCharge: daughterConfig.protonCount
        } );
      } );

    const contentNode = new Node( {
      children: [
        equationNode,
        new Node( { accessibleParagraph: equationParagraphStringProperty } )
      ]
    } );

    super( contentNode, options );
  }
}
