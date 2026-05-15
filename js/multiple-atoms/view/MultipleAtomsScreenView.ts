// Copyright 2026, University of Colorado Boulder

/**
 * MultipleAtomsScreenView is used by Alpha and Beta Decay Simulations for their second screen which
 * shows the decay of multiple atoms at once.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AddAtomsControlPanel from '../../../../nuclear-decay-common/js/common/view/AddAtomsControlPanel.js';
import IsotopeLegendPanel from '../../../../nuclear-decay-common/js/common/view/IsotopeLegendPanel.js';
import NuclearDecayCommonColors from '../../../../nuclear-decay-common/js/NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../../../nuclear-decay-common/js/NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../../../nuclear-decay-common/js/NuclearDecayCommonFluent.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import undoSolidShape from '../../../../sherpa/js/fontawesome-5/undoSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SingleAndMultipleAtomsScreenView, { DecayHistogramScreenViewOptions } from '../../common/view/SingleAndMultipleAtomsScreenView.js';
import MultipleAtomsModel from '../model/MultipleAtomsModel.js';
import MultipleAtomsVisibleProperties from './MultipleAtomsVisibleProperties.js';

type SelfOptions = EmptySelfOptions;

export type MultipleAtomsScreenViewOptions = SelfOptions & DecayHistogramScreenViewOptions;

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
              .addColorStop( 0, 'rgba( 0, 0, 255, 100 )' )
              .addColorStop( 0.9, 'rgba( 0, 0, 255, 0 )' )
          } )
        ]
      } ), {
      tandem: providedOptions.tandem.createTandem( 'electronCloudCheckbox' )
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
        tandem: providedOptions.tandem.createTandem( 'stopwatchCheckbox' )
      }
    );

    const options = optionize<MultipleAtomsScreenViewOptions, SelfOptions, DecayHistogramScreenViewOptions>()( {
      isotopePanelMiddleContent: [ electronCloudCheckbox, stopwatchCheckbox ],
      numberOfAtomsInPlayAreaWidth: 40
    }, providedOptions );

    super( model, options );

    this.visibleProperties = visibleProperties;

    const defaultAtomsToAdd = 100;
    const atomsToAddProperty = new NumberProperty(
      Math.min( model.maxNumberOfAtoms, defaultAtomsToAdd ), {
        range: new Range( 1, model.maxNumberOfAtoms ),
        tandem: options.tandem.createTandem( 'atomsToAddProperty' )
      } );
    const addAtomsPanel = new AddAtomsControlPanel(
      atomsToAddProperty,
      model.selectedIsotopeProperty,
      ( n: number ) => {
        this.activateMultipleAtomNodes( n );
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
      this.rightColumnControls.left - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
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
      tandem: options.tandem.createTandem( 'resetButton' ),
      enabledProperty: model.isPlayAreaEmptyProperty.derived( empty => !empty )
    } );
    this.addChild( resetButton );

    const isotopesLegendPanel = new IsotopeLegendPanel(
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
            showAsMinutesAndSeconds: false,
            numberOfDecimalPlaces: 2
        } )
      },
      visiblePropertyOptions: {
        phetioReadOnly: true
      }
    } );
    this.addChild( stopwatchNode );

    this.children = [ this.playAreaBoundsRectangle, ...this.children ];
  }

  public override reset(): void {
    super.reset();
    this.visibleProperties.reset();
  }
}
