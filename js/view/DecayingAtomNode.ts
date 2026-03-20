// Copyright 2026, University of Colorado Boulder
/**
 * DecayingAtomNode is the portrayal of the decaying atom, with its protons and neutrons sometimes jumping around.
 *
 * @author Agustín Vallejo
 */

import optionize from '../../../phet-core/js/optionize.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import ShredColors from '../../../shred/js/ShredColors.js';
import DecayingAtom from '../model/DecayingAtom.js';

type SelfOptions = {

  nucleonDiameter?: number;

  // Sometimes we want to hard-code the number of visible protons and neutrons
  // instead of using the actual number in the atom
  protonNumber?: number;
  neutronNumber?: number;
};

export type DecayingAtomNodeOptions = SelfOptions & NodeOptions;

export default class DecayingAtomNode extends Node {
  public constructor( decayingAtom: DecayingAtom, providedOptions: DecayingAtomNodeOptions ) {
    const options = optionize<DecayingAtomNodeOptions, SelfOptions, NodeOptions>()( {
      protonNumber: 10,
      neutronNumber: 10,

      nucleonDiameter: 20
    }, providedOptions );

    // This will go away when we populate properly the atomNode
    const PARTICLE_OFFSET = 0.7 * 20; // how far apart the particles are in the icon

    options.children = [
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.protonColorProperty, x: 0, y: 0 } ),
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.neutronColorProperty, x: PARTICLE_OFFSET, y: 0 } ),
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.neutronColorProperty, x: 0, y: PARTICLE_OFFSET } ),
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.protonColorProperty, x: PARTICLE_OFFSET, y: PARTICLE_OFFSET } )
    ];

    super( options );
    //nop
  }
}