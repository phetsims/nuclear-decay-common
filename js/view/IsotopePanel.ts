// Copyright 2026, University of Colorado Boulder
/**
 * Panel that holds the isotope selector as well as a legend for the particles in the nucleus,
 * showing the different types of particles and their colors.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import HSeparator from '../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../shred/js/AtomNameUtils.js';
import type { AquaRadioButtonGroupItem } from '../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Isotope from '../model/Isotope.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';
import ParticlesLegendNode from './ParticlesLegendNode.js';

type SelfOptions = EmptySelfOptions;

export type IsotopePanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class IsotopePanel extends NuclearDecayPanel {
  public constructor( model: NuclearDecayModel, providedOptions?: IsotopePanelOptions ) {
    const options = optionize<IsotopePanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    const titleNode = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    // TODO: These should be populated from the model.possibleIsotopes or something https://github.com/phetsims/alpha-decay/issues/3
    const isotope = model.selectedIsotopeProperty.value;
    const customIsotope = new Isotope( 1, 1 );
    const radioButtonItems: AquaRadioButtonGroupItem<Isotope>[] = [
      {
        value: isotope,
        createNode: () => new RichText( AtomNameUtils.getNameAndMass(
          isotope.protonCountProperty.value,
          isotope.neutronCountProperty.value
        ), {
          font: NuclearDecayCommonConstants.CONTROL_FONT,
          maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
        } )
      },
      {
        value: customIsotope,
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

    const contentsNode = new VBox( {
      spacing: 10,
      align: 'left',
      children: [
        titleNode,
        isotopeSelectorRadioButtonGroup,
        new HSeparator(),
        new ParticlesLegendNode()
      ]
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'IsotopePanel', IsotopePanel );
