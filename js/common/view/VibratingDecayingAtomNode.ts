// Copyright 2026, University of Colorado Boulder

/**
 * VibratingDecayingAtomNode is a representation of an atomic nucleus that depicts individual protons and neutrons,
 * vibrates (i.e. does an animation where it jumps around) before it decays and then is still post decay, and
 * reconfigures the nucleus when decay occurs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import Updatable from '../model/Updatable.js';
import AtomLabelNode from './AtomLabelNode.js';
import NucleusImageNodeFactory from './NucleusImageNodeFactory.js';

type SelfOptions = {

  // Controls label visibility for this atom node; if null, labels are always visible.
  labelsVisibleProperty?: TReadOnlyProperty<boolean> | null;
};
export type VibratingDecayingAtomNodeOptions = SelfOptions & NodeOptions;

// Period between vibration updates for undecayed nuclei, in seconds.
const VIBRATION_UPDATE_PERIOD = ( 1 / 60 ) * 2;

// Maximum offset for vibration, in screen coordinates.
const MAX_VIBRATION_OFFSET = 4;

// Vertical offset (in screen coordinates) used to position the atom label above the nucleus.
const LABEL_BOTTOM_OFFSET = 1;

export default class VibratingDecayingAtomNode extends Node implements Updatable {

  // Used to detect when the atom decays so the nucleus can be rebuilt.
  private atomHasDecayed: boolean;

  // View-only offset used to create a vibration effect for the nucleus before it decays.
  private viewOffset: Vector2 = Vector2.ZERO;

  // Accumulates time between vibration updates. Initialized to a random value to desynchronize multiple nuclei.
  private vibrationTimeAccumulator = dotRandom.nextDouble() * VIBRATION_UPDATE_PERIOD;

  // The node that represents the atom's nucleus, which is updated as the atom decays.
  private nucleusNode: Node;

  // label of the atom
  private readonly atomLabelNode: AtomLabelNode;

  public constructor(
    private readonly decayingAtom: NuclearDecayAtom,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: VibratingDecayingAtomNodeOptions
  ) {

    const options = optionize<VibratingDecayingAtomNodeOptions, SelfOptions, NodeOptions>()( {
      visible: decayingAtom.isActive,
      labelsVisibleProperty: null
    }, providedOptions );

    super( options );

    this.atomHasDecayed = decayingAtom.hasDecayed;
    this.nucleusNode = this.createNucleusNode();
    this.addChild( this.nucleusNode );

    const labelsVisibleProperty = options.labelsVisibleProperty ?? new Property( true );
    this.atomLabelNode = new AtomLabelNode( decayingAtom, {
      visibleProperty: labelsVisibleProperty
    } );
    this.addChild( this.atomLabelNode );

    // Handle the positioning of the label above the nucleus.
    this.atomLabelNode.localBoundsProperty.link( () => {
      this.atomLabelNode.centerX = this.nucleusNode.centerX;
      this.atomLabelNode.bottom = this.nucleusNode.top - LABEL_BOTTOM_OFFSET;
    } );

    decayingAtom.steppedEmitter.addListener( dt => {

      this.atomLabelNode.update();

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

          // Reset the vibration time accumulator.
          this.vibrationTimeAccumulator = 0;
        }
      }
      else {

        // Atom has decayed, so set the offset to zero and update position.
        if ( !this.viewOffset.equals( Vector2.ZERO ) ) {
          this.viewOffset = Vector2.ZERO;
        }
      }

      this.update();
    } );
  }

  /**
   * Update the position of this node taking into account the offset used to create the vibration effect.
   */
  private updatePosition(): void {
    const viewPosition = this.modelViewTransformProperty.value.modelToViewPosition( this.decayingAtom.position );
    this.translation = viewPosition.plus( this.viewOffset );
  }

  /**
   * Update the node based on the current state of the atom. Only recreates the nucleus visualization when the decay
   * state has changed. Otherwise, this just updates position and visibility.
   */
  public update(): void {

    // Check if the atom's decay state has changed since the previous update.
    if ( this.atomHasDecayed !== this.decayingAtom.hasDecayed ) {

      // Decay state changed, so rebuild the nucleus node.
      this.atomHasDecayed = this.decayingAtom.hasDecayed;
      this.removeChild( this.nucleusNode );
      this.nucleusNode = this.createNucleusNode();
      this.addChild( this.nucleusNode );
    }

    // Always update position and visibility.
    this.visible = this.decayingAtom.isActive;
    this.updatePosition();
    this.atomLabelNode.update();
  }

  /**
   * Create a rasterized image of the atom's nucleus for its current decay state. The individual nucleon nodes are
   * cached and reused by the shared factory rather than being recreated on each request.
   */
  private createNucleusNode(): Node {
    const atomConfig = this.decayingAtom.hasDecayed ?
                       this.decayingAtom.atomConfigAfterDecay :
                       this.decayingAtom.atomConfigBeforeDecay;
    return NucleusImageNodeFactory.createNucleusImageNode( atomConfig );
  }
}
