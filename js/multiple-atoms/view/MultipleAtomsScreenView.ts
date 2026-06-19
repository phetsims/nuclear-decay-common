// Copyright 2026, University of Colorado Boulder

/**
 * MultipleAtomsScreenView is used by Alpha and Beta Decay Simulations for their second screen which
 * shows the decay of multiple atoms at once.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AddAtomsControlPanel from '../../../../nuclear-decay-common/js/common/view/AddAtomsControlPanel.js';
import NuclearDecayCommonConstants from '../../../../nuclear-decay-common/js/NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../../../nuclear-decay-common/js/NuclearDecayCommonFluent.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NuclearDecayAtom from '../../common/model/NuclearDecayAtom.js';
import IsotopeSelectionPanel from '../../common/view/IsotopeSelectionPanel.js';
import ResetAtomsButton from '../../common/view/ResetAtomsButton.js';
import SingleAndMultipleAtomsScreenView, { SingleAndMultipleAtomsScreenViewOptions } from '../../common/view/SingleAndMultipleAtomsScreenView.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import MultipleAtomsModel from '../model/MultipleAtomsModel.js';
import MultipleAtomsScreenSummaryContent from './MultipleAtomsScreenSummaryContent.js';
import MultipleAtomsVisibleProperties from './MultipleAtomsVisibleProperties.js';

type SelfOptions = {

  // Sim-specific name for the decay particle type, e.g. "Alpha" for alpha decay.
  // Interpolated into the radioactive sample description when atoms are decaying.
  decayParticleStringProperty?: TReadOnlyProperty<string>;
};

export type MultipleAtomsScreenViewOptions = SelfOptions & SingleAndMultipleAtomsScreenViewOptions;

const MARGIN_X = NuclearDecayCommonConstants.SCREEN_VIEW_X_MARGIN;
const MARGIN_Y = NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN;

export default class MultipleAtomsScreenView extends SingleAndMultipleAtomsScreenView {

  private readonly visibleProperties: MultipleAtomsVisibleProperties;

  public constructor( model: MultipleAtomsModel, providedOptions: MultipleAtomsScreenViewOptions ) {

    const visibleProperties = new MultipleAtomsVisibleProperties( providedOptions.tandem );

    const stopwatchIcon = rasterizeNode( new StopwatchNode( new Stopwatch( {
      isVisible: true,
      tandem: Tandem.OPT_OUT
    } ), {
      numberDisplayOptions: {
        textOptions: {
          maxWidth: 100
        }
      },
      tandem: Tandem.OPT_OUT
    } ), {
      resolution: 5,
      nodeOptions: {
        // tandem: tandem.createTandem( 'stopwatchIcon' ),
        visiblePropertyOptions: { phetioFeatured: true }
      }
    } );
    stopwatchIcon.setScaleMagnitude( 0.3 );

    const electronCloudRadius = 10;
    const electronCloudCheckbox = new Checkbox( visibleProperties.electronCloudVisibleProperty,
      new HBox( {
        spacing: 10,
        children: [
          new Text( NuclearDecayCommonFluent.electronCloudStringProperty, { font: NuclearDecayCommonConstants.CONTROL_FONT } ),
          new Circle( electronCloudRadius, {
            fill: new RadialGradient( 0, 0, 0, 0, 0, electronCloudRadius )
              .addColorStop( 0, NuclearDecayCommonColors.electronCloudColorProperty.value.withAlpha( 0.5 ) )
              .addColorStop( 0.9, NuclearDecayCommonColors.electronCloudColorProperty.value.withAlpha( 0 ) )
          } )
        ]
      } ), {
        accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.electronCloudCheckbox.accessibleNameStringProperty,
        accessibleHelpText: NuclearDecayCommonFluent.a11y.multipleAtoms.electronCloudCheckbox.accessibleHelpTextStringProperty,
        tandem: providedOptions.tandem.createTandem( 'electronCloudCheckbox' )
      }
    );
    const labelsVisibleCheckbox = new Checkbox( visibleProperties.labelsVisibleProperty,
      new HBox( {
        spacing: 10,
        children: [
          new Text( 'Labels', { font: NuclearDecayCommonConstants.CONTROL_FONT } )
        ]
      } ), {
        accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.electronCloudCheckbox.accessibleNameStringProperty,
        accessibleHelpText: NuclearDecayCommonFluent.a11y.multipleAtoms.electronCloudCheckbox.accessibleHelpTextStringProperty,
        tandem: providedOptions.tandem.createTandem( 'labelsVisibleCheckbox' )
      }
    );
    const stopwatchCheckbox = new Checkbox( visibleProperties.stopwatchVisibleProperty,
      new HBox( {
        spacing: 10,
        children: [
          new Text( NuclearDecayCommonFluent.stopwatchStringProperty, { font: NuclearDecayCommonConstants.CONTROL_FONT } ),
          stopwatchIcon
        ]
      } ), {
        accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.stopwatchCheckbox.accessibleNameStringProperty,
        accessibleHelpText: NuclearDecayCommonFluent.a11y.multipleAtoms.stopwatchCheckbox.accessibleHelpTextStringProperty,
        tandem: providedOptions.tandem.createTandem( 'stopwatchCheckbox' )
      }
    );

    const isotopePanelMiddleContent = [ electronCloudCheckbox, labelsVisibleCheckbox, stopwatchCheckbox ];

    const options = optionize<MultipleAtomsScreenViewOptions, SelfOptions, SingleAndMultipleAtomsScreenViewOptions>()( {
      screenSummaryContent: new MultipleAtomsScreenSummaryContent( model ),
      isotopePanelMiddleContent: isotopePanelMiddleContent,
      numberOfAtomsInPlayAreaWidth: 40,
      decayParticleStringProperty: new Property( '' ),
      electronCloudVisibleProperty: visibleProperties.electronCloudVisibleProperty,
      labelsVisibleProperty: visibleProperties.labelsVisibleProperty
    }, providedOptions );

    super( model, options );

    this.visibleProperties = visibleProperties;

    const addAtomsPanel = new AddAtomsControlPanel(
      model.atomsToAddProperty,
      model.selectedIsotopeProperty,
      () => {
        this.activateMultipleAtomNodes();
      },
      {
        centerX: this.layoutBounds.centerX,
        bottom: this.layoutBounds.maxY - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'addAtomsPanel' )
      } );
    this.addChild( addAtomsPanel );

    const playAreaBounds = new Bounds2(
      this.decayTimeHistogramPanel.left,
      this.decayTimeHistogramPanel.bottom + NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
      this.decayTimeHistogramPanel.right,
      addAtomsPanel.top - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN
    );

    // Create the button that can be used to reset the decay state of the sample of atomic nuclei currently present in
    // the model.
    const resetSampleButton = new ResetAtomsButton( model.isPlayAreaEmptyProperty, {
      listener: () => {
        model.activateMultipleAtoms();
        this.updateAtomNodes();
      },
      right: playAreaBounds.right,
      top: playAreaBounds.top,
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.resetSampleButton.accessibleNameStringProperty,
      tandem: options.tandem.createTandem( 'resetSampleButton' )
    } );
    this.addChild( resetSampleButton );

    // Crop the atom placement area so atoms are not placed behind the reset button.
    this.playAreaExclusionNodes.push( resetSampleButton );
    this.setPlayAreaBounds( playAreaBounds );

    const isotopesLegendPanel = new IsotopeSelectionPanel(
      [ NuclearDecayCommonConstants.POLONIUM_211, NuclearDecayCommonConstants.LEAD_207 ],
      {
        left: this.layoutBounds.minX + MARGIN_X,
        bottom: this.layoutBounds.maxY - MARGIN_Y
      }
    );
    this.addChild( isotopesLegendPanel );


    affirm( model.stopwatch, 'The model should have a stopwatch for the Multiple Atoms screen.' );
    const stopwatch = model.stopwatch;

    // Set a default position within the play area.
    stopwatch.positionProperty.setInitialValue( new Vector2(
      this.rightColumnControls.centerX, this.rightColumnControls.bottom + 30
    ) );
    stopwatch.positionProperty.reset();

    const stopwatchNode = new StopwatchNode( stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: options.tandem.createTandem( 'stopwatchNode' ),
      visibleProperty: visibleProperties.stopwatchVisibleProperty,
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
          units: 's',
          showAsMinutesAndSeconds: false,
          numberOfDecimalPlaces: 2
        } )
      },
      visiblePropertyOptions: {
        phetioReadOnly: true
      }
    } );
    this.addChild( stopwatchNode );

    // Making stopwatch run when activated, for better user experience reasons.
    // This is fine because sim won't actually run until atoms are added.
    stopwatchNode.visibleProperty.link( visible => {
      stopwatch.reset();
      stopwatch.isRunningProperty.value = visible && model.timeProperty.value === 0;
    } );

    this.children = [ this.playAreaBoundsRectangle, ...this.children ];

    // ---- PDOM description nodes ----

    // Dynamic isotope name used in accessible descriptions.
    const isotopeNameProperty = NuclearDecayAtom.createDynamicIsotopeNameAndMassStringProperty(
      model.selectedIsotopeProperty,
      NuclearDecayCommonFluent.isotopeAStringProperty
    );

    // State 1: No atoms in play area.
    const noAtomsDescNode = new Node( {
      visibleProperty: model.isPlayAreaEmptyProperty,
      accessibleParagraph: NuclearDecayCommonFluent.a11y.multipleAtoms.radioactiveSample.noAtoms.createProperty( {
        isotope: isotopeNameProperty
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
        isotope: isotopeNameProperty
      } )
    } );

    // State 3: Atoms added and at least one has decayed.
    const decayOccurringDescNode = new Node( {
      visibleProperty: model.decayedCountProperty.derived( count => count > 0 ),
      accessibleParagraph: NuclearDecayCommonFluent.a11y.multipleAtoms.radioactiveSample.decayOccurring.createProperty( {
        addedAtoms: model.activeAtomsCountProperty,
        isotope: isotopeNameProperty,
        decayParticle: options.decayParticleStringProperty,
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
      resetSampleButton
    ];
    this.addChild( noAtomsDescNode );
    this.addChild( readyToDecayDescNode );
    this.addChild( decayOccurringDescNode );
    this.addChild( radioactiveSampleHeadingNode );

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

    // Heading that groups the decay data panel content for screen readers.
    const decayDataHeadingNode = new Node( {
      accessibleHeading: NuclearDecayCommonFluent.a11y.multipleAtoms.decayDataHeadingStringProperty
    } );
    decayDataHeadingNode.pdomOrder = [
      this.decayTimeHistogramPanel,
      atHalfLifeDescNode
    ];
    this.addChild( decayDataHeadingNode );

    // Play Area pdomOrder:
    //   Radioactive Sample heading → Decay Data heading → Particle legend → Isotope panel
    this.pdomPlayAreaNode.pdomOrder = [
      radioactiveSampleHeadingNode,
      decayDataHeadingNode,
      this.particleLegendPanel,
      this.isotopePanel
    ];

    // Control Area pdomOrder:
    //   Electron cloud checkbox → Stopwatch checkbox → Time controls → Reset All button
    this.pdomControlAreaNode.pdomOrder = [
      ...isotopePanelMiddleContent,
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
    this.visibleProperties.reset();
  }
}
