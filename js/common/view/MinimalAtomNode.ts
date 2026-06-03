// Copyright 2026, University of Colorado Boulder

/**
 * MinimalAtomNode is the minimal representation of an atom, for simplicity to avoid rendering many atoms and their
 * nucleons.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle, { CircleOptions } from '../../../../scenery/js/nodes/Circle.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import Updatable from '../model/Updatable.js';

type SelfOptions = {
  showElectronCloud?: boolean;
};

export type MinimalAtomNodeOptions = SelfOptions & CircleOptions;

export default class MinimalAtomNode extends Circle implements Updatable {
  public constructor(
    private readonly decayingAtom: NuclearDecayAtom,
    private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    providedOptions?: MinimalAtomNodeOptions ) {
    const options = optionize<MinimalAtomNodeOptions, SelfOptions, MinimalAtomNodeOptions>()( {
      showElectronCloud: false,
      visible: decayingAtom.isActive,
      fill: NuclearDecayCommonColors.undecayedProperty
    }, providedOptions );

    super( modelViewTransformProperty.value.modelToViewDeltaX( NuclearDecayCommonConstants.ATOM_RADIUS ), options );

    modelViewTransformProperty.link( mvt => {
      const desiredAtomRadius = mvt.modelToViewDeltaX( NuclearDecayCommonConstants.ATOM_RADIUS );
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
    this.fill = this.decayingAtom.hasDecayed ? NuclearDecayCommonColors.decayedProperty : NuclearDecayCommonColors.undecayedProperty;
    this.updatePosition();
  }
}
