// Copyright 2026, University of Colorado Boulder

/**
 * AtomLabelNode displays the isotope mass and symbol above a nucleus. The text is always visible;
 * the yellow rounded-rectangle background flashes in at full opacity when the atom decays and fades
 * out to transparent over DISPLAY_DURATION seconds.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayAtom, { StartingIsotopes } from '../model/NuclearDecayAtom.js';

type SelfOptions = EmptySelfOptions;

export type AtomLabelNodeOptions = SelfOptions & NodeOptions;

const DISPLAY_DURATION = NuclearDecayCommonConstants.NORMAL_SPEED_SCALE; // seconds
const PADDING = 5; // px inside the background rectangle

export default class AtomLabelNode extends Node {
  private readonly labelBackground: Rectangle;
  private timeSinceDecay = 0;
  private wasDecayed = false;
  private labelText: RichText;

  public constructor(
    private decayingAtom: NuclearDecayAtom,
    selectedIsotopeProperty: TReadOnlyProperty<StartingIsotopes>,
    providedOptions?: AtomLabelNodeOptions
  ) {

    const labelText = new RichText( '', {
      font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
      fill: NuclearDecayCommonColors.undecayedProperty
    } );

    const labelBackground = new Rectangle(
      0, 0, 50, labelText.height + 2 * PADDING,
      { fill: 'yellow', cornerRadius: 15, opacity: 0, stroke: 'orange' }
    );

    const options = optionize<AtomLabelNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ labelBackground, labelText ]
    }, providedOptions );

    super( options );

    this.labelBackground = labelBackground;
    this.labelText = labelText;

    selectedIsotopeProperty.link( () => this.updateLabelText() );

    // Since we're not using properties inside of atoms,
    // we have to listen to the stepping to know when it decays
    decayingAtom.steppedEmitter.addListener( dt => {
      if ( decayingAtom.isActive ) {
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
      }
      else {
        this.visible = false;
        this.updateLabelText();
      }
    } );
  }

  public updatePosition( position: Bounds2 ): void {
    this.centerX = position.centerX;
    this.bottom = position.centerY - NuclearDecayCommonConstants.LABEL_ATOM_GAP;
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
