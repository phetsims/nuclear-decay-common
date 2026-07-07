// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the Equation title as well as the decay equation
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../../shred/js/AtomNameUtils.js';
import NuclearDecayAtom, { StartingIsotopes } from '../../common/model/NuclearDecayAtom.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from '../../common/view/NuclearDecayAccordionBox.js';
import NuclearDecayCommonConstants from '../../common/NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import EquationNode from './EquationNode.js';

type SelfOptions = EmptySelfOptions;

export type EquationAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class EquationAccordionBox extends NuclearDecayAccordionBox {

  public constructor(
    isotopeProperty: TReadOnlyProperty<StartingIsotopes>,
    isPlayAreaEmptyProperty: TReadOnlyProperty<boolean>,
    hasDecayOccurredProperty: TReadOnlyProperty<boolean>,
    isCustomProperty: TReadOnlyProperty<boolean>,
    providedOptions?: EquationAccordionBoxOptions
  ) {

    const titleNode = new Text( NuclearDecayCommonFluent.nuclearEquationStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const options = optionize<EquationAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH,
      maxWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH,
      accessibleHelpTextCollapsed: NuclearDecayCommonFluent.a11y.nuclearEquation.accessibleHelpTextCollapsedStringProperty,
      showTitleWhenExpanded: false
    }, providedOptions );

    const equationNode = new EquationNode(
      isotopeProperty,
      isPlayAreaEmptyProperty,
      hasDecayOccurredProperty,
      isCustomProperty
    );

    const equationParagraphStringProperty = new DerivedStringProperty(
      [
        isotopeProperty,
        isPlayAreaEmptyProperty,
        hasDecayOccurredProperty,
        NuclearDecayCommonFluent.a11y.nuclearEquation.noEquationStringProperty,
        NuclearDecayCommonFluent.isotopeAStringProperty,
        NuclearDecayCommonFluent.isotopeBStringProperty
      ], ( isotope, isPlayAreaEmpty, hasDecayOccurred, noEquation, isotopeAName, isotopeBName ) => {
        if ( isPlayAreaEmpty ) {
          return noEquation;
        }
        const decayProduct = NuclearDecayAtom.getDecayProduct( isotope );
        const parentConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
        const daughterConfig = NuclearDecayAtom.getIsotopeAtomConfig( decayProduct );
        const parentIsotopeName = isotope === 'custom' ? isotopeAName :
          AtomNameUtils.getNameAndMass( parentConfig.protonCount, parentConfig.neutronCount ).value;

        if ( !hasDecayOccurred ) {
          return NuclearDecayCommonFluent.a11y.nuclearEquation.beforeDecay.format( { parentIsotope: parentIsotopeName } );
        }

        const daughterIsotopeName = isotope === 'custom' ? isotopeBName :
          AtomNameUtils.getNameAndMass( daughterConfig.protonCount, daughterConfig.neutronCount ).value;
        return NuclearDecayCommonFluent.a11y.nuclearEquation.afterDecay.format( {
          parentIsotope: parentIsotopeName,
          daughterIsotope: daughterIsotopeName
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
