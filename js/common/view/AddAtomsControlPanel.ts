// Copyright 2026, University of Colorado Boulder
/**
 * Panel that allows users to select number of atoms and add them to the play area.
 * Shows the isotope name as a title and provides arrow buttons for navigation,
 * a number display, and an "Add" button.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import FineCoarseSpinner from '../../../../scenery-phet/js/FineCoarseSpinner.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayAtom, { StartingIsotopes } from '../model/NuclearDecayAtom.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = {
  stepSize?: number;
};

export type AddAtomsControlPanelOptions = SelfOptions & WithRequired<NuclearDecayPanelOptions, 'tandem'>;

export default class AddAtomsControlPanel extends NuclearDecayPanel {
  public constructor(
    atomsToAddProperty: NumberProperty,
    selectedIsotopeProperty: TReadOnlyProperty<StartingIsotopes>,
    addAtomsCallback: ( n: number ) => void,
    providedOptions?: AddAtomsControlPanelOptions
  ) {
    const options = optionize<AddAtomsControlPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      stepSize: 10
    }, providedOptions );

    const isotopeDynamicNameProperty = NuclearDecayAtom.createDynamicIsotopeNameAndMassStringProperty(
      selectedIsotopeProperty,
      NuclearDecayCommonFluent.customStringProperty
    );

    const titleText = new RichText( isotopeDynamicNameProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const numberOfAtomsSpinner = new FineCoarseSpinner( atomsToAddProperty, {
      deltaFine: 1,
      deltaCoarse: options.stepSize,
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.numberOfAtomsControl.accessibleName.createProperty( {
        isotope: isotopeDynamicNameProperty
      } ),
      tandem: options.tandem.createTandem( 'numberOfAtomsSpinner' )
    } );

    const addButton = new TextPushButton( NuclearDecayCommonFluent.addStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      baseColor: NuclearDecayCommonColors.addButtonProperty,
      listener: () => {
        addAtomsCallback( atomsToAddProperty.value );
      },
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.addAtomsButton.accessibleNameStringProperty,
      tandem: options.tandem.createTandem( 'addButton' )
    } );

    const controlsRow = new HBox( {
      spacing: 20,
      align: 'center',
      children: [ numberOfAtomsSpinner, addButton ]
    } );

    const contentNode = new VBox( {
      spacing: 8,
      xMargin: 20,
      align: 'left',
      children: [ titleText, controlsRow ]
    } );

    super( contentNode, options );
  }
}
