// Copyright 2026, University of Colorado Boulder
/**
 * Common Screen View for Single Atom and Multiple Atoms screens of the Nuclear Decay suite
 * Since both use a histogram to display decay times, and additional information panels
 * such as isotope legends and decay equations.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
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
import ParticlesLegendPanel from './ParticlesLegendPanel.js';

type SelfOptions = {
  // Additional content to add to the isotope panel
  isotopePanelMiddleContent?: Node[] | null;

  // How many atoms will fit visually within the width of the play area
  numberOfAtomsInPlayAreaWidth?: number;
};

export type SingleAndMultipleAtomsScreenViewOptions = SelfOptions & WithRequired<NuclearDecayScreenViewOptions, 'tandem'>;

export default class SingleAndMultipleAtomsScreenView extends NuclearDecayScreenView {

  // Child classes will need to reference this panel for layout
  protected readonly decayTimeHistogramPanel: DecayTimeHistogramPanel;

  // Controls on the right side of the view.
  protected readonly rightColumnControls: Node;

  // Exposed so subclasses can set accessibleParagraph for the particle legend.
  protected readonly particleLegendPanel: ParticlesLegendPanel;

  // Time controls in the bottom-right corner; exposed so subclasses can lay out relative to it.
  protected readonly timeControlNode: TimeControlNode;

  // Reset All button; exposed for pdomOrder use in subclasses.
  protected readonly resetAllButton: ResetAllButton;

  // Isotope selector panel; exposed for pdomOrder use in subclasses.
  protected readonly isotopePanel: IsotopeControlPanel;

  public constructor(
    model: NuclearDecayModel,
    providedOptions?: SingleAndMultipleAtomsScreenViewOptions
  ) {

    const options = optionize<SingleAndMultipleAtomsScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // Self Options
      isotopePanelMiddleContent: null,

      numberOfAtomsInPlayAreaWidth: 8
    }, providedOptions );

    super( model, options );

    const MARGIN_X = NuclearDecayCommonConstants.SCREEN_VIEW_X_MARGIN;
    const MARGIN_Y = NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN;
    const PANEL_SPACING = NuclearDecayCommonConstants.PANEL_SPACING;

    // Right column panels

    this.particleLegendPanel = new ParticlesLegendPanel();

    this.isotopePanel = new IsotopeControlPanel( model, {
      middleContent: options.isotopePanelMiddleContent,
      tandem: options.tandem.createTandem( 'isotopePanel' )
    } );

    this.rightColumnControls = new VBox( {
      spacing: PANEL_SPACING,
      right: this.layoutBounds.maxX - MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      children: [ this.particleLegendPanel, this.isotopePanel ]
    } );
    this.addChild( this.rightColumnControls );

    // Top-left panel

    this.decayTimeHistogramPanel = new DecayTimeHistogramPanel(
      model,
      {
        minWidth: NuclearDecayCommonConstants.LONG_PANEL_WIDTH,
        left: this.layoutBounds.minX + MARGIN_X,
        top: this.layoutBounds.minY + MARGIN_Y,
        fill: NuclearDecayCommonConstants.MAIN_PANEL_FILL,
        tandem: options.tandem.createTandem( 'decayTimeHistogramPanel' ),
        accessibleHeading: NuclearDecayCommonFluent.a11y.multipleAtoms.decayDataHeadingStringProperty
      } );
    this.addChild( this.decayTimeHistogramPanel );

    // At-half-life paragraph: appears once the elapsed sample time has reached the half-life.
    const halfLifeReachedProperty = new DerivedProperty(
      [ model.timeProperty, model.halfLifeProperty, model.isPlayAreaEmptyProperty ],
      ( time, halfLife, isEmpty ) => !isEmpty && time > 0 && time >= halfLife
    );
    const atHalfLifeDescNode = new Node( {
      visibleProperty: halfLifeReachedProperty,
      accessibleParagraph: NuclearDecayCommonFluent.a11y.multipleAtoms.decayTimeHistogramAtHalfLife.createProperty( {
        halfLifePercentageUndecayed: model.percentageOfUndecayedProperty.derived( p => `${roundSymmetric( p * 100 )}` )
      } )
    } );
    this.addChild( atHalfLifeDescNode );


    // Bottom-right controls

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();

        const startTime = window.performance.now();

        this.reset();

        const elapsedTime = window.performance.now() - startTime;
        console.log( `this.reset() took ${elapsedTime} ms` );
      },
      right: this.layoutBounds.maxX - MARGIN_X,
      bottom: this.layoutBounds.maxY - MARGIN_Y,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      flowBoxSpacing: 10,
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
      bottom: model.isSingleAtomMode ? this.resetAllButton.top - 4 * PANEL_SPACING : this.resetAllButton.bottom,
      right: model.isSingleAtomMode ? this.resetAllButton.right : this.resetAllButton.left - 5 * PANEL_SPACING,
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    this.addChild( this.timeControlNode );
  }

  public override reset(): void {
    super.reset();
    this.decayTimeHistogramPanel.reset();
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.decayTimeHistogramPanel.update();
  }
}
