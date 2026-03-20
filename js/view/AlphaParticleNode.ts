// Copyright 2026, University of Colorado Boulder
/**
 * A node that represents an alpha particle, which consists of 2 protons and 2 neutrons.
 *
 * @author Agustín Vallejo
 */

import optionize from '../../../phet-core/js/optionize.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import ShredColors from '../../../shred/js/ShredColors.js';
import { DecayingAtomNodeOptions } from './DecayingAtomNode.js';

type SelfOptions = {
  nucleonDiameter?: number;
  particleOffsetRate?: number; // Proportion of the diameter that the particles are apart in the icon
};

export type AlphaParticleNodeOptions = SelfOptions & NodeOptions;

export default class AlphaParticleNode extends Node {
  public constructor( providedOptions: AlphaParticleNodeOptions ) {

    const options = optionize<DecayingAtomNodeOptions, SelfOptions, NodeOptions>()( {
      nucleonDiameter: 20,
      particleOffsetRate: 0.7
    }, providedOptions );

    // This will go away when we populate properly the atomNode
    const particleOffset = options.particleOffsetRate * options.nucleonDiameter;

    options.children = [
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.protonColorProperty, x: 0, y: 0 } ),
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.neutronColorProperty, x: particleOffset, y: 0 } ),
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.neutronColorProperty, x: 0, y: particleOffset } ),
      new ShadedSphereNode( options.nucleonDiameter, { mainColor: ShredColors.protonColorProperty, x: particleOffset, y: particleOffset } )
    ];

    super( options );
  }
}