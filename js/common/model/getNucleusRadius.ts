// Copyright 2026, University of Colorado Boulder

/**
 * Calculates the radius of an atomic nucleus given the number of nucleons it contains and the radius of a single
 * nucleon (all nucleons are assumed to be spheres of the same radius).
 *
 * The small nuclei (1-4 nucleons) are handled as special cases based on the geometry of tightly packed, mutually
 * touching spheres, since the statistical approximation used for larger nuclei is a poor fit at these sizes. For 5 or
 * more nucleons, the standard R = r0 * A^(1/3) nuclear radius approximation is used, where r0 is proportional to the
 * nucleon radius.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

// Circumradius factors for small clusters of mutually touching spheres whose centers are 2 * nucleonRadius apart. The
// overall nucleus radius is the distance from the cluster center to the farthest nucleon center plus one nucleon radius.
const EQUILATERAL_TRIANGLE_CIRCUMRADIUS_FACTOR = 2 / Math.sqrt( 3 ); // 3 nucleons in an equilateral triangle
const TETRAHEDRON_CIRCUMRADIUS_FACTOR = Math.sqrt( 3 / 2 ); // 4 nucleons in a regular tetrahedron

export default function getNucleusRadius( numberOfNucleons: number, nucleonRadius: number ): number {

  return numberOfNucleons === 1 ? nucleonRadius : // a single nucleon
         numberOfNucleons === 2 ? 2 * nucleonRadius : // two touching nucleons
         numberOfNucleons === 3 ? nucleonRadius * ( 1 + EQUILATERAL_TRIANGLE_CIRCUMRADIUS_FACTOR ) :
         numberOfNucleons === 4 ? nucleonRadius * ( 1 + TETRAHEDRON_CIRCUMRADIUS_FACTOR ) :

         // The equation used here is based on the math around sphere packing, but can be tweaked if necessary.
         1.13 * nucleonRadius * Math.pow( numberOfNucleons, 1 / 3 );
}