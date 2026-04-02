// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the Equation title as well as the decay equation
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Text from '../../../scenery/js/nodes/Text.js';
import { SelectableIsotopes } from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
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

    const titleNode = new Text( NuclearDecayCommonFluent.equationStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const options = optionize<EquationAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    const equationNode = EquationNode.createEquation(
      isotopeProperty,
      isPlayAreaEmptyProperty,
      hasDecayOcurredProperty
    );

    super( equationNode, options );
  }
}
