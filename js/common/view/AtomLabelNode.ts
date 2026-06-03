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
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';

type SelfOptions = {
  font?: PhetFont;
};

export type AtomLabelNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

const DISPLAY_DURATION = NuclearDecayCommonConstants.NORMAL_SPEED_SCALE; // seconds
const PADDING = 5; // px inside the background rectangle

export default class AtomLabelNode extends Node {

  private readonly labelBackground: Rectangle;
  private timeSinceDecay = 0;
  private wasDecayed = false;
  private labelText: RichText;
  private readonly updateBackground: ( dt: number ) => void;

  public constructor( private decayingAtom: NuclearDecayAtom, providedOptions?: AtomLabelNodeOptions ) {

    const options = optionize<AtomLabelNodeOptions, SelfOptions, NodeOptions>()( {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT
    }, providedOptions );

    const labelText = new RichText( '', {
      font: options.font,
      fill: NuclearDecayCommonColors.undecayedProperty
    } );

    // Create the background.  The initial size is arbitrary and will update with the label size.
    const labelBackground = new Rectangle( 0, 0, 1, 1, {
      fill: 'yellow',
      cornerRadius: 5,
      opacity: 0,
      stroke: 'orange'
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

    this.updateBackground = dt => {
      const isDecayed = decayingAtom.hasDecayed;

      // If it just decayed, start the opacity counter
      if ( isDecayed && !this.wasDecayed ) {
        this.updateLabelText();

        this.timeSinceDecay = 0;
        this.labelBackground.opacity = 1;
      }
      if ( !isDecayed && this.wasDecayed ) {

        // If it undecayed (a reset for example)
        this.updateLabelText();
        this.labelBackground.opacity = 0;
      }

      if ( isDecayed && this.timeSinceDecay < DISPLAY_DURATION ) {
        this.timeSinceDecay += dt;
        this.labelBackground.opacity = 1;
      }
      else {
        this.labelBackground.opacity = 0;
      }

      this.wasDecayed = isDecayed;
    };

    // Since we're not using properties inside of atoms, we have to listen to the stepping to know when it decays.
    // decayingAtom.steppedEmitter.addListener( this.updateBackground );
    decayingAtom.steppedEmitter.addListener( dt => this.update( dt ) );
  }

  public update( dt: number ): void {
    this.updateLabelText();
    this.updateBackground( dt );
  }

  public updateLabelText(): void {
    this.labelText.string = NuclearDecayAtom.getIsotopeMassAndSymbolString( this.decayingAtom.isotope );
    this.labelText.center = this.labelBackground.center;

    this.labelText.fill = this.decayingAtom.hasDecayed ?
                          NuclearDecayCommonColors.decayedProperty :
                          NuclearDecayCommonColors.undecayedProperty;
  }

  public reset(): void {
    this.labelBackground.opacity = 0;
    this.timeSinceDecay = 0;
    this.wasDecayed = false;
    this.updateLabelText();
  }
}
