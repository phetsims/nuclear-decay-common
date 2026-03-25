// Copyright 2026, University of Colorado Boulder
/**
 * Panel that allows users to navigate between isotopes and add atoms to the play area.
 * Shows the isotope name as a title and provides arrow buttons for navigation,
 * a number display, and an "Add" button.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import ArrowButton from '../../../sun/js/buttons/ArrowButton.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = EmptySelfOptions;

export type AddAtomsControlPanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class AddAtomsControlPanel extends NuclearDecayPanel {
  public constructor( model: NuclearDecayModel, providedOptions?: AddAtomsControlPanelOptions ) {
    const options = optionize<AddAtomsControlPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      // Default options
    }, providedOptions );

    // TODO: Wire to model property https://github.com/phetsims/alpha-decay/issues/3
    const atomCountProperty = new NumberProperty( 10 );

    // Title showing the selected isotope name with a colored background
    // TODO: Dynamic strings https://github.com/phetsims/alpha-decay/issues/3
    const isotopeNameProperty = model.selectedIsotopeProperty.derived( isotope => {
      if ( isotope === 'custom' ) {
        return NuclearDecayCommonFluent.customStringProperty.value;
      }
      else {
        const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
        return AtomNameUtils.getNameAndMass( atomConfig.protonCount, atomConfig.neutronCount ).value;
      }
    } );
    const titleText = new RichText( isotopeNameProperty, {
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
    const doubleLeftArrowButton = new ArrowButton( 'left', () => {
      atomCountProperty.value = Math.max( 1, atomCountProperty.value - 10 );
    }, DOUBLE_ARROW_BUTTON_OPTIONS );

    const singleLeftArrowButton = new ArrowButton( 'left', () => {
      atomCountProperty.value = Math.max( 1, atomCountProperty.value - 1 );
    }, ARROW_BUTTON_OPTIONS );

    const singleRightArrowButton = new ArrowButton( 'right', () => {
      atomCountProperty.value = Math.min( 100, atomCountProperty.value + 1 );
    }, ARROW_BUTTON_OPTIONS );

    const doubleRightArrowButton = new ArrowButton( 'right', () => {
      atomCountProperty.value = Math.min( 100, atomCountProperty.value + 10 );
    }, DOUBLE_ARROW_BUTTON_OPTIONS );

    // Number display showing atom count
    const numberDisplay = new NumberDisplay( atomCountProperty, atomCountProperty.rangeProperty.value );

    // Add button
    const addButton = new TextPushButton( NuclearDecayCommonFluent.addAtomStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      baseColor: 'orange',
      listener: () => {
        _.times( atomCountProperty.value, () => {
          model.addAtom();
        } );
      }
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