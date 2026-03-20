// Copyright 2026, University of Colorado Boulder
/**
 * Panel that holds the isotope selector as well as a legend for the particles in the nucleus,
 * showing the different types of particles and their colors.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
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

export type IsotopePanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class IsotopePanel extends NuclearDecayPanel {
  public constructor( model: NuclearDecayModel, providedOptions?: IsotopePanelOptions ) {
    const options = optionize<IsotopePanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH,

      // Self Options
      middleContent: null
    }, providedOptions );

    const titleNode = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // TODO: These should be populated from the model.possibleIsotopes or something https://github.com/phetsims/alpha-decay/issues/3
    const polonium = NuclearDecayCommonConstants.POLONIUM_211;
    const radioButtonItems: AquaRadioButtonGroupItem<ValidIsotopes>[] = [
      {
        value: 'polonium-211',
        createNode: () => new RichText( AtomNameUtils.getNameAndMass(
          polonium.protonCount,
          polonium.neutronCount
        ), {
          font: NuclearDecayCommonConstants.CONTROL_FONT,
          maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
        } )
      },
      {
        value: 'custom',
        createNode: () => new RichText( NuclearDecayCommonFluent.customStringProperty, {
          font: NuclearDecayCommonConstants.CONTROL_FONT,
          maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
        } )
      }
    ];
    const isotopeSelectorRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      model.selectedIsotopeProperty,
      radioButtonItems
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
