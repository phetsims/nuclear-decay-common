// Copyright 2026, University of Colorado Boulder
/**
 * Panel that holds the isotope selector as well as a legend for the particles in the nucleus,
 * showing the different types of particles and their colors.
 *
 * @author Agustín Vallejo
 */

import nuclearDecayCommon from '../nuclearDecayCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Panel, { PanelOptions } from '../../../sun/js/Panel.js';
import Node from '../../../scenery/js/nodes/Node.js';

type SelfOptions = EmptySelfOptions;

export type ParticleLegendPanelOptions = SelfOptions & PanelOptions;

export default class IsotopePanel extends Panel {
  public constructor( providedOptions: ParticleLegendPanelOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, ParticleLegendPanelOptions>()( {
      // Default options go here
    }, providedOptions );

    // TO BE IMPLEMENTED
    const contentsNode = new Node();

    super( contentsNode, options );
    //nop
  }
}

nuclearDecayCommon.register( 'IsotopePanel', IsotopePanel );