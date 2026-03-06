// Copyright 2026, University of Colorado Boulder
/**
 * Base AccordionBox for Nuclear Decay simulations, providing common styling defaults.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import AccordionBox, { AccordionBoxOptions } from '../../../sun/js/AccordionBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';

type SelfOptions = EmptySelfOptions;

export type NuclearDecayAccordionBoxOptions = SelfOptions & AccordionBoxOptions;

export default class NuclearDecayAccordionBox extends AccordionBox {
  public constructor( contentNode: Node, providedOptions?: NuclearDecayAccordionBoxOptions ) {
    const options = optionize<NuclearDecayAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      titleAlignX: 'left',
      cornerRadius: 5,
      titleXMargin: NuclearDecayCommonConstants.PANEL_X_MARGIN,
      titleYMargin: NuclearDecayCommonConstants.PANEL_Y_MARGIN,
      buttonXMargin: NuclearDecayCommonConstants.PANEL_X_MARGIN,
      buttonYMargin: NuclearDecayCommonConstants.PANEL_Y_MARGIN
    }, providedOptions );

    super( contentNode, options );
  }
}

nuclearDecayCommon.register( 'NuclearDecayAccordionBox', NuclearDecayAccordionBox );
