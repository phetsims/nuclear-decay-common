// Copyright 2026, University of Colorado Boulder

/**
 * DecayingAtomNode is the portrayal of the decaying atom, with its protons and neutrons arranged in a nucleus
 * using ParticleAtomNode from shred. It creates a ParticleAtom from the NuclearDecayAtom's config and renders
 * the individual nucleons with proper z-layering.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import optionize from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import ParticleAtomNode from '../../../shred/js/view/ParticleAtomNode.js';
import ParticleView from '../../../shred/js/view/ParticleView.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import createParticleAtomFromConfig from './createParticleAtomFromConfig.js';

type SelfOptions = {
  showElectronCloud?: boolean;
};

export type DecayingAtomNodeOptions = SelfOptions & NodeOptions;

export default class DecayingAtomNode extends Node {
  public constructor( decayingAtom: NuclearDecayAtom, providedOptions?: DecayingAtomNodeOptions ) {
    const options = optionize<DecayingAtomNodeOptions, SelfOptions, NodeOptions>()( {
      showElectronCloud: false
    }, providedOptions );

    // Create a ParticleAtom populated with the correct number of protons and neutrons.
    const { particleAtom, particles } = createParticleAtomFromConfig( decayingAtom.atomConfigBeforeDecay );

    // Create the ParticleAtomNode to render the nucleus.
    const particleAtomNode = new ParticleAtomNode( particleAtom, new Vector2( 0, 0 ), {
      showElectronCloud: options.showElectronCloud
    } );

    // Identity MVT since ParticleAtom and the view share the same coordinate frame.
    const modelViewTransform = ModelViewTransform2.createIdentity();

    // Create a ParticleView for each particle and add it to the correct nucleon layer.
    particles.forEach( particle => {
      const particleView = new ParticleView( particle, modelViewTransform, {
        inputEnabled: false
      } );
      particleAtomNode.addParticleView( particle, particleView );
    } );

    options.children = [ particleAtomNode ];

    super( options );

  }
}
