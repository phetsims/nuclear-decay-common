// Copyright 2026, University of Colorado Boulder
/**
 * Equation element for the decay equation, with superscript and subscript support.
 *
 * @author Agustín Vallejo
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import type TPaint from '../../../scenery/js/util/TPaint.js';
import Isotope from '../model/Isotope.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';

type SelfOptions = {
  fill?: TPaint;
};

export type EquationElementNodeOptions = SelfOptions & NodeOptions;

const TEXT_FONT = new PhetFont( 14 );

// With small text we refer to the superscript and subscript, which are typically smaller than the main symbol text.
const SMALL_TEXT_FONT = new PhetFont( 10 );
const SMALL_TEXT_OFFSET = 4;

export default class EquationElementNode extends Node {
  public constructor(
    symbolStringProperty: TReadOnlyProperty<string>,
    superscriptStringProperty: TReadOnlyProperty<string>,
    subscriptStringProperty: TReadOnlyProperty<string>,
    providedOptions: EquationElementNodeOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, EquationElementNodeOptions>()( {
      // Default options go here
    }, providedOptions );

    const symbolText = new RichText( symbolStringProperty, { font: TEXT_FONT, fill: options.fill } );
    const superscriptText = new RichText( superscriptStringProperty, {
      font: SMALL_TEXT_FONT,
      fill: options.fill,
      right: symbolText.left - SMALL_TEXT_OFFSET,
      bottom: symbolText.top + SMALL_TEXT_OFFSET
    } );
    const subscriptText = new RichText( subscriptStringProperty, {
      font: SMALL_TEXT_FONT,
      fill: options.fill,
      right: symbolText.left - SMALL_TEXT_OFFSET,
      bottom: symbolText.bottom + SMALL_TEXT_OFFSET
    } );

    options.children = [
      symbolText,
      superscriptText,
      subscriptText
    ];

    super( options );
    //nop
  }

  public static createFromIsotope( isotope: Isotope, providedOptions: EquationElementNodeOptions ): EquationElementNode {
    return new EquationElementNode(
      isotope.elementSymbolStringProperty,
      isotope.massNumberProperty.derived( number => number.toString() ),
      isotope.protonCountProperty.derived( number => number.toString() ),
      providedOptions
    );
  }
}

nuclearDecayCommon.register( 'EquationElementNode', EquationElementNode );