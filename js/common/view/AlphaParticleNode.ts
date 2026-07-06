// Copyright 2026, University of Colorado Boulder
/**
 * A node that represents an alpha particle, which consists of 2 protons and 2 neutrons.
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import ParticleNode from '../../../../shred/js/view/ParticleNode.js';

type SelfOptions = {
  nucleonDiameter?: number;
  particleOffsetRate?: number; // Proportion of the diameter that the particles are apart in the icon
};

export type AlphaParticleNodeOptions = SelfOptions & NodeOptions;

// The relative positions of the four nucleons, in units of the particle offset, for the 2x2 arrangement.
const NUCLEON_GRID_POSITIONS = [
  new Vector2( 0, 0 ),
  new Vector2( 1, 0 ),
  new Vector2( 0, 1 ),
  new Vector2( 1, 1 )
];

export default class AlphaParticleNode extends Node {

  // Proportion of the nucleon diameter by which adjacent nucleons are offset from one another.
  private readonly particleOffsetRate: number;

  // The four nucleon nodes (2 protons and 2 neutrons), ordered to match NUCLEON_GRID_POSITIONS.
  private readonly nucleonNodes: ParticleNode[];

  public constructor( providedOptions?: AlphaParticleNodeOptions ) {

    const options = optionize<AlphaParticleNodeOptions, SelfOptions, NodeOptions>()( {
      // JB REVIEW: Why diameter? Don't we generally use radius in other places?
      nucleonDiameter: 20,
      particleOffsetRate: 0.7
    }, providedOptions );

    const nucleonNodes = [
      new ParticleNode( 'proton', 1 ),
      new ParticleNode( 'neutron', 1 ),
      new ParticleNode( 'neutron', 1 ),
      new ParticleNode( 'proton', 1 )
    ];
    options.children = nucleonNodes;

    super( options );

    this.particleOffsetRate = options.particleOffsetRate;
    this.nucleonNodes = nucleonNodes;

    // Set the initial size and positions of the nucleons.
    this.setNucleonRadius( options.nucleonDiameter / 2 );
  }

  /**
   * Set the radius of each nucleon, in view coordinates, updating the nucleon sizes, line widths, and the spacing
   * between them accordingly.
   */
  public setNucleonRadius( nucleonRadius: number ): void {
    const particleOffset = this.particleOffsetRate * nucleonRadius * 2;
    const lineWidth = nucleonRadius / 8; // empirically determined

    this.nucleonNodes.forEach( ( nucleonNode, index ) => {
      nucleonNode.setRadius( nucleonRadius );
      nucleonNode.lineWidth = lineWidth;
      nucleonNode.translation = NUCLEON_GRID_POSITIONS[ index ].timesScalar( particleOffset );
    } );
  }
}