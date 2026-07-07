// Copyright 2026, University of Colorado Boulder

/**
 * Constants used throughout the Nuclear Decay Common Suite.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import { clamp } from '../../../dot/js/util/clamp.js';
import { roundSymmetric } from '../../../dot/js/util/roundSymmetric.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import AtomConfig from '../../../shred/js/model/AtomConfig.js';
import { CheckboxOptions } from '../../../sun/js/Checkbox.js';
import getNucleusRadius from './model/getNucleusRadius.js';

const EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE = new Range( -3, 19 );
const MAX_HALF_LIFE_EXPONENT = 18.5;
const MAX_TIME_EXPONENT = 19;

export default class NuclearDecayCommonConstants {
  public constructor() {
    // no-op
  }

  // Max number of nucleons in the sim.
  public static readonly MAX_ATOMS_SECOND_SCREEN = 100;
  public static readonly MAX_ATOMS_THIRD_SCREEN = 1000;

  // Time ranges for custom half-life in linear time mode.
  public static readonly LINEAR_HALF_LIFE = new Range( 0.2, 3 ); // seconds

  // Time exponent ranges for custom half-life in exponential time mode. The actual half-life will be 10^x.
  public static readonly EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE = EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE;

  // Value above which the half-life is considered infinite. 18 is around the age of the universe.
  public static readonly MAX_HALF_LIFE_EXPONENT = MAX_HALF_LIFE_EXPONENT;

  // Time at which the time counter turns into Infinity
  public static readonly MAX_TIME_EXPONENT = MAX_TIME_EXPONENT;
  public static readonly MAX_TIME = Math.pow( 10, MAX_TIME_EXPONENT );

  // The radius of a nucleon, meaning either a proton or neutron, in model coordinates. We use a what is essentially a
  // normalized, unitless value here to keep the model simple. While we could potentially use femtometers (the generally
  // accepted radius of a proton is 0.84 fm, so we are actually fairly close), our models are way off in terms of things
  // like the size of the nucleus versus the electron cloud, so using a simple arbitrary value makes the code easier in
  // a number of places.
  public static readonly NUCLEON_RADIUS = 1;

  // Function for getting exponential time based with the proper clamps. The result's mantissa is rounded to the
  // nearest integer (e.g. 5.78e9 -> 6e9) so displayed values don't show spurious precision.
  public static readonly EXPONENTIAL_TIME = ( exponent: number ): number => {
    const rawValue = Math.min( Math.pow( 10, exponent ), Number.MAX_VALUE );
    const magnitude = Math.floor( Math.log10( rawValue ) );
    const roundedMantissa = roundSymmetric( rawValue / Math.pow( 10, magnitude ) );
    return roundedMantissa * Math.pow( 10, magnitude );
  };

  public static readonly CHECKBOX_OPTIONS: CheckboxOptions = {
    boxWidth: 16
  };

  // Isotopes
  public static readonly ALPHA_PARTICLE = new AtomConfig( 2, 2, 0 );
  public static readonly POLONIUM_211 = new AtomConfig( 84, 127, 84 );
  public static readonly LEAD_207 = new AtomConfig( 82, 125, 82 );
  public static readonly CARBON_14 = new AtomConfig( 6, 8, 6 );
  public static readonly NITROGEN_14 = new AtomConfig( 7, 7, 7 );
  public static readonly HYDROGEN_3 = new AtomConfig( 1, 2, 1 );
  public static readonly HELIUM_3 = new AtomConfig( 2, 1, 2 );

  // Define the radii for several of the commonly used nuclei that appear in the Nuclear Decay sim suite. Beyond a
  // certain number of nucleons, we don't worry about a neutron here or there. For example, LEAD_RADIUS uses a
  // particular isotope of lead, but the radius is close enough for all isotopes of lead.
  public static readonly POLONIUM_NUCLEUS_RADIUS = getNucleusRadius(
    NuclearDecayCommonConstants.POLONIUM_211.getMassNumber(),
    NuclearDecayCommonConstants.NUCLEON_RADIUS
  );
  public static readonly LEAD_NUCLEUS_RADIUS = getNucleusRadius(
    NuclearDecayCommonConstants.LEAD_207.getMassNumber(),
    NuclearDecayCommonConstants.NUCLEON_RADIUS
  );
  public static readonly CARBON_NUCLEUS_RADIUS = getNucleusRadius(
    NuclearDecayCommonConstants.CARBON_14.getMassNumber(),
    NuclearDecayCommonConstants.NUCLEON_RADIUS
  );
  public static readonly NITROGEN_NUCLEUS_RADIUS = getNucleusRadius(
    NuclearDecayCommonConstants.NITROGEN_14.getMassNumber(),
    NuclearDecayCommonConstants.NUCLEON_RADIUS
  );
  public static readonly DEUTERIUM_NUCLEUS_RADIUS = getNucleusRadius(
    NuclearDecayCommonConstants.HYDROGEN_3.getMassNumber(),
    NuclearDecayCommonConstants.NUCLEON_RADIUS
  );
  public static readonly HELIUM_NUCLEUS_RADIUS = getNucleusRadius(
    NuclearDecayCommonConstants.HELIUM_3.getMassNumber(),
    NuclearDecayCommonConstants.NUCLEON_RADIUS
  );

  // Custom atom configurations for user-defined half-lives. These use proton/neutron counts (123, 119) that are above
  // the heaviest known real element (Oganesson, Z=118), so they will never collide with real isotope data in
  // AtomInfoUtils lookups. This allows custom atoms to flow through the same AtomConfig-based infrastructure without
  // being mistaken for a real nuclide.
  public static readonly CUSTOM_UNDECAYED = new AtomConfig( 123, 123, 123 );
  public static readonly CUSTOM_DECAYED = new AtomConfig( 119, 119, 119 );

  // Screen view margins
  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 7;

  // Text constants
  public static readonly TEXT_MAX_WIDTH = 200;
  public static readonly TITLE_FONT = new PhetFont( 18 );
  public static readonly CONTROL_FONT = new PhetFont( 16 );
  public static readonly SMALL_LABEL_FONT = new PhetFont( 14 );
  public static readonly TITLE_BOLD_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  public static readonly CONTROL_BOLD_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  public static readonly SMALL_LABEL_BOLD_FONT = new PhetFont( { size: 14, weight: 'bold' } );

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

  // How deep the well is with respect to half the graph height. 1 corresponds to the lower end of the Y axis.
  public static readonly WELL_DEPTH = 0.6;

  // We work with normalized energy and halfLife values so it's easier to map between them
  public static readonly CALCULATE_HALF_LIFE =
    ( alphaParticleEnergy: number, potentialEnergy: number ): number => {

      // If alpha particle energy is negative, return the maximum half-life
      if ( alphaParticleEnergy < 0 ) { return 1; }

      // If alpha particle energy is greater than potential energy, return the minimum half-life (immediate decay)
      if ( alphaParticleEnergy > potentialEnergy ) { return 0; }

      // Expression that roughly maps the energy difference to a normalized half-life
      return clamp(
        ( potentialEnergy - alphaParticleEnergy ) / potentialEnergy, 0, 1 );
    };

  public static readonly CALCULATE_ALPHA_PARTICLE_ENERGY = ( halfLife: number, potentialEnergy: number ): number => {

    // Inverse of the above function solving for alpha particle energy
    return clamp(
      potentialEnergy - halfLife * potentialEnergy, 0, 1 );
  };
}
