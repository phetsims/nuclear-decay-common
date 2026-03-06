// Copyright 2026, University of Colorado Boulder
/**
 * Panel that displays the half-life information for the current isotope.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import nuclearDecayCommon from '../nuclearDecayCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Text from '../../../scenery/js/nodes/Text.js';
import NuclearDecayPanel, { NuclearDecayPanelOptions } from './NuclearDecayPanel.js';

type SelfOptions = EmptySelfOptions;

export type HalfLifePanelOptions = SelfOptions & NuclearDecayPanelOptions;

export default class HalfLifePanel extends NuclearDecayPanel {
  public constructor( providedOptions?: HalfLifePanelOptions ) {
    const options = optionize<HalfLifePanelOptions, SelfOptions, NuclearDecayPanelOptions>()( {
      // Default options go here
    }, providedOptions );

    // TO BE IMPLEMENTED
    const contentsNode = new Text( 'Hola' );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'HalfLifePanel', HalfLifePanel );
