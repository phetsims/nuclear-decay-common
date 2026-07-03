// Copyright 2026, University of Colorado Boulder

/**
 * MoveStopwatchKeyboardHelpSection describes how to move the draggable Stopwatch with a keyboard, for use in
 * keyboard help dialogs of the Nuclear Decay simulation suite.
 *
 * @author Agustín Vallejo
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';

export default class MoveStopwatchKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    const moveRow = KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_HOTKEY_DATA, {
      labelStringProperty: NuclearDecayCommonFluent.keyboardHelpDialog.moveStopwatch.moveStringProperty
    } );

    super( NuclearDecayCommonFluent.keyboardHelpDialog.moveStopwatch.headingStringProperty, [ moveRow ], {
      isDisposable: false
    } );
  }
}
