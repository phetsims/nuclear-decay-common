// Copyright 2026, University of Colorado Boulder

/**
 * Utility that creates a ParticleAtom populated with Particle instances from an AtomConfig.
 * This bridges the lightweight NuclearDecayAtom model (config-based) with the full ParticleAtom
 * model needed by ParticleAtomNode for proper atom visualization.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import AtomConfig from '../../../shred/js/model/AtomConfig.js';
import Particle from '../../../shred/js/model/Particle.js';
import ParticleAtom from '../../../shred/js/model/ParticleAtom.js';
import Tandem from '../../../tandem/js/Tandem.js';

type CreateParticleAtomResult = {
  particleAtom: ParticleAtom;
  particles: Particle[];
};

/**
 * Creates a ParticleAtom and populates it with the appropriate number of protons and neutrons
 * based on the provided AtomConfig. The ParticleAtom and all Particles use Tandem.OPT_OUT
 * since this is a view-level adapter not intended for PhET-iO instrumentation.
 */
export default function createParticleAtomFromConfig( atomConfig: AtomConfig ): CreateParticleAtomResult {

  const particleAtom = new ParticleAtom( { tandem: Tandem.OPT_OUT } );
  const particles: Particle[] = [];

  // Create and add protons.
  for ( let i = 0; i < atomConfig.protonCount; i++ ) {
    const proton = new Particle( 'proton', { tandem: Tandem.OPT_OUT } );
    particles.push( proton );
    particleAtom.addParticle( proton );
  }

  // Create and add neutrons.
  for ( let i = 0; i < atomConfig.neutronCount; i++ ) {
    const neutron = new Particle( 'neutron', { tandem: Tandem.OPT_OUT } );
    particles.push( neutron );
    particleAtom.addParticle( neutron );
  }

  // Snap all particles to their destinations immediately (no animation).
  particleAtom.moveAllParticlesToDestination();

  return { particleAtom: particleAtom, particles: particles };
}
