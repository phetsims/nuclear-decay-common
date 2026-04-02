// Copyright 2026, University of Colorado Boulder
/**
 * Common Screen View for screens of the Nuclear Decay suite that use a histogram to display decay times,
 * as well as additional information panels such as isotope legends and decay equations.
 *
 * @author Agustín Vallejo
 */

import { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import optionize from '../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import RestartButton from '../../../scenery-phet/js/buttons/RestartButton.js';
import TimeControlNode from '../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import DecayTimeHistogramPanel from './DecayTimeHistogramPanel.js';
import IsotopePanel from './IsotopePanel.js';
import NuclearDecayScreenView, { NuclearDecayScreenViewOptions } from './NuclearDecayScreenView.js';

type SelfOptions = {
  // Additional content to add to the isotope panel
  isotopePanelMiddleContent?: Node[] | null;

  // How many atoms will fit visually within the width of the play area
  numberOfAtomsInPlayAreaWidth?: number;
};

export type DecayHistogramScreenViewOptions = SelfOptions & NuclearDecayScreenViewOptions;

export default class DecayHistogramScreenView extends NuclearDecayScreenView {

  // Child classes will need to reference this panel for layout
  protected readonly decayTimeHistogramPanel: DecayTimeHistogramPanel;

  // Controls on the right side of the view.
  protected readonly rightColumnControls: Node;

  public constructor(
    model: NuclearDecayModel,
    providedOptions?: DecayHistogramScreenViewOptions
  ) {

    const options = optionize<DecayHistogramScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // Self Options
      isotopePanelMiddleContent: null,

      numberOfAtomsInPlayAreaWidth: 10
    }, providedOptions );

    super( model, options );

    const MARGIN_X = NuclearDecayCommonConstants.SCREEN_VIEW_X_MARGIN;
    const MARGIN_Y = NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN;
    const PANEL_SPACING = NuclearDecayCommonConstants.PANEL_SPACING;

    // Top-left panel

    this.decayTimeHistogramPanel = new DecayTimeHistogramPanel( model, {
      minWidth: NuclearDecayCommonConstants.LONG_PANEL_WIDTH,
      left: this.layoutBounds.minX + MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      fill: NuclearDecayCommonConstants.MAIN_PANEL_FILL,
      tandem: options.tandem.createTandem( 'decayTimeHistogramPanel' )
    } );
    this.addChild( this.decayTimeHistogramPanel );

    // Right column panels

    const isotopePanel = new IsotopePanel( model, {
      middleContent: options.isotopePanelMiddleContent,
      tandem: options.tandem.createTandem( 'isotopePanel' )
    } );

    this.rightColumnControls = new VBox( {
      spacing: PANEL_SPACING,
      right: this.layoutBounds.maxX - MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      children: [ isotopePanel ]
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

  public override step( dt: number ): void {
    super.step( dt );
    this.decayTimeHistogramPanel.update( this.model.histogramData );
  }
}
