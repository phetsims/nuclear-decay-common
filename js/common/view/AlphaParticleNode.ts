// Copyright 2026, University of Colorado Boulder
/**
 * A node that represents an alpha particle, which consists of 2 protons and 2 neutrons.
 *
 * @author Agustín Vallejo
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import ParticleNode from '../../../../shred/js/view/ParticleNode.js';

type SelfOptions = {
  nucleonDiameter?: number;
  particleOffsetRate?: number; // Proportion of the diameter that the particles are apart in the icon
};

export type AlphaParticleNodeOptions = SelfOptions & NodeOptions;

export default class AlphaParticleNode extends Node {
  public constructor( providedOptions?: AlphaParticleNodeOptions ) {

    const options = optionize<AlphaParticleNodeOptions, SelfOptions, NodeOptions>()( {
      // JB REVIEW: Why diameter? Don't we generally use radius in other places?
      nucleonDiameter: 20,
      particleOffsetRate: 0.7
    }, providedOptions );

    // This will go away when we populate properly the atomNode
    const particleOffset = options.particleOffsetRate * options.nucleonDiameter;

    const nucleonRadius = options.nucleonDiameter / 2;

    options.children = [
      new ParticleNode( 'proton', nucleonRadius, { x: 0, y: 0 } ),
      new ParticleNode( 'neutron', nucleonRadius, { x: particleOffset, y: 0 } ),
      new ParticleNode( 'neutron', nucleonRadius, { x: 0, y: particleOffset } ),
      new ParticleNode( 'proton', nucleonRadius, { x: particleOffset, y: particleOffset } )
    ];

    super( options );
  }
}