// Copyright 2026, University of Colorado Boulder

/**
 * Constants used throughout the Nuclear Decay Common Suite.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import PhetFont from '../../scenery-phet/js/PhetFont.js';
import AtomConfig from '../../shred/js/model/AtomConfig.js';

export default class NuclearDecayCommonConstants {
  public constructor() {
    // no-op
  }

  // Max number of nucleons in the sim
  public static readonly MAX_ATOMS = 100;

  // Atom dimensions in model coordinates
  public static readonly ATOM_RADIUS = 1;

  // Isotopes
  public static readonly ALPHA_PARTICLE = new AtomConfig( 2, 2, 0 );
  public static readonly POLONIUM_211 = new AtomConfig( 84, 127, 84 );
  public static readonly LEAD_207 = new AtomConfig( 82, 125, 82 );
  public static readonly CARBON_14 = new AtomConfig( 6, 8, 6 );
  public static readonly NITROGEN_14 = new AtomConfig( 7, 7, 7 );
  public static readonly HYDROGEN_3 = new AtomConfig( 1, 2, 1 );
  public static readonly HELIUM_3 = new AtomConfig( 2, 1, 2 );

  // Screen view margins
  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;

  // Text constants
  public static readonly TEXT_MAX_WIDTH = 200;
  public static readonly TITLE_FONT = new PhetFont( 18 );
  public static readonly CONTROL_FONT = new PhetFont( 16 );
  public static readonly SMALL_LABEL_FONT = new PhetFont( 14 );
  public static readonly TITLE_BOLD_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  public static readonly CONTROL_BOLD_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  public static readonly SMALL_LABEL_BOLD_FONT = new PhetFont( { size: 14, weight: 'bold' } );

  // Layout constants for panel sizing and spacing
  public static readonly LONG_PANEL_WIDTH = 600;
  public static readonly RIGHT_PANEL_WIDTH = 250;
  public static readonly PANEL_X_MARGIN = 10;
  public static readonly PANEL_Y_MARGIN = 10;
  public static readonly PANEL_SPACING = 10;
  public static readonly PANEL_FILL = 'rgb( 238, 238, 238 )';
  public static readonly MAIN_PANEL_FILL = '#F1FAFE';

  // Particle sizes
  public static readonly NUCLEON_DIAMETER = 13;

  // Time control constants
  public static readonly MANUAL_STEP_DT = 1 / 60; // seconds, one frame
  public static readonly NORMAL_SPEED_SCALE = 0.25;
  public static readonly SLOW_SPEED_SCALE = 0.1;
}
