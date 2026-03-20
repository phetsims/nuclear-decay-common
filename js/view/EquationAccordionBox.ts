// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the Equation title as well as the decay equation
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Isotope from '../model/Isotope.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import EquationNode from './EquationNode.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type EquationAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class EquationAccordionBox extends NuclearDecayAccordionBox {

  public constructor( isotopeProperty: TReadOnlyProperty<Isotope>, providedOptions?: EquationAccordionBoxOptions ) {

    const titleNode = new Text( NuclearDecayCommonFluent.equationStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const options = optionize<EquationAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    // TODO handle change of isotope and update the equation accordingly https://github.com/phetsims/alpha-decay/issues/3
    const equationNode = EquationNode.createFromIsotope( isotopeProperty.value );

    super( equationNode, options );
  }
}
