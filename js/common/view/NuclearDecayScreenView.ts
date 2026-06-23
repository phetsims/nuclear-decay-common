// Copyright 2026, University of Colorado Boulder
/**
 * Common screen view for Nuclear Decay simulations.
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
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
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import decaySound_mp3 from '../../../sounds/decaySound_mp3.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import Updatable from '../model/Updatable.js';
import AlphaParticleNode from './AlphaParticleNode.js';
import DynamicNucleusNode from './DynamicNucleusNode.js';
import MinimalAtomNode from './MinimalAtomNode.js';
import VibratingDecayingAtomNode from './VibratingDecayingAtomNode.js';

type SelfOptions = {

  // Additional content to add to the isotope panel
  isotopePanelMiddleContent?: Node[] | null;

  // How many atoms will fit visually within the width of the play area
  numberOfAtomsInPlayAreaWidth?: number;

  // Property to control visibility of electron clouds around nuclei. Optional - only used in multiple-atoms screens.
  electronCloudVisibleProperty?: TReadOnlyProperty<boolean> | null;

  // Property to control visibility of labels on top of nuclei. Optional - only used in multiple-atoms screens.
  labelsVisibleProperty?: TReadOnlyProperty<boolean> | null;

  // Property to control the escape radius of the atoms. Optional - only used in single-atom screens.
  escapeRadiusProperty?: TReadOnlyProperty<number> | null;

  // UI elements will eat up a bit of the available play area, these values dictate how much
  playAreaExclusionDilationX?: number;
  playAreaExclusionDilationY?: number;
};

export type NuclearDecayScreenViewOptions = SelfOptions & WithRequired<ScreenViewOptions, 'tandem'>;

export default class NuclearDecayScreenView extends ScreenView {

  // The model-view transform used for translating model coordinates into view coordinates. Subclasses can and should
  // set this directly to control the position of the play area.
  protected modelViewTransformProperty: Property<ModelViewTransform2>;

  // How many atoms will fit visually within the width of the play area
  protected readonly numberOfAtomsInPlayAreaWidthProperty: NumberProperty;

  // The nodes that represent the atoms in the play area.
  protected atomNodes: Updatable[] = [];

  protected readonly playAreaBoundsProperty: Property<Bounds2>;

  protected readonly playAreaBoundsRectangle: Path;

  // Nodes whose view-space bounds will be cropped out of the atom placement area in setPlayAreaBounds.
  // Subclasses push UI elements (e.g. ResetAtomsButton, SortButton) that live inside playAreaBounds so
  // that atoms are not placed behind them.  Must be populated before calling setPlayAreaBounds.
  protected readonly playAreaExclusionNodes: Node[] = [];

  private readonly playAreaExclusionDilationX: number;
  private readonly playAreaExclusionDilationY: number;

  public constructor(
    protected readonly model: NuclearDecayModel,
    providedOptions?: NuclearDecayScreenViewOptions
  ) {

    const options = optionize<NuclearDecayScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // Self Options
      isotopePanelMiddleContent: null,

      numberOfAtomsInPlayAreaWidth: 10,

      escapeRadiusProperty: null,

      electronCloudVisibleProperty: null,

      labelsVisibleProperty: null,

      playAreaExclusionDilationX: 10,
      playAreaExclusionDilationY: 10
    }, providedOptions );

    super( options );

    this.numberOfAtomsInPlayAreaWidthProperty = new NumberProperty( options.numberOfAtomsInPlayAreaWidth, {
      tandem: options.tandem.createTandem( 'numberOfAtomsInPlayAreaWidthProperty' ),
      phetioReadOnly: true
    } );

    // Default to an identity transform.
    this.modelViewTransformProperty = new Property( ModelViewTransform2.createIdentity() );

    // Single atom screen is in charge of creating its own atom, the models with multiple atoms are handled here.
    // TODO: See https://github.com/phetsims/alpha-decay/issues/10. If we keep this, the constants shouldn't be
    //       hard coded.
    if ( model.atomPool.length === 1 ) {
      const atom = model.atomPool[ 0 ];
      const atomNode = new DynamicNucleusNode( atom, this.modelViewTransformProperty, model.isPlayingProperty, {
        visibleProperty: model.isPlayAreaEmptyProperty.derived( isEmpty => !isEmpty ),
        escapeRadiusProperty: options.escapeRadiusProperty
      } );
      this.atomNodes.push( atomNode );

      this.addChild( atomNode );
    }
    else if ( model.maxNumberOfAtoms === NuclearDecayCommonConstants.MAX_ATOMS_SECOND_SCREEN ) {

      // For screens that use VibratingDecayingAtomNode, electronCloudVisibleProperty must be provided.
      affirm( options.electronCloudVisibleProperty, 'electronCloudVisibleProperty is required for multiple-atoms screens' );
      affirm( options.labelsVisibleProperty, 'labelsVisibleProperty is required for multiple-atoms screens' );

      model.atomPool.forEach( atom => {
        const atomNode = new VibratingDecayingAtomNode(
          atom,
          this.modelViewTransformProperty,
          options.electronCloudVisibleProperty!,
          {
            labelsVisibleProperty: options.labelsVisibleProperty!
          }
        );
        this.atomNodes.push( atomNode );
        this.addChild( atomNode );
      } );
    }
    else if ( model.maxNumberOfAtoms === NuclearDecayCommonConstants.MAX_ATOMS_THIRD_SCREEN ) {
      model.atomPool.forEach( atom => {
        const atomNode = new MinimalAtomNode( atom, this.modelViewTransformProperty, {} );
        this.atomNodes.push( atomNode );
        this.addChild( atomNode );
      } );
    }
    else {
      affirm( model.atomPool.length === 1, 'unexpected number of atoms' );
    }

    model.selectedIsotopeProperty.link( () => {
      this.updateAtomNodes();
    } );

    phetioStateSetEmitter.addListener( () => {
      this.updateAtomNodes();
    } );

    // Each screen will position this rectangle manually to ensure it's behind the content
    this.playAreaBoundsRectangle = new Path( null, {
      fill: new Color( 0, 255, 0, 0.5 ),
      stroke: new Color( 0, 255, 0, 0.5 )
    } );

    this.playAreaBoundsProperty = new Property<Bounds2>( this.layoutBounds );

    // Update the play area and the MVT if we change the bounds or how many atoms fit inside
    Multilink.multilink(
      [
        this.playAreaBoundsProperty,
        this.numberOfAtomsInPlayAreaWidthProperty
      ], ( bounds, _ ) => {
        this.setPlayAreaBounds( bounds );

      }
    );

    const decaySoundClip = new SoundClip( decaySound_mp3, {
      initialOutputLevel: 1 / Math.sqrt( model.maxNumberOfAtoms )
    } );
    soundManager.addSoundGenerator( decaySoundClip );

    model.decayedCountProperty.link( ( count, previous ) => {
      if ( previous !== null && count > previous ) {
        // Decay is increasing! Play sound
        decaySoundClip.play();
      }
    } );

    // Add view elements for each particle that could be ejected from a nucleus on a decay event.
    model.atomPool.forEach( atom => {
      atom.ejectedDecayParticles.forEach( particle => {
        if ( particle.type === 'alpha' ) {
          const particleNode = new AlphaParticleNode( {
            nucleonDiameter: this.modelViewTransformProperty.value.modelToViewDeltaX( 0.2 ),
            visibleProperty: particle.isActiveProperty,
            scale: 0.8 // TODO Instead of manually setting the scale of the particle, connect to the MVT https://github.com/phetsims/alpha-decay/issues/19
          } );
          this.addChild( particleNode );
          particle.positionProperty.link( position => {
            particleNode.center = this.modelViewTransformProperty.value.modelToViewPosition( position );
          } );
        }
        else {
          console.warn( `particle type not supported yet: ${particle.type}` );
        }
      } );
    } );

    this.playAreaExclusionDilationX = options.playAreaExclusionDilationX;
    this.playAreaExclusionDilationY = options.playAreaExclusionDilationY;
  }

  /**
   * Once a specific screen view has information about the available play area
   *  it should invoke this method to adjust the model view property accordingly.
   */
  public setPlayAreaBounds( playAreaBounds: Bounds2 ): void {

    const atomAreaModelWidth = 2 * NuclearDecayCommonConstants.ATOM_RADIUS * this.numberOfAtomsInPlayAreaWidthProperty.value;
    const scale = playAreaBounds.width / atomAreaModelWidth;
    this.modelViewTransformProperty.value = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      playAreaBounds.center,
      scale
    );

    const mvt = this.modelViewTransformProperty.value;

    // Start with the full model-space play area.
    let atomPlacementShape: Shape = Shape.bounds( mvt.viewToModelBounds( playAreaBounds ) );

    // Carve out each exclusion node (e.g. ResetAtomsButton, SortButton).
    this.playAreaExclusionNodes.forEach( node => {
      const nodeViewBounds = this.boundsOf( node );
      if ( nodeViewBounds.isValid() ) {

        atomPlacementShape = atomPlacementShape.shapeDifference(
          Shape.bounds( mvt.viewToModelBounds( nodeViewBounds
            .dilatedX( this.playAreaExclusionDilationX ).dilatedY( this.playAreaExclusionDilationY ) ) )
        );
      }
    } );

    this.model.atomPlacementAreaProperty.value = atomPlacementShape;

    // Show the area where the atoms can be placed if the 'dev' query parameter is present.
    if ( phet.chipper.queryParameters.dev ) {
      // Green area bounds
      this.playAreaBoundsRectangle.shape = mvt.modelToViewShape( atomPlacementShape );
    }

  }

  public reset(): void {
    this.model.reset();

    // Update the visibility of the atom nodes. This is necessary because the atom models don't use Properties, and only
    // the active ones are stepped, so this makes the ones that became inactive after reset
    this.updateAtomNodes();
  }

  /**
   * Update all atom nodes. The atom models don't use Properties, so this is necessary in some cases to keep the view
   * and model in sync. This updates ALL atom nodes, so shouldn't be called frequently, such as from step functions.
   */
  public updateAtomNodes(): void {
    this.atomNodes.forEach( atomNode => { atomNode.update(); } );
  }

  public activateMultipleAtomNodes(): void {
    this.model.activateMultipleAtoms();
    this.updateAtomNodes();
  }
}
