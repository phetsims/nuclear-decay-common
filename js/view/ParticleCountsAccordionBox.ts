// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the ParticleCounts title as well as the number of particles in the nucleus.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import nuclearDecayCommon from '../nuclearDecayCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Text from '../../../scenery/js/nodes/Text.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type ParticleCountsAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class ParticleCountsAccordionBox extends NuclearDecayAccordionBox {
  public constructor( providedOptions?: ParticleCountsAccordionBoxOptions ) {
    const options = optionize<ParticleCountsAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      minWidth: NuclearDecayCommonConstants.RIGHT_PANEL_WIDTH
    }, providedOptions );

    // TO BE IMPLEMENTED
    const contentsNode = new Text( 'Hola' );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'ParticleCountsAccordionBox', ParticleCountsAccordionBox );
