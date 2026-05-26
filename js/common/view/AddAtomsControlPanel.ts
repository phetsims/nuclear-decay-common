// Copyright 2026, University of Colorado Boulder
/**
 * Panel that allows users to select number of atoms and add them to the play area.
 * Shows the isotope name as a title and provides arrow buttons for navigation,
 * a number display, and an "Add" button.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ArrowButton, { ArrowButtonOptions } from '../../../../sun/js/buttons/ArrowButton.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayModel, { SelectableIsotopes } from '../model/NuclearDecayModel.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = {
  stepSize?: number;
};

export type AddAtomsControlPanelOptions = SelfOptions & WithRequired<NuclearDecayPanelOptions, 'tandem'>;

export default class AddAtomsControlPanel extends NuclearDecayPanel {
  public constructor(
    atomsToAddProperty: NumberProperty,
    selectedIsotopeProperty: TReadOnlyProperty<SelectableIsotopes>,
    addAtomsCallback: ( n: number ) => void,
    providedOptions?: AddAtomsControlPanelOptions
  ) {
    const options = optionize<AddAtomsControlPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      stepSize: 10
    }, providedOptions );

    const maxAtoms = atomsToAddProperty.rangeProperty.value.max;

    const isotopeDynamicNameProperty = NuclearDecayModel.createDynamicIsotopeNameAndMassStringProperty(
      selectedIsotopeProperty,
      NuclearDecayCommonFluent.customStringProperty
    );

    const titleText = new RichText( isotopeDynamicNameProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Arrow buttons for navigating isotopes
    // Double arrows skip by element (proton count), single arrows step by isotope (neutron count)
    const ARROW_BUTTON_OPTIONS = {
      arrowHeight: 12,
      arrowWidth: 12,
      xMargin: 5,
      yMargin: 5
    };
    const DOUBLE_ARROW_BUTTON_OPTIONS = {
      arrowHeight: 12,
      arrowWidth: 12,
      xMargin: 5,
      yMargin: 5,
      numberOfArrows: 2,
      arrowSpacing: -7
    };
    const stepSizeStringProperty = new Property( `${options.stepSize}` );

    const doubleLeftArrowButton = new ArrowButton( 'left', () => {
      atomsToAddProperty.value = Math.max( 1, atomsToAddProperty.value - options.stepSize );
    }, combineOptions<ArrowButtonOptions>( DOUBLE_ARROW_BUTTON_OPTIONS, {
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.numberOfAtomsControl.decreaseSampleByStepSize.createProperty( {
        stepSize: stepSizeStringProperty
      } ),
      tandem: options.tandem.createTandem( 'doubleLeftArrowButton' ),
      enabledProperty: atomsToAddProperty.derived( atoms => atoms > atomsToAddProperty.rangeProperty.value.min )
    } ) );

    const singleLeftArrowButton = new ArrowButton( 'left', () => {
      atomsToAddProperty.value = Math.max( 1, atomsToAddProperty.value - 1 );
    }, combineOptions<ArrowButtonOptions>( ARROW_BUTTON_OPTIONS, {
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.numberOfAtomsControl.decreaseSampleByOneStringProperty,
      tandem: options.tandem.createTandem( 'singleLeftArrowButton' ),
      enabledProperty: atomsToAddProperty.derived( atoms => atoms > atomsToAddProperty.rangeProperty.value.min )
    } ) );

    const singleRightArrowButton = new ArrowButton( 'right', () => {
      atomsToAddProperty.value = Math.min( maxAtoms, atomsToAddProperty.value + 1 );
    }, combineOptions<ArrowButtonOptions>( ARROW_BUTTON_OPTIONS, {
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.numberOfAtomsControl.increaseSampleByOneStringProperty,
      tandem: options.tandem.createTandem( 'singleRightArrowButton' ),
      enabledProperty: atomsToAddProperty.derived( atoms => atoms < atomsToAddProperty.rangeProperty.value.max )
    } ) );

    const doubleRightArrowButton = new ArrowButton( 'right', () => {
      atomsToAddProperty.value = Math.min( maxAtoms, atomsToAddProperty.value + options.stepSize );
    }, combineOptions<ArrowButtonOptions>( DOUBLE_ARROW_BUTTON_OPTIONS, {
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.numberOfAtomsControl.increaseSampleByStepSize.createProperty( {
        stepSize: stepSizeStringProperty
      } ),
      tandem: options.tandem.createTandem( 'doubleRightArrowButton' ),
      enabledProperty: atomsToAddProperty.derived( atoms => atoms < atomsToAddProperty.rangeProperty.value.max )
    } ) );

    // Number display showing atom count
    const numberDisplay = new NumberDisplay( atomsToAddProperty, atomsToAddProperty.rangeProperty.value );

    // Add button
    const addButton = new TextPushButton( NuclearDecayCommonFluent.addStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      baseColor: NuclearDecayCommonColors.addButtonProperty,
      listener: () => {
        addAtomsCallback( atomsToAddProperty.value );
      },
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.addAtomsButton.accessibleNameStringProperty,
      tandem: options.tandem.createTandem( 'addButton' )
    } );

    // Bottom row: arrows, display, and add button
    const controlsRow = new HBox( {
      spacing: 20,
      align: 'center',
      children: [
        new HBox( {
          spacing: 4,
          children: [
            doubleLeftArrowButton,
            singleLeftArrowButton,
            numberDisplay,
            singleRightArrowButton,
            doubleRightArrowButton
          ]
        } ),
        addButton
      ]
    } );

    // Main layout: title on top, controls below
    const contentNode = new VBox( {
      spacing: 8,
      xMargin: 20,
      align: 'left',
      children: [ titleText, controlsRow ]
    } );

    super( contentNode, options );
  }
}