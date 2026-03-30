// Copyright 2026, University of Colorado Boulder
/**
 * Common screen view for Nuclear Decay simulations.
 *
 * @author Agustín Vallejo
 */

import ScreenView, { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import optionize from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import RestartButton from '../../../scenery-phet/js/buttons/RestartButton.js';
import TimeControlNode from '../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Color from '../../../scenery/js/util/Color.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import EquationAccordionBox from './EquationAccordionBox.js';
import HalfLifePanel from './HalfLifePanel.js';
import IsotopePanel from './IsotopePanel.js';
import ParticleCountsAccordionBox from './ParticleCountsAccordionBox.js';

type SelfOptions = {
  isotopePanelMiddleContent?: Node[] | null;

  // The transform used to translate model coordinates to view coordinates.
  modelViewTransform?: ModelViewTransform2;
};

export type NuclearDecayScreenViewOptions = SelfOptions & WithRequired<ScreenViewOptions, 'tandem'>;

export default class NuclearDecayScreenView extends ScreenView {

  // Child classes will need to reference this panel for layout
  protected readonly halfLifePanel: HalfLifePanel;

  public constructor( model: NuclearDecayModel, providedOptions?: NuclearDecayScreenViewOptions ) {

    const options = optionize<NuclearDecayScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      // Self Options
      isotopePanelMiddleContent: null,

      // Use a simple identity transform if none is provided.
      modelViewTransform: ModelViewTransform2.createIdentity()
    }, providedOptions );

    super( options );

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

    const rightColumnVBox = new VBox( {
      spacing: PANEL_SPACING,
      right: this.layoutBounds.maxX - MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      children: [ isotopePanel, particleCountsAccordionBox, equationAccordionBox ]
    } );
    this.addChild( rightColumnVBox );

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

    // Show the area where the atoms can be placed if the 'dev' query parameter is present.
    if ( QueryStringMachine.containsKey( 'dev' ) ) {
      const atomAreaNode = new Path( options.modelViewTransform.modelToViewShape( model.atomPlacementArea ), {
        stroke: Color.RED,
        fill: new Color( 255, 0, 0, 0.5 )
      } );
      this.addChild( atomAreaNode );
    }
  }

  public reset(): void {
    // TO BE IMPLEMENTED
  }
}
