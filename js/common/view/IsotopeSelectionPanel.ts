// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays a legend of isotopes, showing each isotope's mass-symbol notation and name.
 * When a selectedIsotopeProperty is provided, the first two rows update reactively: row 0 tracks
 * the selected isotope and row 1 tracks its decay product. When 'custom' is selected, row 0
 * shows "A: Custom Isotope" and row 1 shows "B: Decayed Isotope".
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../../shred/js/AtomNameUtils.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayAtom, { StartingIsotopes, ValidIsotopes } from '../model/NuclearDecayAtom.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = {
  includeAtomRepresentation?: boolean;
  selectedIsotopeProperty?: TReadOnlyProperty<StartingIsotopes> | null;
};

export type IsotopeSelectionPanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class IsotopeSelectionPanel extends NuclearDecayPanel {
  public constructor( isotopes: ValidIsotopes[], providedOptions?: IsotopeSelectionPanelOptions ) {
    const options = optionize<IsotopeSelectionPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      includeAtomRepresentation: false,
      selectedIsotopeProperty: null
    }, providedOptions );

    const selectedIsotopeProperty = options.selectedIsotopeProperty;

    const rows = isotopes.map( ( isotope, index ) => {
      const isParentRow = index === 0;

      // Mass-symbol string (e.g., "²¹¹Po:" or "A:"), reactive when selectedIsotopeProperty is provided.
      let massSymbolSource: string | TReadOnlyProperty<string>;
      if ( selectedIsotopeProperty ) {
        if ( isParentRow ) {
          massSymbolSource = new DerivedProperty(
            [ selectedIsotopeProperty ],
            iso => `${NuclearDecayAtom.getIsotopeMassAndSymbolString( iso )}:`
          );
        }
        else {
          massSymbolSource = new DerivedProperty(
            [ selectedIsotopeProperty ],
            iso => `${NuclearDecayAtom.getIsotopeMassAndSymbolString( NuclearDecayAtom.getDecayProduct( iso ) )}:`
          );
        }
      }
      else {
        massSymbolSource = `${NuclearDecayAtom.getIsotopeMassAndSymbolString( isotope )}:`;
      }

      // Name source (e.g., "Polonium-211" or "Custom Isotope"), reactive when selectedIsotopeProperty is provided.
      let nameSource: string | TReadOnlyProperty<string>;
      if ( selectedIsotopeProperty ) {
        if ( isParentRow ) {
          nameSource = NuclearDecayAtom.createDynamicIsotopeNameAndMassStringProperty(
            selectedIsotopeProperty,
            NuclearDecayCommonFluent.customIsotopeStringProperty
          );
        }
        else {
          nameSource = NuclearDecayAtom.createDynamicDecayProductNameAndMassStringProperty(
            selectedIsotopeProperty,
            NuclearDecayCommonFluent.decayedIsotopeStringProperty
          );
        }
      }
      else {
        const atomConfig = NuclearDecayAtom.getIsotopeAtomConfig( isotope );
        nameSource = AtomNameUtils.getNameAndMass( atomConfig.protonCount, atomConfig.neutronCount );
      }

      // Color: row 0 switches between polonium/isotopeA colors when selectedIsotopeProperty is present.
      let atomFill;
      if ( selectedIsotopeProperty && isParentRow ) {
        atomFill = new DerivedProperty(
          [ selectedIsotopeProperty, NuclearDecayCommonColors.poloniumColorProperty, NuclearDecayCommonColors.isotopeAColorProperty ],
          ( iso, poloniumColor, isotopeAColor ) => iso === 'custom' ? isotopeAColor : poloniumColor
        );
      }
      else if ( isParentRow ) {
        atomFill = NuclearDecayCommonColors.poloniumColorProperty;
      }
      else {
        atomFill = NuclearDecayCommonColors.decayedProperty;
      }

      const massSymbolText = new RichText( massSymbolSource, {
        font: NuclearDecayCommonConstants.CONTROL_FONT,
        fill: atomFill
      } );

      const nameText = new Text( nameSource, {
        font: NuclearDecayCommonConstants.CONTROL_FONT,
        fill: atomFill
      } );

      let atomRepresentation: Node;
      if ( options.includeAtomRepresentation ) {
        atomRepresentation = new Circle( nameText.height / 2, {
          fill: atomFill
        } );
      }
      else {
        atomRepresentation = new Node();
      }

      return new HBox( {
        spacing: 5,
        align: 'bottom',
        children: [ atomRepresentation, massSymbolText, nameText ]
      } );
    } );

    const content = new VBox( {
      spacing: 8,
      align: 'left',
      children: rows
    } );

    super( content, options );
  }
}
