// Copyright 2026, University of Colorado Boulder
/**
 * Common screen view for Nuclear Decay simulations.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../axon/js/Property.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import Shape from '../../../kite/js/Shape.js';
import optionize from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import RestartButton from '../../../scenery-phet/js/buttons/RestartButton.js';
import TimeControlNode from '../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../scenery/js/util/Color.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import EquationAccordionBox from './EquationAccordionBox.js';
import HalfLifePanel from './HalfLifePanel.js';
import IsotopePanel from './IsotopePanel.js';
import MinimalAtomNode from './MinimalAtomNode.js';
import ParticleCountsAccordionBox from './ParticleCountsAccordionBox.js';

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

  // Child classes will need to reference this panel for layout
  protected readonly halfLifePanel: HalfLifePanel;

  // Controls on the right side of the view.
  protected readonly rightColumnControls: Node;

  // How many atoms will fit visually within the width of the play area
  private readonly numberOfAtomsInPlayAreaWidth: number;

  protected readonly atomNodesMap: Map<NuclearDecayAtom, MinimalAtomNode>;

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
    model.atomPool.forEach( atom => {
      const atomNode = new MinimalAtomNode( atom, this.modelViewTransformProperty );
      this.atomNodesMap.set( atom, atomNode );
      this.addChild( atomNode );
    } );

    const MARGIN_X = NuclearDecayCommonConstants.SCREEN_VIEW_X_MARGIN;
    const MARGIN_Y = NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN;
    const PANEL_SPACING = NuclearDecayCommonConstants.PANEL_SPACING;

    // Top-left panel

    this.halfLifePanel = new HalfLifePanel( model, {
      minWidth: NuclearDecayCommonConstants.LONG_PANEL_WIDTH,
      left: this.layoutBounds.minX + MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      fill: NuclearDecayCommonConstants.MAIN_PANEL_FILL,
      tandem: options.tandem.createTandem( 'halfLifePanel' )
    } );
    this.addChild( this.halfLifePanel );

    // Right column panels

    const isotopePanel = new IsotopePanel( model, {
      middleContent: options.isotopePanelMiddleContent,
      tandem: options.tandem.createTandem( 'isotopePanel' )
    } );
    const particleCountsAccordionBox = new ParticleCountsAccordionBox( model, {
      tandem: options.tandem.createTandem( 'particleCountsAccordionBox' )
    } );
    const equationAccordionBox = new EquationAccordionBox( model.selectedIsotopeProperty, {
      tandem: options.tandem.createTandem( 'equationAccordionBox' )
    } );

    this.rightColumnControls = new VBox( {
      spacing: PANEL_SPACING,
      right: this.layoutBounds.maxX - MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      children: [ isotopePanel, particleCountsAccordionBox, equationAccordionBox ]
    } );
    this.addChild( this.rightColumnControls );

    // Bottom-right controls

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MARGIN_X,
      bottom: this.layoutBounds.maxY - MARGIN_Y,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.manualStep()
        }
      },
      bottom: resetAllButton.top - PANEL_SPACING,
      right: resetAllButton.right,
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    const restartButton = new RestartButton( {
      listener: () => model.restart(),
      enabledProperty: model.timeProperty.derived( time => time > 0 )
    } );
    timeControlNode.addPushButton( restartButton, 0 );

    this.addChild( timeControlNode );
  }

  /**
   * Once a specific screen view has information about the available play area
   *  it should invoke this method to adjust the model view property accordingly.
   */
  public setPlayAreaBounds( playAreaBounds: Bounds2 ): void {

    // Show the area where the atoms can be placed if the 'dev' query parameter is present.
    if ( phet.chipper.queryParameters.dev ) {
      // Green area bounds
      this.addChild( new Rectangle( playAreaBounds, {
        fill: new Color( 0, 255, 0, 0.5 ),
        stroke: new Color( 0, 255, 0, 0.5 )
      } ) );
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

  public reset(): void {
    this.model.reset();
    this.resetAtomNodes();
  }

  public resetAtomNodes(): void {
    this.atomNodesMap.forEach( atomNode => {
      atomNode.visible = false;
    } );
  }
}
