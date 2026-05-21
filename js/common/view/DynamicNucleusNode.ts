// Copyright 2026, University of Colorado Boulder

/**
 * DynamicNucleusNode portrays an atomic nucleus made of protons and neutrons, potentially clustering together as alpha
 * particles, and moving around within the nucleus.  The nucleons portrayed in this view do not track model elements.
 * In other words, the dynamic behavior is a view-specific features of this Node.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepTimer from '../../../../axon/js/stepTimer.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import ShredColors from '../../../../shred/js/ShredColors.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';

type SelfOptions = {

  // The radius to use for nucleons, in screen coordinates.
  nucleonRadius?: number;
};
type DynamicNucleusNodeOptions = SelfOptions & NodeOptions;

class DynamicNucleusNode extends Node {

  // The overall diameter of the nucleus, in screen coordinates.  The nucleons will move around within this diameter.
  // The value assigned here is arbitrary, it will be updated during initialization and potentially whenever the atom's
  // decay state changes.
  private nucleusDiameter = 0;

  // The diameter of the individual nucleons that comprise the nucleus.  All nucleons are depicted as spheres with this
  // diameter.
  private readonly nucleonDiameter: number;

  // The model atom that this Node depicts and uses for particle configuration data.
  private readonly atom: NuclearDecayAtom;

  // Separate particle collections are stored as fields so member methods can manipulate them directly.
  private readonly protonNodes: ShadedSphereNode[] = [];
  private readonly neutronNodes: ShadedSphereNode[] = [];
  private readonly alphaParticleNodes: Node[] = [];

  public constructor(
    atom: NuclearDecayAtom,
    isPlayingProperty: TReadOnlyProperty<boolean>,
    providedOptions?: DynamicNucleusNodeOptions
  ) {

    const options = optionize<DynamicNucleusNodeOptions, SelfOptions, NodeOptions>()( {
      nucleonRadius: 5
    }, providedOptions );

    super( options );

    this.atom = atom;
    this.nucleonDiameter = 2 * options.nucleonRadius;

    // Set up the initial batch of nucleon nodes.  These may change if the atom decays.
    this.updateNucleons();

    // Add a listener to the step timer that implements the dynamic motion of the particles in the nucleus.
    let timeAccumulator = 0;
    let atomHasDecayed = atom.hasDecayed;
    stepTimer.addListener( dt => {

      // Only do the work for this if the nucleus is current visible and playing.
      if ( this.isVisible() && isPlayingProperty.value ) {

        // Check whether the atom's decay state has changed and update the nucleon nodes if so.
        if ( atomHasDecayed !== atom.hasDecayed ) {
          this.updateNucleons();
          atomHasDecayed = atom.hasDecayed;
        }

        // Move the particles around if enough time has passed since the last position update.
        timeAccumulator += dt;
        if ( timeAccumulator > 0.1 ) {
          timeAccumulator = 0;
          [ ...this.protonNodes, ...this.neutronNodes ].forEach( node => {
            node.center = this.getRandomNucleonOffsetVector();
          } );
          this.alphaParticleNodes.forEach( node => {
            node.center = this.getRandomAlphaParticleOffsetVector();
          } );

          // Adjust the layering to make the nodes nearer the center higher in the Z-order. This makes the nucleus look
          // a bit more spherical.
          const allParticleNodes = [ ...this.protonNodes, ...this.neutronNodes, ...this.alphaParticleNodes ];
          allParticleNodes.forEach( node => {

            // Use probability and some empirical math to make the inner particles more likely to appear in front of the
            // outer particles.  This gives the nucleus and somewhat more spherical look.
            const normalizedDistance = node.center.magnitude / ( this.nucleusDiameter / 2 );
            if ( Math.pow( normalizedDistance, 0.4 ) > dotRandom.nextDouble() ) {
              node.moveToBack();
            }
          } );
        }
      }
    } );
  }

  /**
   * Rebuild all proton, neutron, and alpha nodes.
   */
  private updateNucleons(): void {

    // Remove existing nodes.
    [ ...this.protonNodes, ...this.neutronNodes, ...this.alphaParticleNodes ].forEach( node => {
      this.removeChild( node );
    } );
    this.protonNodes.length = 0;
    this.neutronNodes.length = 0;
    this.alphaParticleNodes.length = 0;

    const protonCount = this.atom.atomConfigBeforeDecay.protonCount;
    const neutronCount = this.atom.atomConfigBeforeDecay.neutronCount;
    const totalNucleonCount = protonCount + neutronCount;

    // Calculate the diameter of the nucleus based on the number of nucleons.
    this.nucleusDiameter = calculateNucleusDiameter( totalNucleonCount, this.nucleonDiameter );

    const {
      individualProtonCount,
      individualNeutronCount,
      alphaParticleCount
    } = DynamicNucleusNode.getDisplayedParticleCounts( protonCount, neutronCount );

    _.times( individualProtonCount, () => {
      const protonNode = DynamicNucleusNode.createProtonNode( this.nucleonDiameter );
      this.protonNodes.push( protonNode );
    } );

    _.times( individualNeutronCount, () => {
      const neutronNode = DynamicNucleusNode.createNeutronNode( this.nucleonDiameter );
      this.neutronNodes.push( neutronNode );
    } );

    _.times( alphaParticleCount, () => {
      const alphaParticleNode = DynamicNucleusNode.createAlphaParticle(
        this.nucleonDiameter,
        dotRandom.nextDouble() * 2 * Math.PI
      );
      this.alphaParticleNodes.push( alphaParticleNode );
    } );

    const shuffledNucleonNodes = dotRandom.shuffle( [ ...this.protonNodes, ...this.neutronNodes ] );
    shuffledNucleonNodes.forEach( nucleonNode => this.addChild( nucleonNode ) );
    this.alphaParticleNodes.forEach( alphaParticleNode => this.addChild( alphaParticleNode ) );

    [ ...this.protonNodes, ...this.neutronNodes ].forEach( node => {
      node.center = this.getRandomNucleonOffsetVector();
    } );
    this.alphaParticleNodes.forEach( node => {
      node.center = this.getRandomAlphaParticleOffsetVector();
    } );
  }

  /**
   * Determine how many individual protons/neutrons and alpha particles to render.
   */
  private static getDisplayedParticleCounts( protonCount: number, neutronCount: number ): {
    individualProtonCount: number;
    individualNeutronCount: number;
    alphaParticleCount: number;
  } {
    const totalNucleonCount = protonCount + neutronCount;
    if ( totalNucleonCount === 0 ) {
      return {
        individualProtonCount: 0,
        individualNeutronCount: 0,
        alphaParticleCount: 0
      };
    }

    const numberOfNucleonsToDisplay = totalNucleonCount < 5 ?
                                      totalNucleonCount :
                                      Math.ceil( 4.8 * Math.pow( totalNucleonCount, 2 / 3 ) );

    const displayedProtonCount = roundSymmetric( numberOfNucleonsToDisplay * protonCount / totalNucleonCount );
    const displayedNeutronCount = numberOfNucleonsToDisplay - displayedProtonCount;

    // About half of the represented nucleons are grouped into alpha particles (4 nucleons each).
    const alphaParticleCount = Math.min(
      Math.floor( numberOfNucleonsToDisplay / 8 ),
      Math.floor( displayedProtonCount / 2 ),
      Math.floor( displayedNeutronCount / 2 )
    );

    return {
      individualProtonCount: displayedProtonCount - 2 * alphaParticleCount,
      individualNeutronCount: displayedNeutronCount - 2 * alphaParticleCount,
      alphaParticleCount: alphaParticleCount
    };
  }

  /**
   * Get a random offset from the center of the nucleus for a nucleon.
   */
  private getRandomNucleonOffsetVector(): Vector2 {
    const length = ( dotRandom.nextDouble() - 0.5 ) * this.nucleusDiameter * 0.75;
    return new Vector2( length, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
  }

  private getRandomAlphaParticleOffsetVector(): Vector2 {
    const length = ( dotRandom.nextDouble() - 0.5 ) * this.nucleusDiameter;
    return new Vector2( length, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
  }

  private static createProtonNode( diameter: number ): ShadedSphereNode {
    return new ShadedSphereNode( diameter, {
      mainColor: ShredColors.protonColorProperty
    } );
  }

  private static createNeutronNode( diameter: number ): ShadedSphereNode {
    return new ShadedSphereNode( diameter, {
      mainColor: ShredColors.neutronColorProperty
    } );
  }

  private static createAlphaParticle( nucleonDiameter: number, rotationalAngle: number ): Node {
    affirm( rotationalAngle >= 0 && rotationalAngle <= Math.PI * 2, 'out of range rotation angle' );
    const p1 = DynamicNucleusNode.createProtonNode( nucleonDiameter );
    const p2 = DynamicNucleusNode.createProtonNode( nucleonDiameter );
    const n1 = DynamicNucleusNode.createNeutronNode( nucleonDiameter );
    const n2 = DynamicNucleusNode.createNeutronNode( nucleonDiameter );
    const nucleonPositioningVector = new Vector2( -nucleonDiameter / 2, 0 ).rotated( rotationalAngle );
    n1.center = nucleonPositioningVector.copy();
    nucleonPositioningVector.rotate( Math.PI );
    n2.center = nucleonPositioningVector.copy();
    nucleonPositioningVector.multiplyScalar( 0.75 ); // multiplier empirically determined
    nucleonPositioningVector.rotate( Math.PI / 2 );
    p1.center = nucleonPositioningVector.copy();
    nucleonPositioningVector.rotate( Math.PI );
    p2.center = nucleonPositioningVector.copy();

    return new Node( { children: [ p2, n1, n2, p1 ] } );
  }
}

/**
 * Helper function to calculate the diameter of the nucleus given the number of nucleons and their diameter.  The
 * calculation is based on sphere packing approximations, with the multiplier empirically tweaked to produce visually
 * appealing results. Adjust as needed.
 */
const calculateNucleusDiameter = ( numberOfNucleons: number, nucleonDiameter: number ): number => {
  return nucleonDiameter * Math.pow( numberOfNucleons / 0.6, 1 / 3 );
};

export default DynamicNucleusNode;