// Copyright 2026, University of Colorado Boulder
/**
 * Decay equation. By default all shown equations are of the form A -> B + C.
 *
 * @author Agustín Vallejo
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import PlusNode from '../../../scenery-phet/js/PlusNode.js';
import HBox, { HBoxOptions } from '../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Isotope from '../model/Isotope.js';
import EquationElementNode from './EquationElementNode.js';

type SelfOptions = EmptySelfOptions;

export type EquationNodeOptions = SelfOptions & HBoxOptions;

export default class EquationNode extends HBox {
  public constructor(
    firstTerm: Node,
    secondTerm: Node,
    thirdTerm: Node,
    providedOptions: EquationNodeOptions
  ) {
    const options = optionize<SelfOptions, EmptySelfOptions, EquationNodeOptions>()( {
    }, providedOptions );

    const arrowNode = new ArrowNode( 0, 0, 70, 0, {
      stroke: 'black',
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30,
      lineWidth: 1.5,
      scale: 1 / 7
    } );

    const plusNode = new PlusNode( { size: new Dimension2( 10, 2 ) } );

    options.children = [ firstTerm, arrowNode, secondTerm, plusNode, thirdTerm ];

    super( options );
  }

  public static createFromIsotope( isotope: Isotope ): EquationNode {
    const firstTerm = EquationElementNode.createFromIsotope( isotope, {} );
    const secondTerm = EquationElementNode.createFromIsotope( isotope.decaysIntoProperty.value!, {} );
    const thirdTerm = EquationElementNode.createFromIsotope( new Isotope( 2, 2 ), {} );

    return new EquationNode( firstTerm, secondTerm, thirdTerm, {} );
  }
}
