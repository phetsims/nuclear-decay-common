// Copyright 2026, University of Colorado Boulder

/**
 * MinimalAtomNode is the minimal representation of an atom, for simplicity to avoid rendering many atoms and their
 * nucleons.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle, { CircleOptions } from '../../../../scenery/js/nodes/Circle.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayAtom, { ISOTOPE_TO_COLOR } from '../model/NuclearDecayAtom.js';
import Updatable from '../model/Updatable.js';

type SelfOptions = EmptySelfOptions;

export type MinimalAtomNodeOptions = SelfOptions & CircleOptions;

export default class MinimalAtomNode extends Circle implements Updatable {

  public constructor(
    private readonly decayingAtom: NuclearDecayAtom,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: MinimalAtomNodeOptions ) {

    const options = optionize<MinimalAtomNodeOptions, SelfOptions, MinimalAtomNodeOptions>()( {
      visible: decayingAtom.isActive,
      fill: NuclearDecayCommonColors.poloniumColorProperty
    }, providedOptions );

    // Determine the model radius value to use. Because this particular node represents the nucleus as a circle, we use
    // a fixed value for all instances.
    const modelRadius = NuclearDecayCommonConstants.LEAD_NUCLEUS_RADIUS;

    super( modelViewTransformProperty.value.modelToViewDeltaX( modelRadius ), options );

    modelViewTransformProperty.link( mvt => {
      const desiredAtomRadius = mvt.modelToViewDeltaX( modelRadius );
      this.setRadius( desiredAtomRadius );
      this.updatePosition();
    } );

    decayingAtom.steppedEmitter.addListener( () => {
      this.update();
    } );
  }

  private updatePosition(): void {
    this.center = this.modelViewTransformProperty.value.modelToViewPosition( this.decayingAtom.position );
  }

  public update(): void {
    this.visible = this.decayingAtom.isActive;
    this.fill = this.decayingAtom.hasDecayed ?
                NuclearDecayCommonColors.decayedProperty :
                ISOTOPE_TO_COLOR.get( this.decayingAtom.isotope )!;
    this.updatePosition();
  }
}
