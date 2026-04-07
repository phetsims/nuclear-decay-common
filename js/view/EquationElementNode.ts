// Copyright 2026, University of Colorado Boulder
/**
 * Equation element for the decay equation, with superscript and subscript support.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import type TPaint from '../../../scenery/js/util/TPaint.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import NuclearDecayModel, { ValidIsotopes } from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';

type SelfOptions = {
  fill?: TPaint;
  isActiveProperty?: TReadOnlyProperty<boolean>;
};

export type EquationElementNodeOptions = SelfOptions & NodeOptions;

const TEXT_FONT = NuclearDecayCommonConstants.CONTROL_FONT;

// With small text we refer to the superscript and subscript, which are typically smaller than the main symbol text.
const SMALL_TEXT_FONT = new PhetFont( 10 );
const SMALL_TEXT_OFFSET = 4;

export default class EquationElementNode extends Node {
  public constructor(
    symbolStringProperty: string,
    superscriptStringProperty: TReadOnlyProperty<string> | string,
    subscriptStringProperty: TReadOnlyProperty<string> | string,
    providedOptions: EquationElementNodeOptions ) {
    const options = optionize<EquationElementNodeOptions, SelfOptions, NodeOptions>()( {
      isActiveProperty: new BooleanProperty( true ),
      fill: 'black'
    }, providedOptions );

    const symbolText = new RichText( symbolStringProperty, {
      font: TEXT_FONT,
      fill: options.fill,
      visibleProperty: options.isActiveProperty
    } );
    const superscriptText = new RichText( superscriptStringProperty, {
      font: SMALL_TEXT_FONT,
      fill: options.fill,
      right: symbolText.left - SMALL_TEXT_OFFSET,
      bottom: symbolText.top + SMALL_TEXT_OFFSET,
      visibleProperty: options.isActiveProperty
    } );
    const subscriptText = new RichText( subscriptStringProperty, {
      font: SMALL_TEXT_FONT,
      fill: options.fill,
      right: symbolText.left - SMALL_TEXT_OFFSET,
      bottom: symbolText.bottom + SMALL_TEXT_OFFSET,
      visibleProperty: options.isActiveProperty
    } );

    // Show a question mark when the element is not active
    const questionMarkNode = new RichText( '?', {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      fill: options.fill,
      center: symbolText.center,
      visibleProperty: options.isActiveProperty.derived( isActive => !isActive )
    } );

    options.children = [
      symbolText,
      superscriptText,
      subscriptText,
      questionMarkNode
    ];

    super( options );
    //nop
  }

  public static createFromIsotope( isotope: ValidIsotopes, providedOptions: EquationElementNodeOptions ): EquationElementNode {
    const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
    return new EquationElementNode(
      AtomNameUtils.getSymbol( atomConfig.protonCount ),
      `${atomConfig.protonCount + atomConfig.neutronCount}`,
      `${atomConfig.protonCount}`,
      providedOptions
    );
  }
}
