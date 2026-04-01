// Copyright 2026, University of Colorado Boulder

/**
 * MinimalAtomNode is the minimal representation of an atom, for simplicity to avoid rendering
 * many atoms and their nucleons.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import optionize from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle, { CircleOptions } from '../../../scenery/js/nodes/Circle.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';

type SelfOptions = {
  showElectronCloud?: boolean;
};

export type MinimalAtomNodeOptions = SelfOptions & CircleOptions;

export default class MinimalAtomNode extends Circle {
  public constructor(
    private readonly decayingAtom: NuclearDecayAtom,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: MinimalAtomNodeOptions ) {
    const options = optionize<MinimalAtomNodeOptions, SelfOptions, MinimalAtomNodeOptions>()( {
      showElectronCloud: false,
      visible: decayingAtom.isActive,

      fill: 'magenta'
    }, providedOptions );

    // Create the ParticleAtomNode to render the nucleus.
    super( 1, options );

    const originalAtomWidth = this.width;
    modelViewTransformProperty.link( mvt => {
      const desiredAtomWidth = mvt.modelToViewDeltaX( 2 * NuclearDecayCommonConstants.ATOM_RADIUS );
      this.setScaleMagnitude( desiredAtomWidth / originalAtomWidth );
      this.center = mvt.modelToViewPosition( decayingAtom.position );
    } );

  }

  public setPosition( position: Vector2 ): void {
    this.center = this.modelViewTransformProperty.value.modelToViewPosition( position );
  }

  public update(): void {
    this.visible = this.decayingAtom.isActive;
    this.fill = this.decayingAtom.hasDecayed ? 'grey' : 'magenta';
  }
}
