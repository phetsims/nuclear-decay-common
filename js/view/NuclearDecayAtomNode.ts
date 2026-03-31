// Copyright 2026, University of Colorado Boulder

/**
 * NuclearDecayAtomNode is the portrayal of the decaying atom, with its protons and neutrons arranged in a nucleus
 * using ParticleAtomNode from shred. It creates a ParticleAtom from the NuclearDecayAtom's config and renders
 * the individual nucleons with proper z-layering.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import optionize from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import ParticleAtomNode, { ParticleAtomNodeOptions } from '../../../shred/js/view/ParticleAtomNode.js';
import ParticleView from '../../../shred/js/view/ParticleView.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import createParticleAtomFromConfig from './createParticleAtomFromConfig.js';

type SelfOptions = {
  showElectronCloud?: boolean;
};

export type NuclearDecayAtomNodeOptions = SelfOptions & ParticleAtomNodeOptions;

export default class NuclearDecayAtomNode extends ParticleAtomNode {
  public constructor(
    decayingAtom: NuclearDecayAtom,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: NuclearDecayAtomNodeOptions ) {
    const options = optionize<NuclearDecayAtomNodeOptions, SelfOptions, ParticleAtomNodeOptions>()( {
      showElectronCloud: false,
      visible: decayingAtom.isActive
    }, providedOptions );

    // Create a ParticleAtom populated with the correct number of protons and neutrons.
    const { particleAtom, particles } = createParticleAtomFromConfig( decayingAtom.atomConfigBeforeDecay );

    // Create the ParticleAtomNode to render the nucleus.
    super( particleAtom, new Vector2( 0, 0 ), options );

    // Create a ParticleView for each particle and add it to the correct nucleon layer.
    particles.forEach( ( particle, number ) => {
      const particleView = new ParticleView( particle, this.modelViewTransformProperty.value, {
        inputEnabled: false
      } );
      this.addParticleView( particle, particleView );
    } );

    const originalAtomWidth = this.width;
    modelViewTransformProperty.link( mvt => {
      const desiredAtomWidth = mvt.modelToViewDeltaX( 2 * NuclearDecayCommonConstants.ATOM_RADIUS );
      this.setScaleMagnitude( desiredAtomWidth / originalAtomWidth );
      this.center = mvt.modelToViewPosition( decayingAtom.position );
    } );

  }

  public setPosition( position: Vector2 ): void {
    this.center = this.modelViewTransformProperty.value.modelToViewPosition( position );
  }

}
