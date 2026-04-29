// Copyright 2026, University of Colorado Boulder
/**
 * Common Screen View for Single Atom and Multiple Atoms screens of the Nuclear Decay suite
 * Since both use a histogram to display decay times, and additional information panels
 * such as isotope legends and decay equations.
 *
 * @author Agustín Vallejo
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import DecayTimeHistogramPanel from './DecayTimeHistogramPanel.js';
import IsotopeControlPanel from './IsotopeControlPanel.js';
import NuclearDecayScreenView, { NuclearDecayScreenViewOptions } from './NuclearDecayScreenView.js';

type SelfOptions = {
  // Additional content to add to the isotope panel
  isotopePanelMiddleContent?: Node[] | null;

  // How many atoms will fit visually within the width of the play area
  numberOfAtomsInPlayAreaWidth?: number;
};

export type DecayHistogramScreenViewOptions = SelfOptions & WithRequired<NuclearDecayScreenViewOptions, 'tandem'>;

export default class SingleAndMultipleAtomsScreenView extends NuclearDecayScreenView {

  // Child classes will need to reference this panel for layout
  protected readonly decayTimeHistogramPanel: DecayTimeHistogramPanel;

  // Controls on the right side of the view.
  protected readonly rightColumnControls: Node;

  // Time controls in the bottom-right corner; exposed so subclasses can lay out relative to it.
  protected readonly timeControlNode: TimeControlNode;

  // Reset All button; exposed for pdomOrder use in subclasses.
  protected readonly resetAllButton: ResetAllButton;

  // Isotope selector panel; exposed for pdomOrder use in subclasses.
  protected readonly isotopePanel: IsotopeControlPanel;

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

    // Right column panels

    this.isotopePanel = new IsotopeControlPanel( model, {
      middleContent: options.isotopePanelMiddleContent,
      tandem: options.tandem.createTandem( 'isotopePanel' )
    } );

    this.rightColumnControls = new VBox( {
      spacing: PANEL_SPACING,
      right: this.layoutBounds.maxX - MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      children: [ this.isotopePanel ]
    } );
    this.addChild( this.rightColumnControls );

    // Top-left panel

    this.decayTimeHistogramPanel = new DecayTimeHistogramPanel(
      model,
      new Bounds2(
        this.layoutBounds.minX + MARGIN_X,
        this.layoutBounds.minY + MARGIN_Y,
        this.rightColumnControls.left - MARGIN_X,
        this.layoutBounds.maxX - MARGIN_Y
      ),
      {
        minWidth: NuclearDecayCommonConstants.LONG_PANEL_WIDTH,
        left: this.layoutBounds.minX + MARGIN_X,
        top: this.layoutBounds.minY + MARGIN_Y,
        fill: NuclearDecayCommonConstants.MAIN_PANEL_FILL,
        tandem: options.tandem.createTandem( 'decayTimeHistogramPanel' ),

        // If we're in multiple atom mode, set the histogram timescale to be linear
        timescale: !model.isSingleAtomMode ? 'linear' : undefined
      } );
    this.addChild( this.decayTimeHistogramPanel );

    // Bottom-right controls

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MARGIN_X,
      bottom: this.layoutBounds.maxY - MARGIN_Y,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.manualStep()
        }
      },
      speedRadioButtonGroupOptions: {
        accessibleHelpText: NuclearDecayCommonFluent.a11y.speedControls.accessibleHelpTextStringProperty
      },
      accessibleHeading: NuclearDecayCommonFluent.a11y.timeControls.accessibleHeadingStringProperty,
      bottom: this.resetAllButton.top - PANEL_SPACING,
      right: this.resetAllButton.right,
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    if ( model.isSingleAtomMode ) {
      const restartButton = new RestartButton( {
        listener: () => model.restart(),
        enabledProperty: model.timeProperty.derived( time => time > 0 ),
        accessibleName: NuclearDecayCommonFluent.a11y.replayDecay.accessibleNameStringProperty,
        accessibleHelpText: NuclearDecayCommonFluent.a11y.replayDecay.accessibleHelpTextStringProperty,
        tandem: options.tandem.createTandem( 'restartButton' )
      } );
      this.timeControlNode.addPushButton( restartButton, 0 );
    }

    this.addChild( this.timeControlNode );
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.decayTimeHistogramPanel.update( this.model.histogramData );
  }
}
