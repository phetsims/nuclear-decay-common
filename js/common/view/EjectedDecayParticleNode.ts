// Copyright 2026, University of Colorado Boulder

/**
 * A node that represents a particle ejected from a nucleus during a decay event.
 * Position and visibility are updated each frame via update() rather than being driven by listeners.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import EjectedDecayParticle from '../model/EjectedDecayParticle.js';
import AlphaParticleNode from './AlphaParticleNode.js';

export default class EjectedDecayParticleNode extends Node {

  private readonly particle: EjectedDecayParticle;
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;

  public constructor(
    particle: EjectedDecayParticle,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    nucleonDiameter: number
  ) {
    super();

    this.particle = particle;
    this.modelViewTransformProperty = modelViewTransformProperty;

    if ( particle.type === 'alpha' ) {
      this.addChild( new AlphaParticleNode( { nucleonDiameter: nucleonDiameter } ) );
    }
    else {
      console.warn( `EjectedDecayParticleNode: particle type not yet supported: ${particle.type}` );
    }

    this.update();
  }

  public update(): void {
    this.visible = this.particle.isActiveProperty.value;
    this.center = this.modelViewTransformProperty.value.modelToViewPosition( this.particle.positionProperty.value );
  }
}
