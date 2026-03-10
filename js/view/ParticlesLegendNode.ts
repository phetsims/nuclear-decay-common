// Copyright 2026, University of Colorado Boulder
/**
 * Node that displays a legend for the three particle types used in Nuclear Decay simulations:
 * Proton, Neutron, and Alpha Particle. Each entry shows a ShadedSphereNode icon next to a label.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import ShredColors from '../../../shred/js/ShredColors.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';
import NuclearDecayCommonStrings from '../NuclearDecayCommonStrings.js';

type SelfOptions = EmptySelfOptions;

export type ParticlesLegendNodeOptions = SelfOptions & NodeOptions;

const LABEL_FONT = new PhetFont( 14 );
const ITEM_SPACING = 6;
const SPHERE_DIAMETER = NuclearDecayCommonConstants.NUCLEON_DIAMETER;

export default class ParticlesLegendNode extends Node {
  public constructor( providedOptions?: ParticlesLegendNodeOptions ) {
    const options = optionize<ParticlesLegendNodeOptions, SelfOptions, NodeOptions>()( {
    }, providedOptions );

    const particleLegendItem = (
      labelIconNode: Node,
      labelStringProperty: TReadOnlyProperty<string>
    ): HBox => {
      return new HBox( {
        spacing: ITEM_SPACING,
        children: [
          labelIconNode,
          new RichText( labelStringProperty, { font: LABEL_FONT } )
        ]
      } );
    };

    const protonLegend = particleLegendItem(
      new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.protonColorProperty } ),
      NuclearDecayCommonStrings.protonStringProperty
    );

    const neutronLegend = particleLegendItem(
      new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.neutronColorProperty } ),
      NuclearDecayCommonStrings.neutronStringProperty
    );

    const PARTICLE_OFFSET = 0.7 * SPHERE_DIAMETER; // The distance between the centers of the particles in the alpha particle icon, with some overlap for aesthetics
    const alphaParticleIcon = new Node( {
      children: [
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.protonColorProperty, x: 0, y: 0 } ),
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.neutronColorProperty, x: PARTICLE_OFFSET, y: 0 } ),
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.neutronColorProperty, x: 0, y: PARTICLE_OFFSET } ),
        new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.protonColorProperty, x: PARTICLE_OFFSET, y: PARTICLE_OFFSET } )
      ]
    } );

    const alphaParticleLegend = particleLegendItem(
      alphaParticleIcon,
      NuclearDecayCommonStrings.alphaParticleStringProperty
    );

    const content = new HBox( {
      spacing: 16,
      align: 'center',
      children: [
        new VBox( {
          spacing: 8,
          align: 'left',
          children: [ protonLegend, neutronLegend ]
        } ),
        alphaParticleLegend
      ]
    } );

    super( options );
    this.addChild( content );
  }
}

nuclearDecayCommon.register( 'ParticlesLegendNode', ParticlesLegendNode );
