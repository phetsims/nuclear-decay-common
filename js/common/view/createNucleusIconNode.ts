// Copyright 2026, University of Colorado Boulder

/**
 * Utility that creates a static nucleus icon node using the shell-spiral placement algorithm
 * from ParticleAtom.reconfigureNucleus(). A black backing circle fills the gaps between
 * nucleons so the nucleus appears as a solid sphere.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ParticleNode from '../../../../shred/js/view/ParticleNode.js';

/**
 * @param protonCount - number of protons in the nucleus
 * @param neutronCount - number of neutrons in the nucleus
 * @param nucleonRadius - radius of each nucleon sphere in screen coordinates (best in range 2–8)
 */
const createNucleusIconNode = ( protonCount: number, neutronCount: number, nucleonRadius: number ): Node => {
  const totalNucleons = protonCount + neutronCount;

  const displayedTotal = Math.ceil( 4.8 * Math.pow( totalNucleons, 2 / 3 ) );
  const displayedProtons = roundSymmetric( displayedTotal * protonCount / totalNucleons );
  const displayedNeutrons = displayedTotal - displayedProtons;

  // Interleave protons and neutrons proportionally, matching ParticleAtom.reconfigureNucleus().
  const isProtonArray: boolean[] = [];
  let pIdx = 0;
  let nIdx = 0;
  const neutronsPerProton = displayedNeutrons / displayedProtons;
  let neutronsToAdd = 0;
  while ( isProtonArray.length < displayedTotal ) {
    neutronsToAdd += neutronsPerProton;
    while ( neutronsToAdd >= 1 && nIdx < displayedNeutrons ) {
      isProtonArray.push( false );
      nIdx++;
      neutronsToAdd--;
    }
    if ( pIdx < displayedProtons ) {
      isProtonArray.push( true );
      pIdx++;
    }
  }

  // Scale factor for shell-to-shell spacing. Formula matches ParticleAtom.reconfigureNucleus() range (nucleonRadius 2–8).
  const scaleFactor = 2 - 0.2 * nucleonRadius;

  let placementRadius = 0;
  let numAtThisRadius = 1;
  let level = 0;
  let placementAngle = 0;
  let placementAngleDelta = 0;

  type NucleonData = { x: number; y: number; zLayer: number; isProton: boolean };
  const nucleonData: NucleonData[] = isProtonArray.map( isProton => {
    const data: NucleonData = {
      x: placementRadius * Math.cos( placementAngle ),
      y: placementRadius * Math.sin( placementAngle ),
      zLayer: level + 1,
      isProton: isProton
    };
    numAtThisRadius--;
    if ( numAtThisRadius > 0 ) {
      placementAngle += placementAngleDelta;
    }
    else {
      level++;
      placementRadius += nucleonRadius * scaleFactor / level;
      placementAngle += 2 * Math.PI * 0.2 + level * Math.PI;
      numAtThisRadius = Math.floor( placementRadius * Math.PI / nucleonRadius );
      placementAngleDelta = 2 * Math.PI / numAtThisRadius;
    }
    return data;
  } );

  // Sort descending by z-layer so inner nucleons render in front, giving a spherical appearance.
  nucleonData.sort( ( a, b ) => b.zLayer - a.zLayer );

  // Size the backing circle to cover the full extent of the outermost nucleons.
  const backingRadius = Math.max( ...nucleonData.map( d => Math.hypot( d.x, d.y ) ) );

  const parentNode = new Node();

  // Black backing circle so gaps between nucleons are not visible.
  parentNode.addChild( new Circle( backingRadius, { fill: 'black' } ) );

  // The divisor here is empirical, chosen to make the nucleon outlines look good at a variety of nucleonRadius values.
  const nucleonLineWidth = nucleonRadius / 8;

  nucleonData.forEach( nucleon => {
    const sphere = new ParticleNode( nucleon.isProton ? 'proton' : 'neutron', nucleonRadius, {
      lineWidth: nucleonLineWidth
    } );
    sphere.center = new Vector2( nucleon.x, nucleon.y );
    parentNode.addChild( sphere );
  } );

  return parentNode;
};

export default createNucleusIconNode;
