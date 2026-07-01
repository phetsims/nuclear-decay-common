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
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayAtom, { StartingIsotopes } from '../model/NuclearDecayAtom.js';
import ArrowWithTailButton from './ArrowWithTailButton.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = {
  stepSize?: number;
  atomIcon?: Node;
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
      stepSize: 10,
      atomIcon: new Node()
    }, providedOptions );

    const isotopeDynamicNameProperty = NuclearDecayAtom.createDynamicIsotopeNameAndMassStringProperty(
      selectedIsotopeProperty,
      NuclearDecayCommonFluent.customStringProperty
    );

    const titleText = new RichText( isotopeDynamicNameProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const titleRow = new HBox( {
      spacing: 10,
      children: [ options.atomIcon, titleText ]
    } );

    const numberOfAtomsSpinner = new FineCoarseSpinner( atomsToAddProperty, {
      deltaFine: 1,
      deltaCoarse: options.stepSize,
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.numberOfAtomsControl.accessibleName.createProperty( {
        isotope: isotopeDynamicNameProperty
      } ),
      accessibleHelpText: NuclearDecayCommonFluent.a11y.multipleAtoms.setSampleControl.accessibleHelpTextStringProperty,
      tandem: options.tandem.createTandem( 'numberOfAtomsSpinner' )
    } );

    const setSampleButton = new ArrowWithTailButton( {
      arrowRotation: Math.PI / 2,
      baseColor: NuclearDecayCommonColors.setSampleButtonProperty,
      soundPlayer: sharedSoundPlayers.get( 'pushButton' ),
      enabledProperty: atomsToAddProperty.derived( value => value !== 0 ),
      listener: () => {
        addAtomsCallback( atomsToAddProperty.value );
        this.addAccessibleContextResponse( NuclearDecayCommonFluent.a11y.multipleAtoms.setSampleControl.contextResponse.format( {
          isotope: NuclearDecayAtom.getNameAndMassString( selectedIsotopeProperty.value, NuclearDecayCommonFluent.isotopeAStringProperty.value ),
          value: atomsToAddProperty.value
        } ) );
      },
      accessibleName: NuclearDecayCommonFluent.a11y.multipleAtoms.setSampleControl.accessibleNameStringProperty,
      tandem: options.tandem.createTandem( 'setSampleButton' )
    } );

    const leftBox = new VBox( {
      spacing: 8,
      align: 'left',
      children: [ titleRow, numberOfAtomsSpinner ]
    } );

    const contentNode = new HBox( {
      xMargin: 10,
      align: 'center',
      children: [ leftBox, setSampleButton ]
    } );

    super( contentNode, options );
  }
}
