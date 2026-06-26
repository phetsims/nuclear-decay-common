// Copyright 2026, University of Colorado Boulder
/**
 * Legend for the energy diagram graph
 *
 * @author Agustín Vallejo
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';

type SelfOptions = EmptySelfOptions;

export type EnergyDiagramLegendNodeOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

const LEGEND_LINE_LENGTH = 22;

export default class EnergyDiagramLegendNode extends VBox {
  public constructor(
    hasDecayOccurredProperty: TReadOnlyProperty<boolean>,
    providedOptions: EnergyDiagramLegendNodeOptions ) {

    const options = optionize<EnergyDiagramLegendNodeOptions, SelfOptions, VBoxOptions>()( {
      spacing: 2,
      align: 'left'
    }, providedOptions );

    // Legend lines and labels

    const alphaParticleEnergyLegendLine = new Line( 0, 0, LEGEND_LINE_LENGTH, 0, {
        stroke: NuclearDecayCommonColors.alphaParticleEnergyColorProperty,
        lineWidth: 2
      }
    );

    const alphaParticleEnergyLabel = new Text( NuclearDecayCommonFluent.alphaParticleEnergyStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    const potentialEnergyLegendLine = new Line( 0, 0, LEGEND_LINE_LENGTH, 0, {
        stroke: NuclearDecayCommonColors.potentialEnergyProperty,
        lineWidth: 4
      }
    );

    const potentialEnergyLabel = new Text( NuclearDecayCommonFluent.potentialEnergyStringProperty, {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
    } );

    options.children = [
      new HBox( {
        spacing: 6,
        children: [ alphaParticleEnergyLegendLine, alphaParticleEnergyLabel ]
      } ),
      new HBox( {
        spacing: 6,
        children: [ potentialEnergyLegendLine, potentialEnergyLabel ]
      } )
    ];

    super( options );

  }
}