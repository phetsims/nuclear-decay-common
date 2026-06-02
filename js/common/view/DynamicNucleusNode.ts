// Copyright 2026, University of Colorado Boulder

/**
 * DynamicNucleusNode portrays an atomic nucleus made of protons and neutrons, potentially clustering together as alpha
 * particles, and moving around within the nucleus.  The nucleons portrayed in this view do not track model elements.
 * In other words, the dynamic behavior is a view-specific features of this Node.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import ShredColors from '../../../../shred/js/ShredColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import AtomLabelNode from './AtomLabelNode.js';

type SelfOptions = {

  // The radius to use for nucleons, in screen coordinates.
  nucleonRadius?: number;

  // If provided, nucleons will escape the nucleus when they reach this radius, in screen coordinates.
  escapeRadiusProperty?: TReadOnlyProperty<number> | null;
};
type DynamicNucleusNodeOptions = SelfOptions & NodeOptions;

// The frequency at which position updates occur for the constituent particles.
const UPDATE_FREQUENCY = 10; // in updates per second

// This constant defines the number of update cycles that are required for all individual particles (protons, neutrons,
// alpha) to have their positions updated. It's used to stagger which ones are updated during each cycle.  Adjust this
// in conjunction with the update period to get the desired level of dynamicism. Values should be greater than zero, and
// significantly less than the minimum expected number of particles.
const CYCLES_FOR_FULL_UPDATE = 3;

// Label is positioned this many nucleon radii above the nucleus center.
const LABEL_OFFSET_IN_NUCLEON_RADII = 10;

class DynamicNucleusNode extends Node {

  // The overall radius of the nucleus, in screen coordinates.  The nucleons will move around within this radius.
  // The value assigned here is arbitrary, it will be updated during initialization and potentially whenever the atom's
  // decay state changes.
  private nucleusRadius = 0;

  // The radius of the individual nucleons that comprise the nucleus.  All nucleons are depicted as spheres with this
  // radius.
  private readonly nucleonRadius: number;

  // The model atom that this Node depicts and uses for particle configuration data.
  private readonly atom: NuclearDecayAtom;

  // Transform used to map the atom model position into view coordinates.
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;

  // Separate particle collections are stored as fields so member methods can manipulate them directly.
  private readonly protonNodes: ShadedSphereNode[] = [];
  private readonly neutronNodes: ShadedSphereNode[] = [];
  private readonly alphaParticleNodes: Node[] = [];

  // If non-null, the radius to which alpha particles should move.  Should generally be bigger than the calculated
  // nucleus radius.
  private readonly escapeRadiusProperty: TReadOnlyProperty<number> | null;

  // Accumulates the scaled time between particle updates.
  private timeAccumulator = 0;

  // Used to detect when the atom decays so the nucleus can be rebuilt.
  private atomHasDecayed: boolean;

  // Variable used to stagger position updates for particles.
  private nucleonUpdateStartIndex = 0;
  private alphaParticleUpdateStartIndex = 0;

  private readonly atomLabelNode: AtomLabelNode;

  public constructor(
    atom: NuclearDecayAtom,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    isModelPlayingProperty: TReadOnlyProperty<boolean>,
    providedOptions?: DynamicNucleusNodeOptions
  ) {

    const options = optionize<DynamicNucleusNodeOptions, SelfOptions, NodeOptions>()( {
      nucleonRadius: 5,
      escapeRadiusProperty: null
    }, providedOptions );

    super( options );

    this.atom = atom;
    this.modelViewTransformProperty = modelViewTransformProperty;
    this.nucleonRadius = options.nucleonRadius;
    this.escapeRadiusProperty = options.escapeRadiusProperty;
    this.atomHasDecayed = atom.hasDecayed;

    this.atomLabelNode = new AtomLabelNode( atom, {
      centerX: 0,
      bottom: -LABEL_OFFSET_IN_NUCLEON_RADII * this.nucleonRadius
    } );
    this.addChild( this.atomLabelNode );

    this.modelViewTransformProperty.link( () => this.updatePosition() );

    // Set up the initial batch of nucleon nodes.
    this.updateNucleons();

    // Add a listener to the atom's step emitter that implements the dynamic motion of the particles in the nucleus.
    atom.steppedEmitter.addListener( dt => {
      if ( !isModelPlayingProperty.value ) {

        // Force an update to the particle positions on every step when the model is paused so that its appearance will
        // change whenever the "step forward" button is pressed.
        this.timeAccumulator = 1 / UPDATE_FREQUENCY;
      }

      this.step( dt );
    } );
  }

  public update(): void {
    this.updatePosition();
  }

  /**
   * Update this node's position from atom model coordinates.
   */
  private updatePosition(): void {
    this.translation = this.modelViewTransformProperty.value.modelToViewPosition( this.atom.position );
  }

  /**
   * Advance the dynamic particle motion using real-time dt. The atom model emits a scaled dt, so rescale it here
   * back to real time using the same speed constant that the model uses to slow time on the graph.
   */
  public step( dt: number ): void {

    // Scale the dt back to real time using the same speed constant that the model uses to slow time on the graph, so
    // that we can use "real" time values for the constants in this file.
    const realDt = dt / NuclearDecayCommonConstants.NORMAL_SPEED_SCALE;

    // Check whether the atom's decay state has changed and update the nucleon nodes if so.
    if ( this.atomHasDecayed !== this.atom.hasDecayed ) {
      this.updateNucleons();
      this.atomHasDecayed = this.atom.hasDecayed;
    }

    // Move the particles around if enough time has passed since the last position update.
    this.timeAccumulator += realDt;
    if ( this.timeAccumulator > 1 / UPDATE_FREQUENCY ) {
      this.updateParticlePositions();
      this.timeAccumulator = 0;
    }
  }

  /**
   * Updates a staggered subset of particle positions and then adjusts their layering so inner particles are more
   * likely to appear in front.
   */
  private updateParticlePositions(): void {

    // Update nucleon and alpha particle positions, but stagger which ones are updated each cycle to create an effect
    // that appears dynamic but not too jumpy.
    const nucleons = [ ...this.protonNodes, ...this.neutronNodes ];
    for ( let i = this.nucleonUpdateStartIndex; i < nucleons.length; i += CYCLES_FOR_FULL_UPDATE ) {
      nucleons[ i ].center = this.getRandomNucleonOffsetVector();
    }
    this.nucleonUpdateStartIndex = ( this.nucleonUpdateStartIndex + 1 ) % CYCLES_FOR_FULL_UPDATE;
    for ( let i = this.alphaParticleUpdateStartIndex; i < this.alphaParticleNodes.length; i += CYCLES_FOR_FULL_UPDATE ) {
      this.alphaParticleNodes[ i ].center = this.getRandomAlphaParticleOffsetVector();
    }
    this.alphaParticleUpdateStartIndex = ( this.alphaParticleUpdateStartIndex + 1 ) % CYCLES_FOR_FULL_UPDATE;

    // Adjust the layering to make the nodes nearer the center higher in the Z-order. This makes the nucleus look
    // a bit more spherical.
    const allParticleNodes = [ ...this.protonNodes, ...this.neutronNodes, ...this.alphaParticleNodes ];
    allParticleNodes.forEach( node => {

      // Use probability and some empirical math to make the inner particles more likely to appear in front of the
      // outer particles.  This gives the nucleus a somewhat more spherical look.
      const normalizedDistance = node.center.magnitude / this.nucleusRadius;
      if ( Math.pow( normalizedDistance, 0.4 ) > dotRandom.nextDouble() ) {
        node.moveToBack();
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

    // Calculate the radius of the nucleus based on the number of nucleons.
    this.nucleusRadius = calculateNucleusRadius( totalNucleonCount, this.nucleonRadius );

    const {
      individualProtonCount,
      individualNeutronCount,
      alphaParticleCount
    } = DynamicNucleusNode.getDisplayedParticleCounts( protonCount, neutronCount );

    _.times( individualProtonCount, () => {
      const protonNode = DynamicNucleusNode.createProtonNode( this.nucleonRadius );
      this.protonNodes.push( protonNode );
    } );

    _.times( individualNeutronCount, () => {
      const neutronNode = DynamicNucleusNode.createNeutronNode( this.nucleonRadius );
      this.neutronNodes.push( neutronNode );
    } );

    _.times( alphaParticleCount, () => {
      const alphaParticleNode = DynamicNucleusNode.createAlphaParticle(
        this.nucleonRadius,
        dotRandom.nextDouble() * 2 * Math.PI
      );
      this.alphaParticleNodes.push( alphaParticleNode );
    } );

    const shuffledNucleonNodes = [ ...this.protonNodes, ...this.neutronNodes ];
    shuffledNucleonNodes.forEach( nucleonNode => this.addChild( nucleonNode ) );
    this.alphaParticleNodes.forEach( alphaParticleNode => this.addChild( alphaParticleNode ) );

    [ ...this.protonNodes, ...this.neutronNodes ].forEach( node => {
      node.center = this.getRandomNucleonOffsetVector();
    } );
    this.alphaParticleNodes.forEach( node => {
      node.center = this.getRandomAlphaParticleOffsetVector();
    } );

    this.atomLabelNode.moveToFront();
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
    const length = ( dotRandom.nextDouble() - 0.5 ) * this.nucleusRadius * 1.5;
    return new Vector2( length, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
  }

  private getRandomAlphaParticleOffsetVector(): Vector2 {
    let maxLength;
    if ( !this.atom.hasDecayed && this.escapeRadiusProperty ) {

      // An escape radius was provided during construction. We don't want to use this value every time for the max
      // length because it can look too chaotic, so use it for a subset. Adjust the threshold here as needed to get the
      // desired effect.
      maxLength = dotRandom.nextDouble() > 0.95 ?
                  this.escapeRadiusProperty.value - this.nucleonRadius * 2 :
                  this.nucleusRadius;
    }
    else {

      // No escape radius was provided, use the nucleus radius to control alpha particle movement.
      maxLength = this.nucleusRadius;
    }
    const length = dotRandom.nextDouble() * maxLength;
    return new Vector2( length, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
  }

  private static createProtonNode( nucleonRadius: number ): ShadedSphereNode {
    return new ShadedSphereNode( 2 * nucleonRadius, {
      mainColor: ShredColors.protonColorProperty
    } );
  }

  private static createNeutronNode( nucleonRadius: number ): ShadedSphereNode {
    return new ShadedSphereNode( 2 * nucleonRadius, {
      mainColor: ShredColors.neutronColorProperty
    } );
  }

  private static createAlphaParticle( nucleonRadius: number, rotationalAngle: number ): Node {
    affirm( rotationalAngle >= 0 && rotationalAngle <= Math.PI * 2, 'out of range rotation angle' );
    const p1 = DynamicNucleusNode.createProtonNode( nucleonRadius );
    const p2 = DynamicNucleusNode.createProtonNode( nucleonRadius );
    const n1 = DynamicNucleusNode.createNeutronNode( nucleonRadius );
    const n2 = DynamicNucleusNode.createNeutronNode( nucleonRadius );
    const nucleonPositioningVector = new Vector2( -nucleonRadius, 0 ).rotated( rotationalAngle );
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
 * Helper function to calculate the radius of the nucleus given the number of nucleons and their radius.  The
 * calculation is based on sphere packing approximations, with the multiplier empirically tweaked to produce visually
 * appealing results. Adjust as needed.
 */
const calculateNucleusRadius = ( numberOfNucleons: number, nucleonRadius: number ): number => {
  return nucleonRadius * Math.pow( numberOfNucleons / 0.6, 1 / 3 );
};

export default DynamicNucleusNode;