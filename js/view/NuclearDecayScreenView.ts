// Copyright 2026, University of Colorado Boulder
/**
 * Common screen view for Nuclear Decay simulations.
 *
 * @author Agustín Vallejo
 */

import ScreenView, { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import RestartButton from '../../../scenery-phet/js/buttons/RestartButton.js';
import TimeControlNode from '../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import EquationAccordionBox from './EquationAccordionBox.js';
import HalfLifePanel from './HalfLifePanel.js';
import IsotopePanel from './IsotopePanel.js';
import ParticleCountsAccordionBox from './ParticleCountsAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type NuclearDecayScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class NuclearDecayScreenView extends ScreenView {

  // Child classes will need to reference this panel for layout
  protected readonly halfLifePanel: HalfLifePanel;

  public constructor( model: NuclearDecayModel, providedOptions?: NuclearDecayScreenViewOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, NuclearDecayScreenViewOptions>()( {
      // Default options go here
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
      fill: NuclearDecayCommonConstants.MAIN_PANEL_FILL
    } );
    this.addChild( this.halfLifePanel );

    // Right column panels

    const isotopePanel = new IsotopePanel( model );
    const particleCountsAccordionBox = new ParticleCountsAccordionBox( model );
    const equationAccordionBox = new EquationAccordionBox( model.selectedIsotopeProperty );

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
      bottom: this.layoutBounds.maxY - MARGIN_Y
      // tandem: options.tandem.createTandem( 'resetAllButton' )
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
      right: resetAllButton.right
    } );

    const restartButton = new RestartButton( {
      listener: () => model.restart(),
      enabledProperty: model.timeProperty.derived( time => time > 0 )
    } );
    timeControlNode.addPushButton( restartButton, 0 );

    this.addChild( timeControlNode );
  }

  public reset(): void {
    // TO BE IMPLEMENTED
  }
}
