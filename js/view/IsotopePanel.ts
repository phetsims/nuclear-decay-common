// Copyright 2026, University of Colorado Boulder
/**
 * Panel that holds the isotope selector as well as a legend for the particles in the nucleus,
 * showing the different types of particles and their colors.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Text from '../../../scenery/js/nodes/Text.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = EmptySelfOptions;

export type IsotopePanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class IsotopePanel extends NuclearDecayPanel {
  public constructor( providedOptions?: IsotopePanelOptions ) {
    const options = optionize<IsotopePanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    const contentsNode = new Text( NuclearDecayCommonFluent.isotopeStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'IsotopePanel', IsotopePanel );
