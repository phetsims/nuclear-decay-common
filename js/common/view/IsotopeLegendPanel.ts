// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays a legend of isotopes, showing each isotope's mass-symbol notation and name.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AtomNameUtils from '../../../../shred/js/AtomNameUtils.js';
import AtomConfig from '../../../../shred/js/model/AtomConfig.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = {
  includeAtomRepresentation?: boolean;
};

export type IsotopeLegendPanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class IsotopeLegendPanel extends NuclearDecayPanel {
  public constructor( atomConfigs: AtomConfig[], providedOptions?: IsotopeLegendPanelOptions ) {
    const options = optionize<IsotopeLegendPanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      includeAtomRepresentation: false
    }, providedOptions );

    const rows = atomConfigs.map( ( atomConfig, index ) => {

      const massAndSymbol = AtomNameUtils.getMassAndSymbol( atomConfig.protonCount, atomConfig.neutronCount );
      const nameAndMassProperty = AtomNameUtils.getNameAndMass( atomConfig.protonCount, atomConfig.neutronCount );

      const atomFill = index === 0 ? NuclearDecayCommonColors.undecayedProperty : 'black';

      const massSymbolText = new RichText( `${massAndSymbol}:`, {
        font: NuclearDecayCommonConstants.CONTROL_FONT,
        fill: atomFill
      } );

      const nameText = new Text( nameAndMassProperty, {
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
