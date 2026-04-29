// Copyright 2026, University of Colorado Boulder
/**
 * Common screen view for Nuclear Decay simulations.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import cardPickup_mp3 from '../../../../tambo/sounds/cardPickup_mp3.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import MinimalAtomNode from './MinimalAtomNode.js';

type SelfOptions = {
  // Additional content to add to the isotope panel
  isotopePanelMiddleContent?: Node[] | null;

  // How many atoms will fit visually within the width of the play area
  numberOfAtomsInPlayAreaWidth?: number;
};

export type NuclearDecayScreenViewOptions = SelfOptions & WithRequired<ScreenViewOptions, 'tandem'>;

export default class NuclearDecayScreenView extends ScreenView {

  // The model-view transform used for translating model coordinates into view coordinates. Subclasses can and should
  // set this directly to control the position of the play area.
  protected modelViewTransformProperty: Property<ModelViewTransform2>;

  // How many atoms will fit visually within the width of the play area
  private readonly numberOfAtomsInPlayAreaWidth: number;

  protected atomNodesMap: Map<NuclearDecayAtom, MinimalAtomNode>;

  protected readonly playAreaBoundsProperty: Property<Bounds2>;

  protected readonly playAreaBoundsRectangle: Path;

  public constructor(
    public readonly model: NuclearDecayModel,
    providedOptions?: NuclearDecayScreenViewOptions
  ) {

    const options = optionize<NuclearDecayScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // Self Options
      isotopePanelMiddleContent: null,

      numberOfAtomsInPlayAreaWidth: 10
    }, providedOptions );

    super( options );

    this.numberOfAtomsInPlayAreaWidth = options.numberOfAtomsInPlayAreaWidth;

    // Default to an identity transform.
    this.modelViewTransformProperty = new Property( ModelViewTransform2.createIdentity() );

    // Prepopulating all atom nodes and pairing them with their respective model atoms.
    this.atomNodesMap = new Map<NuclearDecayAtom, MinimalAtomNode>();

    // Single atom screen is in charge of creating its own atom
    if ( !model.isSingleAtomMode ) {

      model.atomPool.forEach( atom => {
        const atomNode = new MinimalAtomNode( atom, this.modelViewTransformProperty );
        this.atomNodesMap.set( atom, atomNode );
        this.addChild( atomNode );
      } );
    }

    phetioStateSetEmitter.addListener( () => {
      this.updateAtomNodes();
    } );

    // Each screen will position this rectangle manually to ensure it's behind the content
    this.playAreaBoundsRectangle = new Path( null, {
      fill: new Color( 0, 255, 0, 0.5 ),
      stroke: new Color( 0, 255, 0, 0.5 )
    } );

    this.playAreaBoundsProperty = new Property<Bounds2>( this.layoutBounds );

    this.playAreaBoundsProperty.link( bounds => {
      this.setPlayAreaBounds( bounds );
    } );

    const decaySoundClip = new SoundClip( cardPickup_mp3 );
    soundManager.addSoundGenerator( decaySoundClip );

    model.decayedCountProperty.link( ( count, previous ) => {
      if ( previous && count > previous ) {
        // Decay is increasing! Play sound
        decaySoundClip.play();
      }
    } );
  }

  /**
   * Once a specific screen view has information about the available play area
   *  it should invoke this method to adjust the model view property accordingly.
   */
  public setPlayAreaBounds( playAreaBounds: Bounds2 ): void {

    // Show the area where the atoms can be placed if the 'dev' query parameter is present.
    if ( phet.chipper.queryParameters.dev ) {
      // Green area bounds
      this.playAreaBoundsRectangle.shape = Shape.bounds( playAreaBounds );
    }

    const atomAreaModelWidth = 2 * NuclearDecayCommonConstants.ATOM_RADIUS * this.numberOfAtomsInPlayAreaWidth;
    const scale = playAreaBounds.width / atomAreaModelWidth;
    this.modelViewTransformProperty.value = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      playAreaBounds.center,
      scale
    );

    this.model.atomPlacementAreaProperty.value = Shape.bounds(
      this.modelViewTransformProperty.value.viewToModelBounds( playAreaBounds )
    );
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.atomNodesMap.forEach( atomNode => {
      atomNode.update();
    } );
  }

  public reset(): void {
    this.model.reset();
    this.resetAtomNodes();
  }

  public resetAtomNodes(): void {
    this.atomNodesMap.forEach( atomNode => {
      atomNode.visible = false;
    } );
  }

  /**
   * Update atom nodes that are related to active atoms
   */
  public updateAtomNodes(): void {
    this.model.activeAtoms.forEach( atom => {
      const atomNode = this.atomNodesMap.get( atom );
      affirm( atomNode, 'Atom Node should exist for active atom' );
      atomNode.update();
    } );
  }

  public activateMultipleAtomNodes( n: number ): void {
    this.resetAtomNodes();
    this.model.activateMultipleAtoms( n );
    this.updateAtomNodes();
  }
}
