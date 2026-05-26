// Copyright 2026, University of Colorado Boulder
/**
 * Decay equation. By default all shown equations are of the form A -> B + C.
 *
 * @author Agustín Vallejo
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import NuclearDecayAtom, { StartingIsotopes } from '../../common/model/NuclearDecayAtom.js';
import EquationElementNode from './EquationElementNode.js';

type SelfOptions = EmptySelfOptions;

export type EquationNodeOptions = SelfOptions & HBoxOptions;

export default class EquationNode extends HBox {
  public constructor(
    isotopeProperty: TReadOnlyProperty<StartingIsotopes>,
    isPlayAreaEmptyProperty: TReadOnlyProperty<boolean>,
    hasDecayOcurredProperty: TReadOnlyProperty<boolean>,
    isCustomProperty: TReadOnlyProperty<boolean>,
    providedOptions?: EquationNodeOptions
  ) {

    const options = optionize<EquationNodeOptions, SelfOptions, HBoxOptions>()( {
      spacing: 5
    }, providedOptions );

    const undecayedIsotope = isotopeProperty.value;
    const decayedIsotope = NuclearDecayAtom.getDecayProduct( undecayedIsotope );
    const firstTermIsotope = EquationElementNode.createFromIsotope( undecayedIsotope, {
      isActiveProperty: isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty ),
      visibleProperty: isCustomProperty.derived( isCustom => !isCustom )
    } );
    const secondTermIsotope = EquationElementNode.createFromIsotope( decayedIsotope, {
      isActiveProperty: hasDecayOcurredProperty,
        visibleProperty: isCustomProperty.derived( isCustom => !isCustom )
    } );

    const firstTermCustom = new EquationElementNode( 'A', '(p+n)', 'p', {
      isActiveProperty: isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty ),
      visibleProperty: isCustomProperty
    } );

    // (p+n)-4 and p-2
    const secondTermCustom = new EquationElementNode( 'B',
      '(p+n)\u22124', 'p\u22122', {
        isActiveProperty: hasDecayOcurredProperty,
        visibleProperty: isCustomProperty
      } );


    const thirdTerm = EquationElementNode.createFromIsotope( 'helium-2', {
      isActiveProperty: hasDecayOcurredProperty
    } );

    const arrowNode = new ArrowNode( 0, 0, 20, 0, {
      stroke: 'black',
      tailWidth: 1,
      headWidth: 6,
      headHeight: 5,
      lineWidth: 1.5
    } );

    const plusNode = new PlusNode( { size: new Dimension2( 8, 2 ) } );

    options.children = [
      firstTermIsotope, firstTermCustom,
      arrowNode,
      secondTermIsotope, secondTermCustom,
      plusNode,
      thirdTerm
    ];

    super( options );
  }

}
