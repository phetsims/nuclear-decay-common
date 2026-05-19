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
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';

type SelfOptions = {

  // The radius to use for nucleons, in screen coordinates.
  nucleonRadius?: number;
};
type DynamicNucleusNodeOptions = SelfOptions & NodeOptions;

class DynamicNucleusNode extends Node {

  private nucleonNodes: Node[] = [];

  public constructor(
    atom: NuclearDecayAtom,
    // JPB REVIEW: Why is this a Property?
    modelViewTransform: TReadOnlyProperty<ModelViewTransform2>,
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
    if ( totalNucleonCount < 4 ) {

      // Show them all for smaller numbers.
      numberOfNucleonsToDisplay = totalNucleonCount;
    }
    else {

      // For larger numbers, show a subset. This value is determined in part by the equations for tightly packed
      // particles in a spherical volume, but are empirically tweaked.
      numberOfNucleonsToDisplay = Math.ceil( 4.8 * Math.pow( totalNucleonCount, 2 / 3 ) );
    }

    super( options );

    const center = modelViewTransform.value.modelToViewPosition( atom.position );

    // Add the nucleon nodes.
    _.times( numberOfNucleonsToDisplay, () => {
      const nucleusCircle = new Circle( options.nucleonRadius, {
        fill: Color.GREEN.colorUtilsBrighter( 0.5 ),
        stroke: Color.GREEN.colorUtilsDarker( 0.5 ),
        center: center.plus( this.getRandomNucleonOffsetVector() )
      } );
      this.addChild( nucleusCircle );
      this.nucleonNodes.push( nucleusCircle );
    } );

    // Add a listener to the step timer that implements the dynamic motion of the particles in the nucleus.
    let timeAccumulator = 0;
    stepTimer.addListener( dt => {
      if ( this.isVisible() && isPlayingProperty.value ) {
        timeAccumulator += dt;
        if ( timeAccumulator > 0.1 ) {
          timeAccumulator = 0;
          this.nucleonNodes.forEach( node => {
            const offsetVector = this.getRandomNucleonOffsetVector();
            node.center = center.plus( offsetVector );
          } );
        }
      }
    } );
  }

  // JPB REVIEW: Static?  Or use a config option?
  private getRandomNucleonOffsetVector(): Vector2 {
    const length = ( dotRandom.nextDouble() - 0.5 ) * 20;
    return new Vector2( length, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
  }

}

export default DynamicNucleusNode;