// Copyright 2026, University of Colorado Boulder

/**
 * VibratingDecayingAtomNode is a representation of an atomic nucleus that depicts individual protons and neutrons,
 * vibrates (i.e. jumps around a little big) before it decays and then is still after, and reconfigures the nucleus when
 * decay occurs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import ShredColors from '../../../../shred/js/ShredColors.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import AtomLabelNode from './AtomLabelNode.js';

type SelfOptions = EmptySelfOptions;
export type VibratingDecayingAtomNodeOptions = SelfOptions & NodeOptions;

// Constant for the radius of individual nucleons, in screen coordinates (unitless).
const NUCLEON_RADIUS = 1.5;

// Period between vibration updates for undecayed nuclei, in seconds.
const VIBRATION_UPDATE_PERIOD = 0.032;

// Maximum offset for vibration, in screen coordinates.
const MAX_VIBRATION_OFFSET = 4;

const ELECTRON_CLOUD_RADIUS = NUCLEON_RADIUS * 10;
const ELECTRON_CLOUD_GRADIENT = new RadialGradient( 0, 0, 0, 0, 0, ELECTRON_CLOUD_RADIUS )
  .addColorStop( 0, 'rgba( 0, 0, 255, 0.5 )' )
  .addColorStop( 1, 'rgba( 0, 0, 255, 0.05 )' );

export default class VibratingDecayingAtomNode extends Node {

  // Used to detect when the atom decays so the nucleus can be rebuilt.
  private atomHasDecayed: boolean;

  // View-only offset used to create a vibration effect for the nucleus before it decays.
  private viewOffset: Vector2 = Vector2.ZERO;

  // Accumulates time between vibration updates. Initialized to a random value to desynchronize multiple nuclei.
  private vibrationTimeAccumulator = dotRandom.nextDouble() * VIBRATION_UPDATE_PERIOD;

  // The node that represents the atom's nucleus, which is updated as the atom decays.
  private readonly nucleusNode: Node;

  // node that represents the electron cloud, which may or may not be visible based on settings
  private readonly electronCloudNode: Node;

  // label of the atom
  private readonly atomLabelNode: AtomLabelNode;

  public constructor(
    private readonly decayingAtom: NuclearDecayAtom,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    private readonly electronCloudVisibleProperty: TReadOnlyProperty<boolean>,
    providedOptions?: VibratingDecayingAtomNodeOptions
  ) {

    const options = optionize<VibratingDecayingAtomNodeOptions, SelfOptions, VibratingDecayingAtomNodeOptions>()( {
      visible: decayingAtom.isActive
    }, providedOptions );

    super( options );

    this.atomHasDecayed = decayingAtom.hasDecayed;
    this.nucleusNode = new Node( { children: [ this.createNucleusNode() ] } );
    this.addChild( this.nucleusNode );

    this.electronCloudNode = new Circle( ELECTRON_CLOUD_RADIUS, {
      fill: ELECTRON_CLOUD_GRADIENT,
      visibleProperty: electronCloudVisibleProperty
    } );
    this.addChild( this.electronCloudNode );
    this.electronCloudNode.moveToBack();

    this.atomLabelNode = new AtomLabelNode( decayingAtom, {
      centerX: this.electronCloudNode.centerX,
      bottom: this.electronCloudNode.top
    } );
    this.addChild( this.atomLabelNode );

    decayingAtom.steppedEmitter.addListener( dt => {

      if ( !this.decayingAtom.hasDecayed ) {

        // Atom has not yet decayed, so accumulate time for vibration updates.
        this.vibrationTimeAccumulator += dt;

        // Check if it's time to update the vibration offset.
        if ( this.vibrationTimeAccumulator >= VIBRATION_UPDATE_PERIOD ) {

          if ( this.viewOffset.equals( Vector2.ZERO ) ) {

            // Currently at center, so jump away to a random offset.
            const randomAngle = dotRandom.nextDouble() * 2 * Math.PI;
            const randomLength = dotRandom.nextDouble() * MAX_VIBRATION_OFFSET;
            this.viewOffset = Vector2.createPolar( randomLength, randomAngle );
          }
          else {

            // Currently away from center, so jump back to center.
            this.viewOffset = Vector2.ZERO;
          }


          // Reset the accumulator.
          this.vibrationTimeAccumulator = 0;

          // Update the position with the new offset.
          this.updatePosition();
        }
      }
      else {

        // Atom has decayed, so set the offset to zero and update position.
        if ( !this.viewOffset.equals( Vector2.ZERO ) ) {
          this.viewOffset = Vector2.ZERO;
          this.updatePosition();
        }
      }
    } );
  }

  /**
   * Update the position of this node taking into account the offset used to create the vibration effect.
   */
  private updatePosition(): void {
    const viewPosition = this.modelViewTransformProperty.value.modelToViewPosition( this.decayingAtom.position );
    this.center = viewPosition.plus( this.viewOffset );
  }

  // TODO: See https://github.com/phetsims/alpha-decay/issues/10. I (jbphet) think we should update the whole thing
  //       from the step emitter instead of here and in the step emitter listener.
  /**
   * Update the node based on the current state of the atom. Only recreates the nucleus visualization when the decay
   * state has changed. Otherwise, just updates position and visibility.
   */
  public update(): void {

    // Check if the atom's decay state has changed.
    if ( this.atomHasDecayed !== this.decayingAtom.hasDecayed ) {

      // Decay state changed, so rebuild the nucleus node.
      this.nucleusNode.removeAllChildren();
      this.nucleusNode.addChild( this.createNucleusNode() );
      this.atomHasDecayed = this.decayingAtom.hasDecayed;
    }

    // Always update position and visibility.
    this.updatePosition();
    this.visible = this.decayingAtom.isActive;
  }

  /**
   * Creates a visual representation of the nucleus with individual protons and neutrons arranged to look like a
   * spherical atomic nucleus.
   */
  private createNucleusNode(): Node {
    const parentNode = new Node();

    const protonCount = this.decayingAtom.atomConfigBeforeDecay.protonCount;
    const neutronCount = this.decayingAtom.atomConfigBeforeDecay.neutronCount;
    const totalNucleonCount = protonCount + neutronCount;

    // Calculate the radius of the nucleus based on the number of nucleons.
    const nucleusRadius = this.calculateNucleusRadius( totalNucleonCount );

    // Determine how many of each type of nucleon to display.
    const {
      individualProtonCount,
      individualNeutronCount
    } = this.getDisplayedParticleCounts( protonCount, neutronCount );

    // Create and position proton nodes.
    _.times( individualProtonCount, () => {
      const protonNode = this.createProtonNode();
      protonNode.center = this.getRandomNucleonOffsetVector( nucleusRadius );
      parentNode.addChild( protonNode );
    } );

    // Create and position neutron nodes.
    _.times( individualNeutronCount, () => {
      const neutronNode = this.createNeutronNode();
      neutronNode.center = this.getRandomNucleonOffsetVector( nucleusRadius );
      parentNode.addChild( neutronNode );
    } );

    // Adjust the layering to make nodes nearer the center higher in the Z-order. This makes the nucleus look
    // more spherical.
    parentNode.children.forEach( node => {
      const normalizedDistance = node.center.magnitude / nucleusRadius;

      // Use probability and some empirical math to make the inner particles more likely to appear in front of the
      // outer particles. This gives the nucleus a somewhat more spherical look.
      if ( Math.pow( normalizedDistance, 0.4 ) > dotRandom.nextDouble() ) {
        node.moveToBack();
      }
    } );

    // Return the created node, and make it an image so that it is one node, which improves rendering performance.
    return rasterizeNode( parentNode );
  }

  /**
   * Determine how many individual protons and neutrons to render based on the actual counts.
   */
  private getDisplayedParticleCounts( protonCount: number, neutronCount: number ): {
    individualProtonCount: number;
    individualNeutronCount: number;
  } {
    const totalNucleonCount = protonCount + neutronCount;
    if ( totalNucleonCount === 0 ) {
      return {
        individualProtonCount: 0,
        individualNeutronCount: 0
      };
    }

    // For small nuclei, show all nucleons. For larger ones, calculate a representative subset.
    const numberOfNucleonsToDisplay = totalNucleonCount < 5 ?
                                      totalNucleonCount :
                                      Math.ceil( 4.8 * Math.pow( totalNucleonCount, 2 / 3 ) );

    const displayedProtonCount = roundSymmetric( numberOfNucleonsToDisplay * protonCount / totalNucleonCount );
    const displayedNeutronCount = numberOfNucleonsToDisplay - displayedProtonCount;

    return {
      individualProtonCount: displayedProtonCount,
      individualNeutronCount: displayedNeutronCount
    };
  }

  /**
   * Calculate the radius of the nucleus given the number of nucleons. The calculation is based on sphere packing
   * approximations, with the multiplier empirically tweaked to produce visually appealing results.
   */
  private calculateNucleusRadius( numberOfNucleons: number ): number {
    return NUCLEON_RADIUS * Math.pow( numberOfNucleons / 0.6, 1 / 3 );
  }

  /**
   * Get a random offset from the center of the nucleus for a nucleon.
   */
  private getRandomNucleonOffsetVector( nucleusRadius: number ): Vector2 {
    const length = ( dotRandom.nextDouble() - 0.5 ) * nucleusRadius * 1.5;
    return new Vector2( length, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
  }

  /**
   * Create a visual representation of a proton.
   */
  private createProtonNode(): ShadedSphereNode {
    return new ShadedSphereNode( 2 * NUCLEON_RADIUS, {
      mainColor: ShredColors.protonColorProperty
    } );
  }

  /**
   * Create a visual representation of a neutron.
   */
  private createNeutronNode(): ShadedSphereNode {
    return new ShadedSphereNode( 2 * NUCLEON_RADIUS, {
      mainColor: ShredColors.neutronColorProperty
    } );
  }
}

