// Copyright 2026, University of Colorado Boulder

/**
 * AtomLabelNode displays the atom's mass and symbol above a nucleus. The text is always visible; the yellow rounded
 * rectangle background flashes in at full opacity when the atom decays and disappears after a specified number of
 * seconds.
 *
 * The background is provided by the common-code Panel, which auto-sizes to fit the text. The decay "flash" is achieved
 * by driving Panel's fill and stroke with Properties that keep their color but become fully transparent when the
 * background should be hidden, which preserves the Panel's bounds.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayAtom, { ISOTOPE_TO_COLOR } from '../model/NuclearDecayAtom.js';

type SelfOptions = {
  font?: PhetFont;
};

export type AtomLabelNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

const DISPLAY_DURATION = NuclearDecayCommonConstants.NORMAL_SPEED_SCALE; // seconds

// Horizontal and vertical padding between the text and the edge of the background rectangle, in px.
const LABEL_X_MARGIN = 1.5;
const LABEL_Y_MARGIN = 0.5;

export default class AtomLabelNode extends Panel {

  private readonly labelText: RichText;
  private wasDecayed = false;

  // Whether the highlight background should currently be shown. When false, the background's fill and stroke keep their
  // color but go fully transparent, so the Panel's bounds are unaffected.
  private readonly backgroundVisibleProperty: BooleanProperty;

  public constructor(
    private decayingAtom: NuclearDecayAtom,
    providedOptions?: AtomLabelNodeOptions
  ) {

    // Drive the background's fill and stroke so that they flash in when the atom decays. Combining the visibility with
    // the profile colors (rather than snapshotting them) keeps the flash reactive to color-profile changes.
    const backgroundVisibleProperty = new BooleanProperty( false );
    const fillProperty = new DerivedProperty(
      [ backgroundVisibleProperty, NuclearDecayCommonColors.labelHighlightProperty ],
      ( visible, highlightColor ) => visible ? highlightColor : highlightColor.withAlpha( 0 )
    );
    const strokeProperty = new DerivedProperty(
      [ backgroundVisibleProperty, NuclearDecayCommonColors.labelHighlightBorderProperty ],
      ( visible, borderColor ) => visible ? borderColor : borderColor.withAlpha( 0 )
    );

    const options = optionize<AtomLabelNodeOptions, SelfOptions, PanelOptions>()( {
      font: NuclearDecayCommonConstants.SMALL_LABEL_BOLD_FONT,

      // Panel options
      fill: fillProperty,
      stroke: strokeProperty,
      cornerRadius: 5,
      xMargin: LABEL_X_MARGIN,
      yMargin: LABEL_Y_MARGIN,
      align: 'center'
    }, providedOptions );

    // Create the text. The original value is arbitrary since it will be updated later, and whenever changes to the
    // decay state occur.
    const labelText = new RichText( 'X', {
      font: options.font
    } );

    super( labelText, options );

    this.labelText = labelText;
    this.backgroundVisibleProperty = backgroundVisibleProperty;

    // Since we're not using properties inside of atoms, we have to listen to the stepping to know when it decays.
    decayingAtom.steppedEmitter.addListener( () => this.update() );

    this.updateLabelText();
  }

  public update(): void {
    this.updateLabelText();
    this.updateBackground();
  }

  private updateBackground(): void {
    const isDecayed = this.decayingAtom.hasDecayed;

    // If it just decayed, refresh the label text (color changes on decay).
    if ( isDecayed !== this.wasDecayed ) {
      this.updateLabelText();
    }

    // Show the highlight background only for a brief time right after the atom decays.
    const timeSinceDecay = this.decayingAtom.time - this.decayingAtom.decayTime!;
    this.backgroundVisibleProperty.value = isDecayed && timeSinceDecay < DISPLAY_DURATION;

    this.wasDecayed = isDecayed;
  }

  public updateLabelText(): void {
    this.labelText.string = NuclearDecayAtom.getIsotopeMassAndSymbolString( this.decayingAtom.isotope );
    this.labelText.fill = this.decayingAtom.hasDecayed ?
                          NuclearDecayCommonColors.decayedProperty :
                          ISOTOPE_TO_COLOR.get( this.decayingAtom.isotope )!;
  }

  public reset(): void {
    this.backgroundVisibleProperty.value = false;
    this.wasDecayed = false;
    this.updateLabelText();
  }
}