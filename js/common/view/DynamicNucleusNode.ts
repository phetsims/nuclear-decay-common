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
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import ShredColors from '../../../../shred/js/ShredColors.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';

type SelfOptions = {

  // The radius to use for nucleons, in screen coordinates.
  nucleonRadius?: number;
};
type DynamicNucleusNodeOptions = SelfOptions & NodeOptions;

class DynamicNucleusNode extends Node {

  // the nodes used to represent the individual nucleons
  private readonly nucleonNodes: Node[] = [];

  private nucleusDiameter: number;

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
    if ( totalNucleonCount < 5 ) {

      // Show them all for smaller numbers.
      numberOfNucleonsToDisplay = totalNucleonCount;
    }
    else {

      // For larger numbers, show a subset. This value is determined in part by the equation for tightly packed
      // particles in a spherical volume, with the multiplier empirically tweaked.
      numberOfNucleonsToDisplay = Math.ceil( 4.8 * Math.pow( totalNucleonCount, 2 / 3 ) );
    }

    super( options );

    // Calculate the diameter of the nucleus based on the number of nucleons.
    this.nucleusDiameter = calculateNucleusDiameter( totalNucleonCount, 2 * options.nucleonRadius );

    const center = modelViewTransform.value.modelToViewPosition( atom.position );

    // Create the gradients used for proton and neutron fills.
    const neutronFill = DynamicNucleusNode.createNucleonFill( ShredColors.neutronColorProperty, options.nucleonRadius );
    const protonFill = DynamicNucleusNode.createNucleonFill( ShredColors.protonColorProperty, options.nucleonRadius );

    // Add the nucleon nodes.
    _.times( numberOfNucleonsToDisplay, count => {
      const colorProperty = count < atom.atomConfigBeforeDecay.protonCount ? protonFill : neutronFill;

      const nucleusCircle = new Circle( options.nucleonRadius, {
        fill: colorProperty,
        center: center.plus( this.getRandomNucleonOffsetVector() )
      } );
      this.nucleonNodes.push( nucleusCircle );
    } );

    const shuffledNucleonNodes = dotRandom.shuffle( this.nucleonNodes );
    shuffledNucleonNodes.forEach( nucleonNode => this.addChild( nucleonNode ) );

    // Add a listener to the step timer that implements the dynamic motion of the particles in the nucleus.
    let timeAccumulator = 0;
    stepTimer.addListener( dt => {

      // Only do the work for this if the nucleus is current visible and playing.
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

  /**
   * Get a random offset from the center of the nucleus for a nucleon.
   */
  private getRandomNucleonOffsetVector(): Vector2 {
    const length = ( dotRandom.nextDouble() - 0.5 ) * this.nucleusDiameter;
    return new Vector2( length, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
  }

  private static createNucleonFill(
    baseColorProperty: TReadOnlyProperty<Color>,
    nucleonRadius: number
  ): RadialGradient {

    return new RadialGradient(
      -nucleonRadius * 0.4, -nucleonRadius * 0.4, 0,
      -nucleonRadius * 0.4, -nucleonRadius * 0.4, nucleonRadius * 1.6 )
      .addColorStop( 0, 'white' )
      .addColorStop( 1, baseColorProperty.value );
  }

}

const calculateNucleusDiameter = ( numberOfNucleons: number, nucleonDiameter: number ): number => {
  return nucleonDiameter * Math.pow( numberOfNucleons / 0.6, 1 / 3 );
};

export default DynamicNucleusNode;