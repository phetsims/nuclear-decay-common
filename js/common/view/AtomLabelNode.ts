// Copyright 2026, University of Colorado Boulder

/**
 * AtomLabelNode displays the atom's mass and symbol above a nucleus. The text is always visible; the yellow rounded
 * rectangle background flashes in at full opacity when the atom decays and fades out to transparent over
 * a specified number of seconds.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayAtom, { ISOTOPE_TO_COLOR } from '../model/NuclearDecayAtom.js';

type SelfOptions = {
  font?: PhetFont;
};

export type AtomLabelNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

const DISPLAY_DURATION = NuclearDecayCommonConstants.NORMAL_SPEED_SCALE; // seconds
const PADDING = 5; // px inside the background rectangle

export default class AtomLabelNode extends Node {

  private readonly labelBackground: Rectangle;
  private wasDecayed = false;
  private labelText: RichText;
  private readonly updateBackground: () => void;

  public constructor(
    private decayingAtom: NuclearDecayAtom,
    providedOptions?: AtomLabelNodeOptions ) {

    const options = optionize<AtomLabelNodeOptions, SelfOptions, NodeOptions>()( {
      font: NuclearDecayCommonConstants.SMALL_LABEL_BOLD_FONT
    }, providedOptions );

    const labelText = new RichText( '', {
      font: options.font
    } );

    // Create the background.  The initial size is arbitrary and will update with the label size.
    const labelBackground = new Rectangle( 0, 0, 1, 1, {
      fill: NuclearDecayCommonColors.labelHighlightProperty,
      cornerRadius: 5,
      opacity: 0,
      stroke: NuclearDecayCommonColors.labelHighlightBorderProperty
    } );

    // Update the background size as the text changes.
    labelText.localBoundsProperty.link( labelTextBounds => {
      const width = labelTextBounds.width + PADDING;
      const height = labelTextBounds.height + PADDING;
      labelBackground.setRect( -width / 2, -height / 2, width, height );
    } );

    options.children = [ labelBackground, labelText ];

    super( options );

    this.labelBackground = labelBackground;
    this.labelText = labelText;

    this.updateBackground = () => {
      const isDecayed = decayingAtom.hasDecayed;

      // If it just decayed, start the opacity counter
      if ( isDecayed !== this.wasDecayed ) {
        this.updateLabelText();
      }

      const timeSinceDecay = decayingAtom.time - decayingAtom.decayTime!;
      this.labelBackground.opacity = isDecayed && timeSinceDecay < DISPLAY_DURATION ? 1 : 0;

      this.wasDecayed = isDecayed;
    };

    // Since we're not using properties inside of atoms, we have to listen to the stepping to know when it decays.
    // decayingAtom.steppedEmitter.addListener( this.updateBackground );
    decayingAtom.steppedEmitter.addListener( () => this.update() );
  }

  public update(): void {
    this.updateLabelText();
    this.updateBackground();
  }

  public updateLabelText(): void {
    this.labelText.string = NuclearDecayAtom.getIsotopeMassAndSymbolString( this.decayingAtom.isotope );
    this.labelText.center = this.labelBackground.center;
    this.labelText.fill = this.decayingAtom.hasDecayed ?
                          NuclearDecayCommonColors.decayedProperty :
                          ISOTOPE_TO_COLOR.get( this.decayingAtom.isotope )!;
  }

  public reset(): void {
    this.labelBackground.opacity = 0;
    this.wasDecayed = false;
    this.updateLabelText();
  }
}
