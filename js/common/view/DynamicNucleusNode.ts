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

  private readonly nucleusDiameter: number;

  public constructor(
    atom: NuclearDecayAtom,
    isPlayingProperty: TReadOnlyProperty<boolean>,
    providedOptions?: DynamicNucleusNodeOptions
  ) {

    const options = optionize<DynamicNucleusNodeOptions, SelfOptions, NodeOptions>()( {
      nucleonRadius: 5
    }, providedOptions );

    // Decide how many nucleons to display based on the number within the supplied atom. Note that for larger numbers of
    // nucleons, a smaller proportion of them will be shown since many will be behind other nucleons.
    let numberOfNucleonsToDisplay;
    // JPB REVIEW - this will need to be dynamically updated based on decay state.
    const totalNucleonCount = atom.atomConfigBeforeDecay.protonCount + atom.atomConfigAfterDecay.neutronCount;
    if ( totalNucleonCount < 5 ) {

      // Show them all for smaller numbers.
      numberOfNucleonsToDisplay = totalNucleonCount;
    }
    else {

      // For larger numbers, show a subset. This value is determined in part by the equation for tightly packed
      // particles in a spherical volume, with the multiplier empirically tweaked.
      numberOfNucleonsToDisplay = Math.ceil( 4.8 * Math.pow( totalNucleonCount, 2 / 3 ) );
    }

    // the nodes used to represent the individual nucleons
    const nucleonNodes: ShadedSphereNode[] = [];

    const alphaParticleNodes: Node[] = [];

    super( options );

    // Calculate the diameter of the nucleus based on the number of nucleons.
    this.nucleusDiameter = calculateNucleusDiameter( totalNucleonCount, 2 * options.nucleonRadius );

    // Add the nucleon nodes.
    _.times( numberOfNucleonsToDisplay, count => {
      const nucleonNode = count < atom.atomConfigBeforeDecay.protonCount ?
                          DynamicNucleusNode.createProtonNode( 2 * options.nucleonRadius ) :
                          DynamicNucleusNode.createNeutronNode( 2 * options.nucleonRadius );
      nucleonNodes.push( nucleonNode );
    } );

    _.times( 5, () => {
      const alphaParticleNode = DynamicNucleusNode.createAlphaParticle(
        2 * options.nucleonRadius,
        dotRandom.nextDouble() * 2 * Math.PI
      );
      alphaParticleNodes.push( alphaParticleNode );
      this.addChild( alphaParticleNode );
    } );

    const shuffledNucleonNodes = dotRandom.shuffle( nucleonNodes );
    shuffledNucleonNodes.forEach( nucleonNode => this.addChild( nucleonNode ) );

    // Add a listener to the step timer that implements the dynamic motion of the particles in the nucleus.
    let timeAccumulator = 0;
    stepTimer.addListener( dt => {

      // Only do the work for this if the nucleus is current visible and playing.
      if ( this.isVisible() && isPlayingProperty.value ) {
        timeAccumulator += dt;
        if ( timeAccumulator > 0.1 ) {
          timeAccumulator = 0;
          nucleonNodes.forEach( node => {
            node.center = this.getRandomNucleonOffsetVector();
          } );
          alphaParticleNodes.forEach( node => {
            node.center = this.getRandomAlphaParticleOffsetVector();
          } );
        }
      }
    } );
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

  private static createAlphaParticle( nucleonDiameter: number, rotationalAngle: number ) : Node {
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