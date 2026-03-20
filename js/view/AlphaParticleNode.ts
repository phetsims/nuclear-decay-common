// Copyright 2026, University of Colorado Boulder
/**
 * A node that represents an alpha particle, which consists of 2 protons and 2 neutrons.
 *
 * @author Agustín Vallejo
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import ShredColors from '../../../shred/js/ShredColors.js';

type SelfOptions = EmptySelfOptions;

export type AlphaParticleNodeOptions = SelfOptions & NodeOptions;

export default class AlphaParticleNode extends Node {
  public constructor( providedOptions: AlphaParticleNodeOptions ) {

    const SPHERE_DIAMETER = 20;
    const PARTICLE_OFFSET = 0.7 * SPHERE_DIAMETER; // how far apart the particles are in the icon

    const options = optionize<AlphaParticleNodeOptions, SelfOptions, NodeOptions>()( {
      children: [
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.protonColorProperty, x: 0, y: 0 } ),
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.neutronColorProperty, x: PARTICLE_OFFSET, y: 0 } ),
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.neutronColorProperty, x: 0, y: PARTICLE_OFFSET } ),
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.protonColorProperty, x: PARTICLE_OFFSET, y: PARTICLE_OFFSET } )
      ]
    }, providedOptions );

    super( options );
  }
}