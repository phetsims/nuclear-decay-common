// Copyright 2026, University of Colorado Boulder

/**
 * DecayRateScreenView is responsible for the visual representation of the Decay Rates Screen
 * in the Alpha Decay and Beta Decay simulations.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import AddAtomsControlPanel from '../../../../nuclear-decay-common/js/common/view/AddAtomsControlPanel.js';
import DecayRateGraphPanel from '../../../../nuclear-decay-common/js/common/view/DecayRateGraphPanel.js';
import IsotopeLegendPanel from '../../../../nuclear-decay-common/js/common/view/IsotopeLegendPanel.js';
import NuclearDecayScreenView, { NuclearDecayScreenViewOptions } from '../../../../nuclear-decay-common/js/common/view/NuclearDecayScreenView.js';
import NuclearDecayCommonColors from '../../../../nuclear-decay-common/js/NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../../../nuclear-decay-common/js/NuclearDecayCommonConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import undoSolidShape from '../../../../sherpa/js/fontawesome-5/undoSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import DecayRateModel from '../model/DecayRateModel.js';

type SelfOptions = EmptySelfOptions;

export type DecayRateScreenViewOptions = SelfOptions & NuclearDecayScreenViewOptions;

export default class DecayRateScreenView extends NuclearDecayScreenView {

  // TODO: Find a way to have this be this.model without conflicts with parent class https://github.com/phetsims/alpha-decay/issues/3
  private readonly decayRateModel: DecayRateModel;
  private readonly decayRateGraphPanel: DecayRateGraphPanel;

  public constructor( model: DecayRateModel, providedOptions: DecayRateScreenViewOptions ) {

    const options = optionize<DecayRateScreenViewOptions, SelfOptions, NuclearDecayScreenViewOptions>()( {
      numberOfAtomsInPlayAreaWidth: 200
    }, providedOptions );

    const MARGIN_X = NuclearDecayCommonConstants.SCREEN_VIEW_X_MARGIN;
    const MARGIN_Y = NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN;
    const PANEL_SPACING = NuclearDecayCommonConstants.PANEL_SPACING;

    super( model, options );

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
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.manualStep()
        }
      },
      bottom: resetAllButton.bottom,
      right: resetAllButton.left - 5 * PANEL_SPACING,
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    this.addChild( timeControlNode );

    const defaultAtomsToAdd = 500;
    const atomsToAddProperty = new NumberProperty(
      Math.min( model.maxNumberOfAtoms, defaultAtomsToAdd ), {
        range: new Range( 1, model.maxNumberOfAtoms ),
        tandem: options.tandem.createTandem( 'atomsToAddProperty' )
      } );

    const addAtomsPanel = new AddAtomsControlPanel(
      atomsToAddProperty,
      model.selectedIsotopeProperty,
      ( n: number ) => {
        this.decayRateModel.reset();
        this.activateMultipleAtomNodes( n );
      },
      {
        stepSize: 100,
        centerX: this.layoutBounds.centerX,
        bottom: this.layoutBounds.maxY - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'addAtomsPanel' )
      } );
    this.addChild( addAtomsPanel );

    const isotopesLegendPanel = new IsotopeLegendPanel(
      [ NuclearDecayCommonConstants.POLONIUM_211, NuclearDecayCommonConstants.LEAD_207 ],
      {
        includeAtomRepresentation: true,
        left: this.layoutBounds.minX + MARGIN_X,
        bottom: this.layoutBounds.maxY - MARGIN_Y
      }
    );
    this.addChild( isotopesLegendPanel );

    this.decayRateModel = model;

    this.decayRateGraphPanel = new DecayRateGraphPanel( model, {
      left: this.layoutBounds.minX + MARGIN_X,
      top: this.layoutBounds.minY + MARGIN_Y,
      tandem: options.tandem.createTandem( 'decayRateGraphPanel' )
    } );
    this.addChild( this.decayRateGraphPanel );

    const playAreaBounds = new Bounds2(
      this.decayRateGraphPanel.left,
      this.decayRateGraphPanel.bottom + NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
      this.layoutBounds.right - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
      addAtomsPanel.top - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN
    );
    this.setPlayAreaBounds( playAreaBounds );

    // Reset button — top-right
    const resetButton = new RectangularPushButton( {
      content: new Path( undoSolidShape, { scale: 0.038, fill: 'black' } ),
      baseColor: NuclearDecayCommonColors.resetButtonProperty,
      listener: () => {
        model.clearAtomLists();
        this.activateMultipleAtomNodes( atomsToAddProperty.value );
      },
      right: playAreaBounds.right,
      top: playAreaBounds.top,
      tandem: options.tandem.createTandem( 'resetButton' )
    } );
    this.addChild( resetButton );

    this.children = [ this.playAreaBoundsRectangle, ...this.children ];

  }

  public override step( dt: number ): void {
    super.step( dt );
    this.decayRateGraphPanel.update(
      this.decayRateModel.undecayedDataPoints,
      this.decayRateModel.decayedDataPoints
    );
  }

  public override reset(): void {
    super.reset();
    this.decayRateGraphPanel.reset();
  }
}
