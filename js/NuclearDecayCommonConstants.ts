// Copyright 2026, University of Colorado Boulder

/**
 * Constants used throughout the Nuclear Decay Common Suite.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import PhetFont from '../../scenery-phet/js/PhetFont.js';
import nuclearDecayCommon from './nuclearDecayCommon.js';

export default class NuclearDecayCommonConstants {
  public constructor() {
    // no-op
  }

  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;

  // Text constants
  public static readonly HEADER_FONT = new PhetFont( 20 );
  public static readonly TITLE_FONT = new PhetFont( 18 );
  public static readonly CONTROL_FONT = new PhetFont( 14 );
  public static readonly SMALL_LABEL_FONT = new PhetFont( 12 );
  public static readonly TINY_LABEL_FONT = new PhetFont( 8 );
  public static readonly HEADER_BOLD_FONT = new PhetFont( { size: 20, weight: 'bold' } );
  public static readonly TITLE_BOLD_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  public static readonly CONTROL_BOLD_FONT = new PhetFont( { size: 14, weight: 'bold' } );
  public static readonly SMALL_LABEL_BOLD_FONT = new PhetFont( { size: 12, weight: 'bold' } );
  public static readonly TINY_LABEL_BOLD_FONT = new PhetFont( { size: 8, weight: 'bold' } );

  // Layout constants for panel sizing and spacing
  public static readonly LONG_PANEL_WIDTH = 600;
  public static readonly RIGHT_PANEL_WIDTH = 200;
  public static readonly PANEL_X_MARGIN = 10;
  public static readonly PANEL_Y_MARGIN = 10;
  public static readonly PANEL_SPACING = 10;
  public static readonly PANEL_FILL = 'rgb( 238, 238, 238 )';
  public static readonly MAIN_PANEL_FILL = '#F1FAFE';

  // Particle sizes
  public static readonly NUCLEON_DIAMETER = 13;

  // Time control constants
  public static readonly MANUAL_STEP_DT = 1 / 60; // seconds, one frame
  public static readonly NORMAL_SPEED_SCALE = 1;
  public static readonly SLOW_SPEED_SCALE = 0.25;
}

nuclearDecayCommon.register( 'NuclearDecayCommonConstants', NuclearDecayCommonConstants );