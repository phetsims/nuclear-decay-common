// Copyright 2026, University of Colorado Boulder
/**
 * Panel that holds the isotope selector as well as a legend for the particles in the nucleus,
 * showing the different types of particles and their colors.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import HSeparator from '../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import type { AquaRadioButtonGroupItem } from '../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../sun/js/VerticalAquaRadioButtonGroup.js';
import NuclearDecayModel, { ValidIsotopes } from '../model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';
import ParticlesLegendNode from './ParticlesLegendNode.js';

type SelfOptions = {
  // The second screen has additional checkboxes in the middle of the panel
  middleContent?: Node[] | null;
};

export type IsotopeControlPanelOptions = SelfOptions & WithRequired<NuclearDecayPanelOptions, 'tandem'>;

export default class IsotopeControlPanel extends NuclearDecayPanel {
  public constructor( model: NuclearDecayModel, providedOptions?: IsotopeControlPanelOptions ) {
    const options = optionize<IsotopeControlPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH,

      // Self Options
      middleContent: null
    }, providedOptions );

    const titleNode = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // Creating first the radio buttons for the normal isotopes and leaving custom for last
    const nonCustomIsotopes = model.selectableIsotopes.filter( isotope => isotope !== 'custom' );
    const radioButtonItems: AquaRadioButtonGroupItem<ValidIsotopes>[] = nonCustomIsotopes.map( isotope => {
      const atomConfig = NuclearDecayModel.getIsotopeAtomConfig( isotope );
      return {
        value: isotope,
        tandemName: AtomNameUtils.getNonLocalizedName( atomConfig.protonCount ) + 'RadioButton',
        createNode: () => new RichText( AtomNameUtils.getNameAndMass(
          atomConfig.protonCount,
          atomConfig.neutronCount
        ), {
          font: NuclearDecayCommonConstants.CONTROL_FONT,
          maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
        } )
      };

    } );

    // Adding custom at the end of the options
    radioButtonItems.push(
      {
        value: 'custom',
        tandemName: 'customRadioButton',
        createNode: () => new RichText( NuclearDecayCommonFluent.customStringProperty, {
          font: NuclearDecayCommonConstants.CONTROL_FONT,
          maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
        } )
      }
    );

    const isotopeSelectorRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      model.selectedIsotopeProperty,
      radioButtonItems, {
        spacing: 10,
        tandem: options.tandem.createTandem( 'isotopeSelectorRadioButtonGroup' )
      }
    );

    let children: Node[];
    if ( options.middleContent ) {
      children = [
        titleNode,
        isotopeSelectorRadioButtonGroup,
        new HSeparator(),
        ...options.middleContent,
        new HSeparator(),
        new ParticlesLegendNode()
      ];
    }
    else {
      children = [
        titleNode,
        isotopeSelectorRadioButtonGroup,
        new HSeparator(),
        new ParticlesLegendNode()
      ];
    }

    const contentsNode = new VBox( {
      spacing: 10,
      align: 'left',
      children: children
    } );

    super( contentsNode, options );
  }
}
