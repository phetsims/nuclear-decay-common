// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the Equation title as well as the decay equation
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Text from '../../../scenery/js/nodes/Text.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type EquationAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class EquationAccordionBox extends NuclearDecayAccordionBox {

  public constructor( providedOptions?: EquationAccordionBoxOptions ) {

    const titleNode = new Text( NuclearDecayCommonFluent.equationStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    const options = optionize<EquationAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      titleNode: titleNode,
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    // TO BE IMPLEMENTED
    const contentsNode = new Text( 'Hola' );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'EquationAccordionBox', EquationAccordionBox );
