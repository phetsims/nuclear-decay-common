// Copyright 2026, University of Colorado Boulder

/**
 * NucleusImageNodeFactory is a singleton that efficiently produces rasterized images of atomic nuclei made up of
 * individual protons and neutrons. Creating the individual nucleon nodes (ShadedSphereNodes) and rasterizing them is
 * relatively expensive, and many nuclei are created and recreated over the lifetime of a simulation. To avoid paying
 * that cost repeatedly, this factory caches a pool of nucleon nodes and a single positional "trellis" structure.
 *
 * The nucleons placed for the previous request are left in place between calls. Each request then adds or removes only
 * enough nodes to match the new configuration and trades the locations of a fraction of the nucleons before
 * rasterizing. Because a screen typically shows many atoms of the same isotope, most requests require little or no
 * structural change, making them very cheap.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import AtomConfig from '../../../../shred/js/model/AtomConfig.js';
import ShredColors from '../../../../shred/js/ShredColors.js';

// Radius of an individual nucleon, in screen coordinates (unitless). Matches the value previously used in
// VibratingDecayingAtomNode so that the rendered nuclei stay the same visual size.
const NUCLEON_RADIUS = 1.75;

// Maximum number of nucleon positions supported by the trellis structure. Make this bigger if you ever need to display
// more nucleons than this in a single nucleus.
const MAX_PARTICLE_NODES_SUPPORTED = 150;

// Resolution multiplier used when rasterizing the assembled nucleus into an image.
const RASTERIZE_RESOLUTION = 4;

// A single position within a shell of the trellis where a nucleon node can be placed.
type TrellisLocation = {
  angle: number;
  particle: Node | null;
};

// A shell within the trellis, consisting of a radius and the set of locations available at that radius.
type TrellisShell = {
  radius: number;
  locations: TrellisLocation[];
};

// The proportion of nucleons whose locations are traded between different types on each request. Trading keeps the
// nucleus looking a little different between successive atoms without a full rebuild.
const NUCLEON_TRADE_PROPORTION = 0.1;

class NucleusImageNodeFactory {

  // The set of allowed nucleon positions, structured as a set of shells (each with a radius and a set of angles). This
  // is created once and reused for every nucleus, since it only depends on the nucleon radius.
  private readonly trellis: TrellisShell[];

  // Free (created but not currently placed) nucleon nodes, available to be added to the nucleus.
  private readonly freeProtonNodes: ShadedSphereNode[] = [];
  private readonly freeNeutronNodes: ShadedSphereNode[] = [];

  // Nucleon nodes currently placed on the trellis and parented to the scratch node. These persist across requests so
  // that successive nuclei can be produced by adjusting only the difference rather than rebuilding from scratch.
  private readonly activeProtonNodes: ShadedSphereNode[] = [];
  private readonly activeNeutronNodes: ShadedSphereNode[] = [];

  // Maps each active nucleon node to the trellis location it currently occupies, so a node can be relocated or removed
  // without searching the whole trellis.
  private readonly nodeToLocation = new Map<Node, TrellisLocation>();

  // An off-screen node that holds the currently placed nucleons and is rasterized to produce each image. It is never
  // added to a scene graph, and its children persist between requests.
  private readonly scratchParent = new Node();

  public constructor() {
    this.trellis = NucleusImageNodeFactory.buildTrellis();
  }

  /**
   * Create a rasterized image of an atomic nucleus for the provided atom configuration. The number of nucleons shown is
   * a representative subset of the actual nucleon count, calculated the same way as in VibratingDecayingAtomNode.
   *
   * Rather than rebuilding the nucleus every time, this keeps the previously placed nucleons in position and only adds
   * or removes enough nodes to satisfy the new request, then trades the locations of a fraction of the nucleons so that
   * successive nuclei don't look identical. Since a given screen typically shows many atoms of the same isotope, most
   * requests require little or no structural change.
   */
  public createNucleusImageNode( atomConfig: AtomConfig ): Node {

    const { individualProtonCount, individualNeutronCount } = NucleusImageNodeFactory.getDisplayedParticleCounts(
      atomConfig.protonCount,
      atomConfig.neutronCount
    );

    // Make sure enough nucleon nodes have been created to satisfy this request, creating more only if needed.
    this.ensureCreatedNodeCount( this.freeProtonNodes, this.activeProtonNodes, individualProtonCount, true );
    this.ensureCreatedNodeCount( this.freeNeutronNodes, this.activeNeutronNodes, individualNeutronCount, false );

    // Add or remove only enough nodes of each type to meet the request.
    const protonDelta = individualProtonCount - this.activeProtonNodes.length;
    const neutronDelta = individualNeutronCount - this.activeNeutronNodes.length;
    this.changeNucleonCount( this.freeProtonNodes, this.activeProtonNodes, protonDelta );
    this.changeNucleonCount( this.freeNeutronNodes, this.activeNeutronNodes, neutronDelta );

    const structureChanged = protonDelta !== 0 || neutronDelta !== 0;

    // Trade the locations of a fraction of the nucleons of different types so that successive nuclei look a bit
    // different. In the common steady-state case (no structural change) this trade also swaps the traded nodes' layering
    // so the "inner nucleons in front" look is preserved without a full re-layering pass.
    const totalNucleonCount = this.activeProtonNodes.length + this.activeNeutronNodes.length;
    const numberOfTrades = roundSymmetric( NUCLEON_TRADE_PROPORTION * totalNucleonCount / 2 );
    this.tradeNucleonLocations( numberOfTrades, !structureChanged );

    // If nodes were added or removed, re-layer everything so nucleons nearer the center are higher in the Z-order.
    if ( structureChanged ) {
      this.relayerByDistanceFromCenter();
    }

    // Guard against rasterizing an empty node (no nucleons), which has no bounds.
    if ( totalNucleonCount === 0 ) {
      return new Node();
    }

    // Rasterize the assembled nucleus into a single image node so that it renders as one node, which improves
    // rendering performance.
    return rasterizeNode( this.scratchParent, { resolution: RASTERIZE_RESOLUTION } );
  }

  /**
   * Add nodes to (delta > 0) or remove nodes from (delta < 0) the nucleus. Added nodes go into the innermost open
   * trellis location; removed nodes are taken from the outermost occupied location so the nucleus stays reasonably
   * round.
   */
  private changeNucleonCount( freeNodes: ShadedSphereNode[], activeNodes: ShadedSphereNode[], delta: number ): void {
    _.times( Math.max( delta, 0 ), () => this.addNucleonNode( freeNodes, activeNodes ) );
    _.times( Math.max( -delta, 0 ), () => this.removeOutermostNucleonNode( freeNodes, activeNodes ) );
  }

  /**
   * Move a free nucleon node into the innermost open trellis location, so the nucleus fills in from the center outward
   * and looks like a fairly solid, round thing.
   */
  private addNucleonNode( freeNodes: ShadedSphereNode[], activeNodes: ShadedSphereNode[] ): void {
    const nucleonNode = freeNodes.pop()!;
    affirm( nucleonNode, 'Expected a free nucleon node to be available.' );

    for ( const shell of this.trellis ) {
      const openLocations = shell.locations.filter( location => location.particle === null );
      if ( openLocations.length > 0 ) {
        const selectedLocation = openLocations[ dotRandom.nextInt( openLocations.length ) ];
        selectedLocation.particle = nucleonNode;
        nucleonNode.center = new Vector2( shell.radius, 0 ).rotated( selectedLocation.angle );
        this.nodeToLocation.set( nucleonNode, selectedLocation );
        this.scratchParent.addChild( nucleonNode );
        activeNodes.push( nucleonNode );
        return;
      }
    }

    affirm( false, 'No open location available in the trellis; consider increasing MAX_PARTICLE_NODES_SUPPORTED.' );
  }

  /**
   * Remove the outermost active nucleon node of the given type from the nucleus, returning it to the free pool.
   */
  private removeOutermostNucleonNode( freeNodes: ShadedSphereNode[], activeNodes: ShadedSphereNode[] ): void {
    const outermostNode = _.maxBy( activeNodes, node => node.center.magnitude )!;
    affirm( outermostNode, 'Expected an active nucleon node to remove.' );

    const location = this.nodeToLocation.get( outermostNode )!;
    location.particle = null;
    this.nodeToLocation.delete( outermostNode );
    this.scratchParent.removeChild( outermostNode );
    activeNodes.splice( activeNodes.indexOf( outermostNode ), 1 );
    freeNodes.push( outermostNode );
  }

  /**
   * Trade the trellis locations of some protons with some neutrons. Each trade swaps a proton and a neutron, exchanging
   * both their positions and (when requested) their layering, which preserves the "inner nucleons in front" look.
   */
  private tradeNucleonLocations( numberOfTrades: number, swapLayering: boolean ): void {
    for ( let i = 0; i < numberOfTrades; i++ ) {
      if ( this.activeProtonNodes.length === 0 || this.activeNeutronNodes.length === 0 ) {
        break;
      }

      const protonNode = this.activeProtonNodes[ dotRandom.nextInt( this.activeProtonNodes.length ) ];
      const neutronNode = this.activeNeutronNodes[ dotRandom.nextInt( this.activeNeutronNodes.length ) ];

      // Exchange the trellis locations the two nodes are assigned to.
      const protonLocation = this.nodeToLocation.get( protonNode )!;
      const neutronLocation = this.nodeToLocation.get( neutronNode )!;
      protonLocation.particle = neutronNode;
      neutronLocation.particle = protonNode;
      this.nodeToLocation.set( protonNode, neutronLocation );
      this.nodeToLocation.set( neutronNode, protonLocation );

      // Exchange their positions.
      const protonCenter = protonNode.center;
      protonNode.center = neutronNode.center;
      neutronNode.center = protonCenter;

      // Exchange their layering so each trellis location keeps the Z-order appropriate for its distance from center.
      if ( swapLayering ) {
        const protonIndex = this.scratchParent.indexOfChild( protonNode );
        const neutronIndex = this.scratchParent.indexOfChild( neutronNode );
        this.scratchParent.moveChildToIndex( protonNode, neutronIndex );
        this.scratchParent.moveChildToIndex( neutronNode, protonIndex );
      }
    }
  }

  /**
   * Re-layer all active nucleons so that those nearer the center are higher in the Z-order, giving the nucleus a more
   * spherical look. Used after the structure changes.
   */
  private relayerByDistanceFromCenter(): void {
    const activeNodes = [ ...this.activeProtonNodes, ...this.activeNeutronNodes ];
    activeNodes.sort( ( a, b ) => b.center.magnitude - a.center.magnitude );
    activeNodes.forEach( nucleonNode => nucleonNode.moveToFront() );
  }

  /**
   * Grow the set of created nucleon nodes (free plus active) of one type until it contains at least the requested count,
   * creating new nodes only when the existing cache is insufficient.
   */
  private ensureCreatedNodeCount(
    freeNodes: ShadedSphereNode[],
    activeNodes: ShadedSphereNode[],
    count: number,
    isProton: boolean
  ): void {
    while ( freeNodes.length + activeNodes.length < count ) {
      freeNodes.push( new ShadedSphereNode( 2 * NUCLEON_RADIUS, {
        mainColor: isProton ? ShredColors.protonColorProperty : ShredColors.neutronColorProperty
      } ) );
    }
  }

  /**
   * Determine how many individual protons and neutrons to render based on the actual counts. This matches the logic
   * previously used in VibratingDecayingAtomNode.createNucleusNode.
   */
  private static getDisplayedParticleCounts( protonCount: number, neutronCount: number ): {
    individualProtonCount: number;
    individualNeutronCount: number;
  } {
    const totalNucleonCount = protonCount + neutronCount;
    if ( totalNucleonCount === 0 ) {
      return {
        individualProtonCount: 0,
        individualNeutronCount: 0
      };
    }

    // For small nuclei, show all nucleons. For larger ones, calculate a representative subset.
    const numberOfNucleonsToDisplay = totalNucleonCount < 5 ?
                                      totalNucleonCount :
                                      Math.min(
                                        Math.ceil( 2 * Math.pow( totalNucleonCount, 2 / 3 ) ),
                                        MAX_PARTICLE_NODES_SUPPORTED
                                      );

    const displayedProtonCount = roundSymmetric( numberOfNucleonsToDisplay * protonCount / totalNucleonCount );
    const displayedNeutronCount = numberOfNucleonsToDisplay - displayedProtonCount;

    return {
      individualProtonCount: displayedProtonCount,
      individualNeutronCount: displayedNeutronCount
    };
  }

  /**
   * Build the positional trellis structure, which is like a trellis in a garden, used to efficiently position the
   * nucleon nodes. It is a set of concentric shells, each with a radius and a set of angles at that radius where
   * nucleons can be placed. This logic is borrowed from DynamicNucleusNode.
   */
  private static buildTrellis(): TrellisShell[] {
    const trellis: TrellisShell[] = [];

    let currentShell = 0;
    let currentShellRadius = 0;
    let currentAngle = 0;
    let particlesAllowedInThisShell = 1;
    let particlePositionsInThisShell = 0;
    let totalPositions = 0;
    let done = false;

    while ( !done ) {

      // Add a position to the current shell. Create a new entry for this shell if there isn't one yet.
      if ( !trellis[ currentShell ] ) {
        trellis.push( { radius: currentShellRadius, locations: [] } );
      }
      trellis[ currentShell ].locations.push( {
        angle: currentAngle,
        particle: null
      } );
      totalPositions++;
      particlePositionsInThisShell++;
      currentAngle += ( 2 * Math.PI ) / particlesAllowedInThisShell;

      if ( particlePositionsInThisShell >= particlesAllowedInThisShell ) {

        if ( totalPositions < MAX_PARTICLE_NODES_SUPPORTED ) {

          // Time to move to the next shell.
          currentShell++;

          // Calculate the shell radius using a function that increases forever, but in decreasing amounts in order to
          // create a round look with the collection of particles. The multiplier at the end is empirically determined
          // and can be adjusted to create a more or less tightly packed appearance.
          currentShellRadius = NUCLEON_RADIUS * Math.log( currentShell + 1 ) * 2.25;

          particlesAllowedInThisShell = Math.floor( 2 * Math.PI * currentShellRadius / ( NUCLEON_RADIUS * 2 ) );
          particlePositionsInThisShell = 0;

          // Set an initial angle that is random for a somewhat chaotic look.
          currentAngle = 2 * Math.PI * dotRandom.nextDouble();
        }
        else {

          // We're done - enough positions have been created to support the max allowed number of particles.
          done = true;
        }
      }
    }

    return trellis;
  }
}

// This class is a singleton, so create and export the single instance.
const nucleusImageNodeFactory = new NucleusImageNodeFactory();
export default nucleusImageNodeFactory;