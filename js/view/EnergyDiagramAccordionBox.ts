// Copyright 2026, University of Colorado Boulder
/**
 * AccordionBox that holds the EnergyDiagram title as well as the alpha particle energy diagram.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Text from '../../../scenery/js/nodes/Text.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';
import NuclearDecayAccordionBox, { NuclearDecayAccordionBoxOptions } from './NuclearDecayAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type EnergyDiagramAccordionBoxOptions = SelfOptions & NuclearDecayAccordionBoxOptions;

export default class EnergyDiagramAccordionBox extends NuclearDecayAccordionBox {
  public constructor( providedOptions?: EnergyDiagramAccordionBoxOptions ) {
    const options = optionize<EnergyDiagramAccordionBoxOptions, SelfOptions, NuclearDecayAccordionBoxOptions>()( {
      // Default options go here
    }, providedOptions );

    // TO BE IMPLEMENTED
    const contentsNode = new Text( NuclearDecayCommonFluent.alphaParticleEnergyStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    super( contentsNode, options );
  }
}

nuclearDecayCommon.register( 'EnergyDiagramAccordionBox', EnergyDiagramAccordionBox );
