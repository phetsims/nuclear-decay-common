// Copyright 2026, University of Colorado Boulder

/**
 * DecayRateScreenView is responsible for the visual representation of the Decay Rates Screen
 * in the Alpha Decay and Beta Decay simulations.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import AddAtomsControlPanel from '../../../../nuclear-decay-common/js/common/view/AddAtomsControlPanel.js';
import NuclearDecayScreenView, { NuclearDecayScreenViewOptions } from '../../../../nuclear-decay-common/js/common/view/NuclearDecayScreenView.js';
import NuclearDecayCommonColors from '../../../../nuclear-decay-common/js/NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../../../nuclear-decay-common/js/NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../../../nuclear-decay-common/js/NuclearDecayCommonFluent.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NuclearDecayAtom from '../../common/model/NuclearDecayAtom.js';
import IsotopeSelectionPanel from '../../common/view/IsotopeSelectionPanel.js';
import ResetAtomsButton from '../../common/view/ResetAtomsButton.js';
import DecayRateModel from '../model/DecayRateModel.js';
import DecayRateGraphPanel from './DecayRateGraphPanel.js';
import DecayRateScreenSummaryContent from './DecayRateScreenSummaryContent.js';
import DecayRateVisibleProperties from './DecayRateVisibleProperties.js';
import SortButton from './SortButton.js';

type SelfOptions = EmptySelfOptions;

export type DecayRateScreenViewOptions = SelfOptions & NuclearDecayScreenViewOptions;

export default class DecayRateScreenView extends NuclearDecayScreenView {

  // TODO: Find a way to have this be this.model without conflicts with parent class https://github.com/phetsims/alpha-decay/issues/3
  private readonly decayRateModel: DecayRateModel;
  private readonly decayRateGraphPanel: DecayRateGraphPanel;

  private readonly visibleProperties: DecayRateVisibleProperties;

  public constructor( model: DecayRateModel, providedOptions: DecayRateScreenViewOptions ) {

    const options = optionize<DecayRateScreenViewOptions, SelfOptions, NuclearDecayScreenViewOptions>()( {
      numberOfAtomsInPlayAreaWidth: 200,
      screenSummaryContent: new DecayRateScreenSummaryContent( model )
    }, providedOptions );

    const MARGIN_X = NuclearDecayCommonConstants.SCREEN_VIEW_X_MARGIN;
    const MARGIN_Y = NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN;
    const PANEL_SPACING = NuclearDecayCommonConstants.PANEL_SPACING;

    super( model, options );

    this.visibleProperties = new DecayRateVisibleProperties( options.tandem.createTandem( 'visibleProperties' ) );

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
      flowBoxSpacing: 10,
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      speedRadioButtonGroupOptions: {
        accessibleHelpText: NuclearDecayCommonFluent.a11y.speedControls.accessibleHelpTextStringProperty
      },
      bottom: resetAllButton.bottom,
      right: resetAllButton.left - 5 * PANEL_SPACING,
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    this.addChild( timeControlNode );

    const addAtomsPanel = new AddAtomsControlPanel(
      model.atomsToAddProperty,
      model.selectedIsotopeProperty,
      () => {
        this.activateMultipleAtomNodes();
      },
      {
        stepSize: 100,
        centerX: this.layoutBounds.centerX,
        bottom: this.layoutBounds.maxY - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'addAtomsPanel' )
      } );
    this.addChild( addAtomsPanel );

    const isotopesLegendPanel = new IsotopeSelectionPanel(
      [ NuclearDecayCommonConstants.POLONIUM_211, NuclearDecayCommonConstants.LEAD_207 ],
      {
        includeAtomRepresentation: true,
        left: this.layoutBounds.minX + MARGIN_X,
        bottom: this.layoutBounds.maxY - MARGIN_Y
      }
    );
    this.addChild( isotopesLegendPanel );

    this.decayRateModel = model;

    this.decayRateGraphPanel = new DecayRateGraphPanel( model, this.visibleProperties, {
      top: this.layoutBounds.minY,
      yMargin: MARGIN_Y,

      // Panel really wide to make it seem a control background, as per design request
      minWidth: this.layoutBounds.width * 10,
      centerX: this.layoutBounds.centerX,
      tandem: options.tandem.createTandem( 'decayRateGraphPanel' ),
      fill: NuclearDecayCommonConstants.MAIN_PANEL_FILL,
      stroke: null
    } );
    this.addChild( this.decayRateGraphPanel );

    const playAreaBounds = new Bounds2(
      this.layoutBounds.left,
      this.decayRateGraphPanel.bottom + NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
      this.layoutBounds.right - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
      addAtomsPanel.top - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN
    );
    this.setPlayAreaBounds( playAreaBounds );

    // Reset button — top-right
    const resetButton = new ResetAtomsButton( model.isPlayAreaEmptyProperty, {
      listener: () => {
        this.activateMultipleAtomNodes();
        this.updateAtomNodes();
      },
      accessibleName: NuclearDecayCommonFluent.a11y.decayRate.resetSampleButton.accessibleNameStringProperty,
      tandem: options.tandem.createTandem( 'resetButton' )
    } );

    const sortButton = new SortButton( resetButton.bounds, {
      tandem: options.tandem.createTandem( 'sortButton' ),
      enabledProperty: model.isPlayAreaEmptyProperty.derived( empty => !empty ),
      baseColor: NuclearDecayCommonColors.resetButtonProperty,
      listener: () => {
        model.sort();
        this.updateAtomNodes();
        model.isPlayingProperty.value = false;
      }
    } );

    const rightButtonsBox = new VBox( {
      children: [ resetButton, sortButton ],
      spacing: 10,
      right: playAreaBounds.right,
      centerY: playAreaBounds.centerY
    } );
    this.addChild( rightButtonsBox );

    this.children = [ this.playAreaBoundsRectangle, ...this.children ];

    // ---- PDOM description nodes ----

    // Dynamic name for the undecayed isotope (e.g., "Polonium-211" or "Isotope A").
    const undecayedIsotopeNameProperty: TReadOnlyProperty<string> = NuclearDecayAtom.createDynamicIsotopeNameAndMassStringProperty(
      model.selectedIsotopeProperty, NuclearDecayCommonFluent.isotopeAStringProperty
    );

    // Dynamic name for the decay-product isotope (e.g., "Lead-207" or "Isotope B").
    const decayedIsotopeNameProperty: TReadOnlyProperty<string> = NuclearDecayAtom.createDynamicDecayProductNameAndMassStringProperty(
      model.selectedIsotopeProperty, NuclearDecayCommonFluent.isotopeBStringProperty
    );

    // State 1: No atoms in play area.
    const noAtomsDescNode = new Node( {
      visibleProperty: model.isPlayAreaEmptyProperty,
      accessibleParagraph: NuclearDecayCommonFluent.a11y.multipleAtoms.radioactiveSample.noAtoms.createProperty( {
        isotope: undecayedIsotopeNameProperty
      } )
    } );

    // State 2: Atoms added but none have decayed yet.
    const readyToDecayDescNode = new Node( {
      visibleProperty: new DerivedProperty(
        [ model.isPlayAreaEmptyProperty, model.decayedCountProperty ],
        ( isEmpty, decayedCount ) => !isEmpty && decayedCount === 0
      ),
      accessibleParagraph: NuclearDecayCommonFluent.a11y.multipleAtoms.radioactiveSample.readyToDecay.createProperty( {
        addedAtoms: model.activeAtomsCountProperty,
        isotope: undecayedIsotopeNameProperty
      } )
    } );

    // State 3: Atoms added and at least one has decayed.
    const decayOccurringDescNode = new Node( {
      visibleProperty: model.decayedCountProperty.derived( count => count > 0 ),
      accessibleParagraph: NuclearDecayCommonFluent.a11y.decayRate.radioactiveSample.decayOccurring.createProperty( {
        addedAtoms: model.activeAtomsCountProperty,
        isotope: undecayedIsotopeNameProperty,
        time: model.timeProperty.derived( t => toFixed( t, 2 ) ),
        percentageUndecayed: model.percentageOfUndecayedProperty.derived( p => `${roundSymmetric( p * 100 )}` ),
        undecayedCount: model.undecayedCountProperty,
        decayedCount: model.decayedCountProperty
      } )
    } );

    // Heading that groups radioactive sample content for screen readers.
    const radioactiveSampleHeadingNode = new Node( {
      accessibleHeading: NuclearDecayCommonFluent.a11y.multipleAtoms.radioactiveSampleHeadingStringProperty
    } );
    radioactiveSampleHeadingNode.pdomOrder = [
      noAtomsDescNode,
      readyToDecayDescNode,
      decayOccurringDescNode,
      addAtomsPanel,
      resetButton,
      sortButton
    ];
    this.addChild( noAtomsDescNode );
    this.addChild( readyToDecayDescNode );
    this.addChild( decayOccurringDescNode );
    this.addChild( radioactiveSampleHeadingNode );

    // Description of the decay graph that updates as curve visibility changes.
    const checkedComponentsProperty = new DerivedStringProperty(
      [
        this.visibleProperties.showUndecayedProperty,
        this.visibleProperties.showDecayedProperty,
        this.visibleProperties.showHalfLivesProperty,
        undecayedIsotopeNameProperty,
        decayedIsotopeNameProperty
      ],
      ( showUndecayed, showDecayed, showHalfLives, undecayedName, decayedName ) => {
        const parts: string[] = [];
        if ( showUndecayed ) { parts.push( `${undecayedName} curve` ); }
        if ( showDecayed ) { parts.push( `${decayedName} curve` ); }
        if ( showHalfLives ) { parts.push( 'half-life markers' ); }
        return parts.length > 0 ? parts.join( ' and ' ) : 'nothing';
      }
    );

    const graphDescNode = new Node( {
      accessibleParagraph: NuclearDecayCommonFluent.a11y.decayRate.decayGraphPanel.accessibleParagraph.createProperty( {
        checkedComponents: checkedComponentsProperty
      } )
    } );
    this.addChild( graphDescNode );

    // Heading that groups decay graph content for screen readers.
    const decayGraphHeadingNode = new Node( {
      accessibleHeading: NuclearDecayCommonFluent.a11y.decayRate.decayGraphHeadingStringProperty
    } );
    decayGraphHeadingNode.pdomOrder = [
      graphDescNode,
      this.decayRateGraphPanel.dataProbeGrabber
    ];
    this.addChild( decayGraphHeadingNode );

    // Play Area pdomOrder:
    //   Radioactive Sample heading → Decay Graph heading → Isotopes legend
    this.pdomPlayAreaNode.pdomOrder = [
      radioactiveSampleHeadingNode,
      decayGraphHeadingNode,
      isotopesLegendPanel
    ];

    // Control Area pdomOrder:
    //   Isotope curve checkboxes → Half-lives checkbox → Data probe checkbox → Time controls → Reset All
    this.pdomControlAreaNode.pdomOrder = [
      timeControlNode,
      resetAllButton
    ];
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
    this.visibleProperties.reset();
  }
}
