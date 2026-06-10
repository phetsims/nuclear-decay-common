// Copyright 2026, University of Colorado Boulder

/**
 * Constants used throughout the Nuclear Decay Common Suite.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Range from '../../dot/js/Range.js';
import { clamp } from '../../dot/js/util/clamp.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import AtomConfig from '../../shred/js/model/AtomConfig.js';

const EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE = new Range( -3, 19 );
const MAX_HALF_LIFE_EXPONENT = 18;
const MAX_TIME_EXPONENT = 19;

export default class NuclearDecayCommonConstants {
  public constructor() {
    // no-op
  }

  // Max number of nucleons in the sim.
  public static readonly MAX_ATOMS_SECOND_SCREEN = 100;
  public static readonly MAX_ATOMS_THIRD_SCREEN = 1000;

  // Time ranges for custom half-life in linear time mode.
  public static readonly LINEAR_HALF_LIFE = new Range( 0.1, 3 ); // seconds

  // Time exponent ranges for custom half-life in exponential time mode. The actual half-life will be 10^x.
  public static readonly EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE = EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE;

  // Value above which the half-life is considered infinite. 18 is around the age of the universe.
  public static readonly MAX_HALF_LIFE_EXPONENT = MAX_HALF_LIFE_EXPONENT;

  // Time at which the time counter turns into Infinity
  public static readonly MAX_TIME_EXPONENT = MAX_TIME_EXPONENT;
  public static readonly MAX_TIME = Math.pow( 10, MAX_TIME_EXPONENT );

  // Function for getting exponential time based with the proper clamps
  public static readonly EXPONENTIAL_TIME = ( exponent: number ): number => {
    return Math.min( Math.pow( 10, exponent ), Number.MAX_VALUE );
  };

  // Atom dimensions in model coordinates. Because it's difficult to come up with any sort of reasonable real units for
  // modeling the particle, we are using a normalized value here.
  // JB REVIEW: I think we should rename this to something like ATOMIC_NUCLEUS_RADIUS and potentially have another for
  //            the radius including the electron cloud.
  public static readonly ATOM_RADIUS = 1;

  // Isotopes
  public static readonly ALPHA_PARTICLE = new AtomConfig( 2, 2, 0 );
  public static readonly POLONIUM_211 = new AtomConfig( 84, 127, 84 );
  public static readonly LEAD_207 = new AtomConfig( 82, 125, 82 );
  public static readonly CARBON_14 = new AtomConfig( 6, 8, 6 );
  public static readonly NITROGEN_14 = new AtomConfig( 7, 7, 7 );
  public static readonly HYDROGEN_3 = new AtomConfig( 1, 2, 1 );
  public static readonly HELIUM_3 = new AtomConfig( 2, 1, 2 );

  // Custom atom configurations for user-defined half-lives. These use proton/neutron counts (123, 119) that are above
  // the heaviest known real element (Oganesson, Z=118), so they will never collide with real isotope data in
  // AtomInfoUtils lookups. This allows custom atoms to flow through the same AtomConfig-based infrastructure without
  // being mistaken for a real nuclide.
  public static readonly CUSTOM_UNDECAYED = new AtomConfig( 123, 123, 123 );
  public static readonly CUSTOM_DECAYED = new AtomConfig( 119, 119, 119 );

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
  public static readonly MEDIUM_LABEL_FONT = new PhetFont( 18 );

  // Layout constants for panel sizing and spacing
  public static readonly LONG_PANEL_WIDTH = 740;
  public static readonly RIGHT_PANEL_WIDTH = 220;
  public static readonly PANEL_X_MARGIN = 10;
  public static readonly PANEL_Y_MARGIN = 10;
  public static readonly PANEL_SPACING = 10;
  public static readonly PANEL_FILL = 'rgb( 238, 238, 238 )';
  public static readonly MAIN_PANEL_FILL = '#F1FAFE';

  // Separation between atom border and atom label
  public static readonly LABEL_ATOM_GAP = 10;

  // Time control constants
  public static readonly MANUAL_STEP_DT = 1 / 60; // seconds, one frame
  public static readonly NORMAL_SPEED_SCALE = 0.25;
  public static readonly SLOW_SPEED_SCALE = 0.1;

  public static readonly ENERGIES_TO_HALF_LIFE_EXPONENT_MAPPING =
    ( kineticEnergy: number, potentialEnergy: number ): number => {

      // If kinetic energy is negative, return the maximum half-life
      if ( kineticEnergy < 0 ) { return 1; }

      // If kinetic energy is greater than potential energy, return the minimum half-life (immediate decay)
      if ( kineticEnergy > potentialEnergy ) { return 0; }

      // Expression that roughly maps the energy difference to a normalized half-life
      return clamp(
        ( potentialEnergy - kineticEnergy ) / potentialEnergy, 0, 1 );
    };

  public static readonly HALF_LIFE_TO_KINETIC_ENERGY_MAPPING = ( halfLife: number, potentialEnergy: number ): number => {

    // Inverse of the above function solving for kinetic energy
    return clamp(
      potentialEnergy - halfLife * potentialEnergy, 0, 1 );
  };
}
