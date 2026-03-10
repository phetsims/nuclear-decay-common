// Copyright 2026, University of Colorado Boulder
/**
 * Panel that holds the isotope selector as well as a legend for the particles in the nucleus,
 * showing the different types of particles and their colors.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HSeparator from '../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import type { AquaRadioButtonGroupItem } from '../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Isotope from '../model/Isotope.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonColors from '../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = EmptySelfOptions;

export type IsotopePanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class IsotopePanel extends NuclearDecayPanel {
  public constructor( model: NuclearDecayModel, providedOptions?: IsotopePanelOptions ) {
    const options = optionize<IsotopePanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    const titleNode = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    // TODO: These should be populated from the model.possibleIsotopes or something https://github.com/phetsims/alpha-decay/issues/3
    const isotope = model.selectedIsotopeProperty.value;
    const customIsotope = new Isotope( 1, 1 );
    const radioButtonItems: AquaRadioButtonGroupItem<Isotope>[] = [
      {
        value: isotope,
        createNode: () => new RichText( isotope.isotopeNameStringProperty, {
          font: new PhetFont( { size: 18 } ),
          fill: NuclearDecayCommonColors.pinkProperty
        } )
      },
      {
        value: customIsotope,
        createNode: () => new RichText( NuclearDecayCommonFluent.customStringProperty, {
          font: new PhetFont( { size: 18 } ),
          fill: NuclearDecayCommonColors.blueProperty
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
        new HSeparator()
      ]
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'IsotopePanel', IsotopePanel );
