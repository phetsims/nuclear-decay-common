// Copyright 2026, University of Colorado Boulder

/**
 * DynamicNucleusNode portrays an atomic nucleus made of protons and neutrons, potentially clustering together as alpha
 * particles, and moving around within the nucleus.  The nucleons portrayed in this view do not track model elements.
 * In other words, the dynamic behavior is a view-specific features of this Node.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import AtomConfig from '../../../../shred/js/model/AtomConfig.js';
import ShredColors from '../../../../shred/js/ShredColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import Updatable from '../model/Updatable.js';
import AlphaParticleNode from './AlphaParticleNode.js';
import AtomLabelNode from './AtomLabelNode.js';

type SelfOptions = {

  // The radius to use for nucleons, in screen coordinates.
  nucleonRadius?: number;

  // The radius to which particles that can tunnel can move prior to tunneling.
  escapeRadiusProperty?: TReadOnlyProperty<number> | null;
};
type DynamicNucleusNodeOptions = SelfOptions & NodeOptions;

// Type used for positioning a nucleon on a given shell.
type LocationOnShell = {
  angle: number;
  particle: Node | null;

  // A local perturbation from the shell's natural (radius, angle) position.
  // Null means "no jitter" and should be treated as Vector2.ZERO.
  jitterOffset: Vector2 | null;
};

// Type used for defining the locations in a shell within the nucleus structure.
type ShellLocations = {
  radius: number;
  locations: LocationOnShell[];
};

type RoamingAlphaInfo = {
  alphaParticleNode: AlphaParticleNode;
  remainingTimeOutsideNucleus: number;
};

// The range of update frequencies used for the atom's animation, in updates per second
const UPDATE_FREQUENCY_RANGE = new Range( 5, 25 );

// The range of allowed particle jumps, in particle radii. This is used when animating the nucleus and trying to make it
// appear more or less agitated.
const PARTICLE_JUMP_RANGE = new Range( 0.005, 1 );

// The range of allowed particle swaps that can occur on an update. This is used when animating the nucleus and trying
// to make it appear more or less agitated. A swap means two particles change positions in the nucleus structure.
const PARTICLE_SWAP_PROPORTION_RANGE = new Range( 0.01, 0.03 );

// Label is positioned this many nucleon radii above the nucleus center.
const LABEL_OFFSET_IN_NUCLEON_RADII = 10;

// This factor defines how tightly the particles in the nucleus are packed. The value must be less than 1, and larger
// values lead to a larger (i.e. less tightly packed) nucleus. Adjust as needed to get the desired visual effect.
const NUCLEUS_ENLARGEMENT_FACTOR = 0.99;

// Maximum number of particle nodes that will be supported by the trellis structure. Make this bigger if you need to.
const MAX_PARTICLE_NODES_SUPPORTED = 200;

// The range of time for an alpha particle to appear when it goes outside the nucleus but doesn't tunnel, in seconds.
const ALPHA_PARTICLE_EXCURSION_TIME_RANGE = new Range( 0.05, 0.2 );

// This is a debugging thing. It determines whether to show a transparent circular node on top of the nucleus that is
// exactly the prescribed radius so that we can see if the nucleons are staying at least mostly within it.
const SHOW_RADIUS_NODE = false;

class DynamicNucleusNode extends Node implements Updatable {

  // The radius of the individual nucleons that comprise the nucleus.  All nucleons are depicted as spheres with this
  // radius.
  private readonly nucleonRadius: number;

  // The model atom that this Node depicts and uses for particle configuration data.
  private readonly atom: NuclearDecayAtom;

  // Transform used to map the atom model position into view coordinates.
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;

  // Separate particle collections are stored as fields so member methods can manipulate them directly.
  private readonly protonNodes: ShadedSphereNode[] = [];
  private readonly neutronNodes: ShadedSphereNode[] = [];
  private readonly alphaParticleNodes: AlphaParticleNode[] = [];

  // Accumulates the scaled time between particle updates.
  private timeAccumulator = 0;

  // The frequency at which updates of particle positions occur. This goes up as the "agitation level" rises.
  private updateFrequency = UPDATE_FREQUENCY_RANGE.expandNormalizedValue( 0.5 );

  // The set of allowed particle positions, used to create the nucleus shape and used as the basis for the dynamic
  // motion. It is structured as a set of shells, each with a radius and a set of angles at that radius where particles
  // can go.
  private readonly particleNodeTrellis: ShellLocations[];

  // An array of alpha particles that are currently outside the nucleus but not at or beyond the tunneling radius.
  public readonly almostTunnelingAlphaParticles: RoamingAlphaInfo[] = [];

  private readonly atomLabelNode: AtomLabelNode;

  // See docs in the options for this class.
  private readonly escapeRadiusProperty: TReadOnlyProperty<number> | null;

  // The atom configuration that is currently being shown. This is used to detect when the configuration changes, since
  // we don't have Properties to link to.
  private currentlyDepictedAtomConfig: AtomConfig | null = null;

  // The max amount that a particle can jump during an update.
  private maxParticleJump = PARTICLE_JUMP_RANGE.expandNormalizedValue( 0.5 );

  // The proportion of particles that can swap positions in an update.
  private particleSwapProportion = PARTICLE_SWAP_PROPORTION_RANGE.expandNormalizedValue( 0.5 );

  // A node that can be turned on to help check the size of this node.
  private readonly radiusNode: null | Circle;

  public constructor(
    atom: NuclearDecayAtom,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
    isModelPlayingProperty: TReadOnlyProperty<boolean>,
    providedOptions?: DynamicNucleusNodeOptions
  ) {

    const options = optionize<DynamicNucleusNodeOptions, SelfOptions, NodeOptions>()( {
      nucleonRadius: 5,
      escapeRadiusProperty: null
    }, providedOptions );

    super( options );

    this.atom = atom;
    this.modelViewTransformProperty = modelViewTransformProperty;
    this.nucleonRadius = options.nucleonRadius;
    this.escapeRadiusProperty = options.escapeRadiusProperty;

    this.atomLabelNode = new AtomLabelNode( atom, {
      font: NuclearDecayCommonConstants.TITLE_BOLD_FONT,
      centerX: 0,
      bottom: -LABEL_OFFSET_IN_NUCLEON_RADII * this.nucleonRadius
    } );
    this.addChild( this.atomLabelNode );

    // Add a listener to the atom's step emitter that implements the dynamic motion of the particles in the nucleus.
    atom.steppedEmitter.addListener( dt => {
      if ( !isModelPlayingProperty.value ) {

        // Force an update to the particle positions on every step when the model is paused so that its appearance will
        // change whenever the "step forward" button is pressed.
        this.timeAccumulator = 1 / this.updateFrequency;
      }

      this.step( dt );
    } );

    // Create the positional structure, which is like a trellis in a garden, that will be used to efficiently position
    // the particle nodes that comprise this nucleus.  It is initially created based on the size of the nucleons, then
    // scaled to match the prescribed nucleus radius.
    this.particleNodeTrellis = [];
    let currentShell = 0;
    let currentShellRadius = 0;
    let currentAngle = 0;
    let particlesAllowedInThisShell = 1;
    let particlesPositionsInThisShell = 0;
    let totalPositions = 0;
    let done = false;

    while ( !done ) {

      // Add a position to the current shell. Create a new entry for this shell if there isn't one yet.
      if ( !this.particleNodeTrellis[ currentShell ] ) {
        this.particleNodeTrellis.push( { radius: currentShellRadius, locations: [] } );
      }
      this.particleNodeTrellis[ currentShell ].locations.push( { angle: currentAngle, particle: null, jitterOffset: null } );
      totalPositions++;
      particlesPositionsInThisShell++;
      currentAngle += ( 2 * Math.PI ) / particlesAllowedInThisShell;
      if ( particlesPositionsInThisShell >= particlesAllowedInThisShell ) {

        if ( totalPositions < MAX_PARTICLE_NODES_SUPPORTED ) {

          // Time to move to the next shell.
          currentShell++;
          currentShellRadius = currentShellRadius + this.nucleonRadius * ( Math.pow( NUCLEUS_ENLARGEMENT_FACTOR, currentShell ) );
          currentAngle = 2 * Math.PI * dotRandom.nextDouble();
          particlesAllowedInThisShell = Math.floor( 2 * Math.PI * currentShellRadius / ( this.nucleonRadius * NUCLEUS_ENLARGEMENT_FACTOR ) );
          particlesPositionsInThisShell = 0;
        }
        else {

          // We're done - enough positions have been created to support the max allowed number of particles.
          done = true;
        }
      }
    }

    // Set up the initial batch of nucleon nodes.
    this.createParticleNodes();

    // Make some updates when the escape radius changes.
    this.escapeRadiusProperty?.link( () => {
      this.agitateNucleus();
    } );

    // Update the nucleus radius and position if the model-view transform changes. Note that this does the initial
    // positioning too.
    modelViewTransformProperty.link( mvt => {
      this.setNucleusRadius( mvt.modelToViewDeltaX( NuclearDecayCommonConstants.ATOM_RADIUS ) );
      this.update();
    } );

    if ( SHOW_RADIUS_NODE ) {
      const viewRadius = modelViewTransformProperty.value.modelToViewDeltaX( NuclearDecayCommonConstants.ATOM_RADIUS );
      this.radiusNode = new Circle( viewRadius, {
        fill: Color.GREEN.withAlpha( 0.1 ),
        stroke: Color.GREEN.withAlpha( 0.5 ),
        center: Vector2.ZERO
      } );
      this.addChild( this.radiusNode );
    }
    else {
      this.radiusNode = null;
    }
  }

  public agitateNucleus(): void {

    // So that alpha particles don't end up outside the tunneling radius when they aren't actually tunneling, move
    // them back to the nucleus if the escape radius changes.
    this.terminateAllAlphaExcursions();

    // Shuffle the particles when this change occurs to signal that it is, in some sense, a different nucleus.
    this.doMinorParticleShuffle();

    this.updateAgitationFactor( this.particleNodeTrellis[ this.particleNodeTrellis.length - 1 ].radius );
  }

  /**
   * Scale the shell radii so the outer shell matches the requested nucleus radius, and reposition any occupied
   * trellis locations to their new shell radii.
   *
   * @param radius - Desired overall nucleus radius in view coordinates.
   * @returns - Nothing.
   */
  private setNucleusRadius( radius: number ): void {

    // Determine the radius of the outer shell. Somewhat arbitrarily, the code says we have to have and outer shell of
    // at least one nucleon radius.  This value can't be zero or the calculations won't work.
    const outerShellRadius = Math.max( radius - this.nucleonRadius, this.nucleonRadius );

    const currentOuterShellRadius = this.particleNodeTrellis[ this.particleNodeTrellis.length - 1 ].radius;
    const scaleFactor = outerShellRadius / currentOuterShellRadius;

    this.particleNodeTrellis.forEach( shell => {
      shell.radius *= scaleFactor;
      shell.locations.forEach( location => {
        if ( location.particle !== null ) {
          location.particle.center = this.getParticlePositionForTrellisLocation( shell, location );
        }
      } );
    } );

    this.updateAgitationFactor( outerShellRadius );
  }

  /**
   * Update the "agitation factor" for the nucleus, meaning how much the particles are moving around. Generally
   * speaking, the more rapidly the atom is likely to decay, the more agitated the nucleus should appear.
   */
  private updateAgitationFactor( maxShellRadius: number ): void {

    // This is a normalized value from 0 to 1 indicating how agitated we want the nucleus to look.
    let agitationFactor = UPDATE_FREQUENCY_RANGE.expandNormalizedValue( 0.5 );

    if ( this.atom.hasDecayed ) {
      agitationFactor = 0;
    }
    else {

      if ( this.escapeRadiusProperty ) {
        agitationFactor = clamp( 1 - ( this.escapeRadiusProperty.value / ( maxShellRadius + this.nucleonRadius ) / 6 ), 0, 1 );
      }
    }

    this.updateFrequency = UPDATE_FREQUENCY_RANGE.expandNormalizedValue( agitationFactor );
    this.maxParticleJump = PARTICLE_JUMP_RANGE.expandNormalizedValue( agitationFactor );
    this.particleSwapProportion = PARTICLE_SWAP_PROPORTION_RANGE.expandNormalizedValue( agitationFactor );
  }

  /**
   * Update the non-time-dependent aspects of this node.
   */
  public update(): void {
    this.translation = this.modelViewTransformProperty.value.modelToViewPosition( this.atom.position );
    this.atomLabelNode.update();
    if ( this.radiusNode ) {
      this.radiusNode.setRadius(
        this.modelViewTransformProperty.value.modelToViewDeltaX( NuclearDecayCommonConstants.ATOM_RADIUS )
      );
    }
  }

  /**
   * Compute the current view position for a trellis location.
   * The location's jitterOffset is always treated as a local perturbation from the shell's natural position.
   */
  private getParticlePositionForTrellisLocation( shell: ShellLocations, location: LocationOnShell ): Vector2 {
    const basePosition = new Vector2( shell.radius, 0 ).rotated( location.angle );
    const jitterOffset = location.jitterOffset || Vector2.ZERO;
    return new Vector2( basePosition.x + jitterOffset.x, basePosition.y + jitterOffset.y );
  }

  /**
   * Add a particle to an open location on the trellis and position it accordingly.
   * This updates only trellis bookkeeping and the particle's center; it does not add to the scene graph.
   */
  private addParticleToTrellis( particleNode: Node ): void {
    for ( const shell of this.particleNodeTrellis ) {
      const openLocations = shell.locations.filter( location => location.particle === null );

      if ( openLocations.length > 0 ) {
        const selectedLocation = openLocations[ dotRandom.nextInt( openLocations.length ) ];
        selectedLocation.particle = particleNode;

        // Initial placement is exactly at the shell location, with no jitter.
        selectedLocation.jitterOffset = null;

        particleNode.center = this.getParticlePositionForTrellisLocation( shell, selectedLocation );
        return;
      }
    }

    affirm( false, 'No open location available in particleNodeTrellis.' );
  }

  /**
   * Remove a particle from the trellis, clearing its assigned location and jitter.
   */
  private removeParticleFromTrellis( particleNode: Node ): void {
    for ( const shell of this.particleNodeTrellis ) {
      const location = shell.locations.find( locationOnShell => locationOnShell.particle === particleNode );
      if ( location ) {
        location.particle = null;
        location.jitterOffset = null;
        return;
      }
    }
  }

  /**
   * Add the provided particle node as a child of this node and position it in an open spot on the trellis.  This is
   * filled in from the center position outward so that the nucleus looks like a fairly solid and round thing.
   */
  private addAndPositionParticleNode( particleNode: Node ): void {
    this.addParticleToTrellis( particleNode );
    this.addChild( particleNode );
  }

  /**
   * Clear all particle assignments and cached offsets from the trellis so it can be reused for a fresh layout pass.
   */
  private clearParticleNodeTrellisOccupancy(): void {
    this.particleNodeTrellis.forEach( shell => {
      shell.locations.forEach( location => {
        location.particle = null;
        location.jitterOffset = null;
      } );
    } );
  }

  /**
   * Get all particle nodes that are currently assigned to a location on the trellis.
   */
  public getParticlesOnTrellis(): Node[] {
    const particles: Node[] = [];
    this.particleNodeTrellis.forEach( shell => {
      shell.locations.forEach( location => {
        if ( location.particle !== null ) {
          particles.push( location.particle );
        }
      } );
    } );
    return particles;
  }

  /**
   * Advance the dynamic particle motion using real-time dt. The atom model emits a scaled dt, so rescale it here
   * back to real time using the same speed constant that the model uses to slow time on the graph.
   */
  public step( dt: number ): void {

    // Scale the dt back to real time using the same speed constant that the model uses to slow time on the graph, so
    // that we can use "real" time values for the constants in this file.
    const realDt = dt / NuclearDecayCommonConstants.NORMAL_SPEED_SCALE;

    const activeAtomConfig = this.atom.hasDecayed ? this.atom.atomConfigAfterDecay : this.atom.atomConfigBeforeDecay;

    if ( this.currentlyDepictedAtomConfig && !activeAtomConfig.equals( this.currentlyDepictedAtomConfig ) ) {
      this.createParticleNodes();
      this.updateAgitationFactor( this.particleNodeTrellis[ this.particleNodeTrellis.length - 1 ].radius );
      this.timeAccumulator = 0;

      // Put any alpha particles that are currently outside the nucleus back in.
      this.terminateAllAlphaExcursions();
    }

    // Update the excursion time for any alpha particles that are outside the nucleus. If their excursion time has
    // elapsed, put them back in the nucleus.
    const almostTunnelingAlphas = [ ...this.almostTunnelingAlphaParticles ];
    almostTunnelingAlphas.forEach( atap => {
      atap.remainingTimeOutsideNucleus = Math.max( atap.remainingTimeOutsideNucleus - dt, 0 );
      if ( atap.remainingTimeOutsideNucleus <= 0 ) {
        this.returnAlphaParticleNodeToNucleus( atap.alphaParticleNode );
      }
    } );

    // Move the particles around if enough time has passed since the last position update.
    this.timeAccumulator += realDt;
    if ( this.timeAccumulator > 1 / this.updateFrequency ) {
      this.updateParticlePositions();
      this.timeAccumulator = 0;
    }
  }

  /**
   * Updates a staggered subset of particle positions and then adjusts their layering so inner particles are more
   * likely to appear in front. This makes the nucleus appear dynamic in that the particles that comprise it move
   * around.
   */
  private updateParticlePositions(): void {

    // Get the particles that are currently part of the nucleus.
    const particleNodesInNucleus = this.getParticlesOnTrellis();

    // Randomly pick a subset of the particles to move.
    const particleNodesToMove = dotRandom.shuffle( particleNodesInNucleus ).slice(
      0,
      Math.max( 1, roundSymmetric( particleNodesInNucleus.length * 0.1 ) )
    );

    // Move the selected particles by creating or updating their offsets.
    particleNodesToMove.forEach( particleNode => {
      let shellForParticle: ShellLocations | null = null;
      let locationForParticle: LocationOnShell | null = null;

      for ( const shell of this.particleNodeTrellis ) {
        const location = shell.locations.find( locationOnShell => locationOnShell.particle === particleNode );
        if ( location ) {
          shellForParticle = shell;
          locationForParticle = location;
          break;
        }
      }

      affirm( !!shellForParticle && !!locationForParticle, 'Could not find particle in particleNodeTrellis.' );
      if ( !shellForParticle || !locationForParticle ) {
        return;
      }

      locationForParticle.jitterOffset = new Vector2( dotRandom.nextDouble() * this.maxParticleJump, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );
      particleNode.center = this.getParticlePositionForTrellisLocation( shellForParticle, locationForParticle );
    } );

    // Next, swap some of the particles' positions on the trellis to create more dynamic motion.
    const occupiedLocations = this.particleNodeTrellis.flatMap( shell =>
      shell.locations.filter( location => location.particle !== null ).map( location => ( {
        shell: shell,
        location: location
      } ) )
    );
    const numberOfSwaps = roundSymmetric( particleNodesInNucleus.length * this.particleSwapProportion );
    _.times( numberOfSwaps, () => {
      if ( occupiedLocations.length < 2 ) {
        return;
      }

      const firstIndex = dotRandom.nextInt( occupiedLocations.length );
      let secondIndex = dotRandom.nextInt( occupiedLocations.length - 1 );
      if ( secondIndex >= firstIndex ) {
        secondIndex++;
      }

      const first = occupiedLocations[ firstIndex ];
      const second = occupiedLocations[ secondIndex ];
      const firstParticle = first.location.particle;
      const secondParticle = second.location.particle;

      if ( !firstParticle || !secondParticle ) {
        return;
      }

      first.location.particle = secondParticle;
      second.location.particle = firstParticle;

      const firstBasePosition = new Vector2( first.shell.radius, 0 ).rotated( first.location.angle );
      const secondBasePosition = new Vector2( second.shell.radius, 0 ).rotated( second.location.angle );
      const firstJitterOffset = first.location.jitterOffset || Vector2.ZERO;
      const secondJitterOffset = second.location.jitterOffset || Vector2.ZERO;

      secondParticle.center = new Vector2( firstBasePosition.x + firstJitterOffset.x, firstBasePosition.y + firstJitterOffset.y );
      firstParticle.center = new Vector2( secondBasePosition.x + secondJitterOffset.x, secondBasePosition.y + secondJitterOffset.y );
    } );

    if ( !this.atom.hasDecayed ) {

      // Log the calculated nucleus size: the furthest-out particle's center distance plus one nucleon radius.
      const particleNodesSortedByDistance = [ ...particleNodesInNucleus ].sort( ( a, b ) => b.center.magnitude - a.center.magnitude );
      const nucleusSize = particleNodesSortedByDistance[ 0 ].center.magnitude + this.nucleonRadius;

      // If an escape radius was provided, randomly move some alpha particles out of the trellis and into the
      // almost-tunneling state, where they appear to move outside the nucleus but inside the escape radius.
      if ( this.escapeRadiusProperty ) {
        const escapeRadius = this.escapeRadiusProperty.value;
        const minimumAlmostTunnelingDistance = nucleusSize;

        if ( escapeRadius > minimumAlmostTunnelingDistance ) {
          this.alphaParticleNodes.forEach( alphaParticleNode => {

            // Skip any alpha particles that are already outside the nucleus.
            if ( this.almostTunnelingAlphaParticles.some( info => info.alphaParticleNode === alphaParticleNode ) ) {
              return;
            }

            // Decide randomly whether to move this alpha particle out of the nucleus and have it "almost tunnel".
            // Atoms with infinite half-lives (stable) do not even attempt to tunnel
            if ( this.atom.halfLife !== Infinity && dotRandom.nextInt( 200 ) === 0 ) {
              this.removeParticleFromTrellis( alphaParticleNode );

              const distanceRange = new Range( minimumAlmostTunnelingDistance, escapeRadius * 0.9 );

              const randomValue = 1 - Math.sqrt( dotRandom.nextDouble() ); // Bias towards being closer to the nucleus.

              const distance = distanceRange.expandNormalizedValue( randomValue );
              alphaParticleNode.center = new Vector2( distance, 0 ).rotated( dotRandom.nextDouble() * 2 * Math.PI );

              // Opacity decreases linearly with distance and reaches 0.1 at the escape radius.
              alphaParticleNode.opacity = Math.max( 0.1, 1 - 0.9 * distance / escapeRadius );

              // Track this "almost tunneling" alpha particle so it can be returned to the nucleus after some time.
              const excursionTime = ALPHA_PARTICLE_EXCURSION_TIME_RANGE.expandNormalizedValue( dotRandom.nextDouble() );
              this.almostTunnelingAlphaParticles.push( {
                alphaParticleNode: alphaParticleNode,
                remainingTimeOutsideNucleus: excursionTime
              } );
            }
          } );
        }
      }
    }

    // Update the layering.
    const particleNodesSortedByDistance = [ ...particleNodesInNucleus ].sort( ( a, b ) => b.center.magnitude - a.center.magnitude );
    particleNodesSortedByDistance.forEach( particleNode => particleNode.moveToFront() );
    this.atomLabelNode.moveToFront();
    this.radiusNode && this.radiusNode.moveToFront();
  }

  /**
   * Move some particles around in an efficient way to indicate the nucleus has changed. This method is intended to be
   * used when there are potentially a lot of changes coming in, and we can't take the time for a full update of the
   * nucleus.
   */
  private doMinorParticleShuffle(): void {

    // Go through each shell in the trellis and swap a few particles while keeping them on the same level. That way
    // there is no need to re-layer, which is expensive.

    this.particleNodeTrellis.forEach( shell => {
      const occupiedLocations = shell.locations.filter( location => location.particle !== null );

      // Only swap if there are at least 2 particles on this shell.
      if ( occupiedLocations.length >= 2 ) {

        // Do a couple of swaps on this shell.
        const numberOfSwaps = Math.min( 2, Math.floor( occupiedLocations.length / 2 ) );
        _.times( numberOfSwaps, () => {
          const firstIndex = dotRandom.nextInt( occupiedLocations.length );
          let secondIndex = dotRandom.nextInt( occupiedLocations.length - 1 );
          if ( secondIndex >= firstIndex ) {
            secondIndex++;
          }

          const firstLocation = occupiedLocations[ firstIndex ];
          const secondLocation = occupiedLocations[ secondIndex ];
          const firstParticle = firstLocation.particle;
          const secondParticle = secondLocation.particle;

          if ( firstParticle && secondParticle ) {

            // Swap the particles between the two locations.
            firstLocation.particle = secondParticle;
            secondLocation.particle = firstParticle;

            // Update their positions.
            const firstJitterOffset = firstLocation.jitterOffset || Vector2.ZERO;
            const secondJitterOffset = secondLocation.jitterOffset || Vector2.ZERO;
            secondParticle.center = new Vector2( shell.radius, 0 ).rotated( firstLocation.angle ).plus( firstJitterOffset );
            firstParticle.center = new Vector2( shell.radius, 0 ).rotated( secondLocation.angle ).plus( secondJitterOffset );
          }
        } );
      }
    } );
  }


  /**
   * Return the provided alpha particle node to the nucleus.
   */
  private returnAlphaParticleNodeToNucleus( alphaParticleNode: Node ): void {

    // Find the corresponding roaming alpha for this particle node.
    const index = this.almostTunnelingAlphaParticles.findIndex( info => info.alphaParticleNode === alphaParticleNode );
    affirm( index >= 0, 'alphaParticleNode is not currently roaming outside the nucleus' );

    // Update the particle node's state and the associated tracking data.
    alphaParticleNode.opacity = 1;
    this.almostTunnelingAlphaParticles.splice( index, 1 ); // Remove the particle node from this list.
    this.addParticleToTrellis( alphaParticleNode ); // Add the particle node back to the nucleus.
  }

  /**
   * Return any alpha particle nodes that are currently outside the nucleus back to being a part of it.
   */
  private terminateAllAlphaExcursions(): void {
    const almostTunnelingAlphas = [ ...this.almostTunnelingAlphaParticles ];
    almostTunnelingAlphas.forEach( atap => {
      this.returnAlphaParticleNodeToNucleus( atap.alphaParticleNode );
    } );
    this.almostTunnelingAlphaParticles.length = 0;
  }

  /**
   * Rebuild all proton, neutron, and alpha particle nodes and add them as children of the root node based on the
   * current atom configuration.
   */
  private createParticleNodes(): void {

    const activeAtomConfig = this.atom.hasDecayed ?
                             this.atom.atomConfigAfterDecay :
                             this.atom.atomConfigBeforeDecay;

    // Remove existing nodes.
    [ ...this.protonNodes, ...this.neutronNodes, ...this.alphaParticleNodes ].forEach( node => {
      this.removeChild( node );
    } );

    // Clear occupancy in the trellis before assigning the new node set.
    this.clearParticleNodeTrellisOccupancy();

    this.protonNodes.length = 0;
    this.neutronNodes.length = 0;
    this.alphaParticleNodes.length = 0;

    const protonCount = activeAtomConfig.protonCount;
    const neutronCount = activeAtomConfig.neutronCount;

    // Decide how many particles of each type to display.
    const {
      individualProtonCount,
      individualNeutronCount,
      alphaParticleCount
    } = DynamicNucleusNode.getDisplayedParticleCounts( protonCount, neutronCount );

    // Create the particle nodes.

    _.times( individualProtonCount, () => {
      const protonNode = DynamicNucleusNode.createProtonNode( this.nucleonRadius );
      this.protonNodes.push( protonNode );
    } );

    _.times( individualNeutronCount, () => {
      const neutronNode = DynamicNucleusNode.createNeutronNode( this.nucleonRadius );
      this.neutronNodes.push( neutronNode );
    } );

    _.times( alphaParticleCount, () => {
      const alphaParticleNode = DynamicNucleusNode.createAlphaParticle(
        this.nucleonRadius,
        dotRandom.nextDouble() * 2 * Math.PI
      );
      this.alphaParticleNodes.push( alphaParticleNode );
    } );

    // Add and position the particle nodes that were just created.
    const particleNodes = dotRandom.shuffle( [ ...this.protonNodes, ...this.neutronNodes, ...this.alphaParticleNodes ] );
    particleNodes.forEach( particleNode => this.addAndPositionParticleNode( particleNode ) );

    // Relayer the nodes to get the desired look, with the particles in the center towards the top of the z-order.
    const particleNodesSortedByDistance = [ ...particleNodes ].sort( ( a, b ) => b.center.magnitude - a.center.magnitude );
    particleNodesSortedByDistance.forEach( particleNode => particleNode.moveToFront() );

    // Make sure the label is out in front of the z-order.
    this.atomLabelNode.moveToFront();

    // If the radius node is present, make sure it is in front of the z-order.
    this.radiusNode && this.radiusNode.moveToFront();

    this.currentlyDepictedAtomConfig = activeAtomConfig;
  }

  /**
   * Determine how many individual protons/neutrons and alpha particles to render.
   */
  private static getDisplayedParticleCounts( protonCount: number, neutronCount: number ): {
    individualProtonCount: number;
    individualNeutronCount: number;
    alphaParticleCount: number;
  } {
    const totalNucleonCount = protonCount + neutronCount;
    if ( totalNucleonCount === 0 ) {
      return {
        individualProtonCount: 0,
        individualNeutronCount: 0,
        alphaParticleCount: 0
      };
    }

    // Calculate the number of nucleons to display.  This uses some "real" formulas for estimating the number of
    // spheres that would be visible in a 2D depiction of tightly packed set, but is tweaked to get the look we wanted.
    // Adjust as needed.
    const numberOfNucleonsToDisplay = totalNucleonCount < 5 ?
                                      totalNucleonCount :
                                      Math.ceil( 3.5 * Math.pow( totalNucleonCount, 2 / 3 ) );

    const displayedProtonCount = roundSymmetric( numberOfNucleonsToDisplay * protonCount / totalNucleonCount );
    const displayedNeutronCount = numberOfNucleonsToDisplay - displayedProtonCount;

    // About half of the represented nucleons are grouped into alpha particles (4 nucleons each).
    const alphaParticleCount = Math.min(
      Math.floor( numberOfNucleonsToDisplay / 8 ),
      Math.floor( displayedProtonCount / 2 ),
      Math.floor( displayedNeutronCount / 2 )
    );

    return {
      individualProtonCount: displayedProtonCount - 2 * alphaParticleCount,
      individualNeutronCount: displayedNeutronCount - 2 * alphaParticleCount,
      alphaParticleCount: alphaParticleCount
    };
  }

  private static createProtonNode( nucleonRadius: number ): ShadedSphereNode {
    return new ShadedSphereNode( 2 * nucleonRadius, {
      mainColor: ShredColors.protonColorProperty
    } );
  }

  private static createNeutronNode( nucleonRadius: number ): ShadedSphereNode {
    return new ShadedSphereNode( 2 * nucleonRadius, {
      mainColor: ShredColors.neutronColorProperty
    } );
  }

  private static createAlphaParticle( nucleonRadius: number, rotationalAngle: number ): Node {
    affirm( rotationalAngle >= 0 && rotationalAngle <= Math.PI * 2, 'out of range rotation angle' );
    const p1 = DynamicNucleusNode.createProtonNode( nucleonRadius );
    const p2 = DynamicNucleusNode.createProtonNode( nucleonRadius );
    const n1 = DynamicNucleusNode.createNeutronNode( nucleonRadius );
    const n2 = DynamicNucleusNode.createNeutronNode( nucleonRadius );
    const nucleonPositioningVector = new Vector2( -nucleonRadius, 0 ).rotated( rotationalAngle );
    n1.center = nucleonPositioningVector.copy();
    nucleonPositioningVector.rotate( Math.PI );
    n2.center = nucleonPositioningVector.copy();
    nucleonPositioningVector.multiplyScalar( 0.75 ); // multiplier empirically determined
    nucleonPositioningVector.rotate( Math.PI / 2 );
    p1.center = nucleonPositioningVector.copy();
    nucleonPositioningVector.rotate( Math.PI );
    p2.center = nucleonPositioningVector.copy();

    return new Node( { children: [ p2, n1, n2, p1 ] } );
  }
}

export default DynamicNucleusNode;