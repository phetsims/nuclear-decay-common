// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the EnergyDiagram title as well as the number of particles in the nucleus.
 *
 * @author Agustín Vallejo
 */

import nuclearDecayCommon from '../nuclearDecayCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import AccordionBox, { AccordionBoxOptions } from '../../../sun/js/AccordionBox.js';
import Node from '../../../scenery/js/nodes/Node.js';

type SelfOptions = EmptySelfOptions;

export type ParticleLegendAccordionBoxOptions = SelfOptions & AccordionBoxOptions;

export default class EnergyDiagramAccordionBox extends AccordionBox {
  public constructor( providedOptions: ParticleLegendAccordionBoxOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, ParticleLegendAccordionBoxOptions>()( {
      // Default options go here
    }, providedOptions );

    // TO BE IMPLEMENTED
    const contentsNode = new Node();

    super( contentsNode, options );
    //nop
  }
}

nuclearDecayCommon.register( 'EnergyDiagramAccordionBox', EnergyDiagramAccordionBox );