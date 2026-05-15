// Copyright 2026, University of Colorado Boulder
/**
 * Node that displays a legend for the three particle types used in Nuclear Decay simulations:
 * Proton, Neutron, and Alpha Particle. Each entry shows a ShadedSphereNode icon next to a label.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ShredColors from '../../../../shred/js/ShredColors.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonStrings from '../../NuclearDecayCommonStrings.js';
import AlphaParticleNode from './AlphaParticleNode.js';

type SelfOptions = EmptySelfOptions;

export type ParticlesLegendNodeOptions = SelfOptions & PanelOptions;

const ITEM_SPACING = 6;
const SPHERE_DIAMETER = NuclearDecayCommonConstants.NUCLEON_DIAMETER;

export default class ParticlesLegendNode extends Panel {
  public constructor( providedOptions?: ParticlesLegendNodeOptions ) {
    const options = optionize<ParticlesLegendNodeOptions, SelfOptions, PanelOptions>()( {
      fill: NuclearDecayCommonConstants.MAIN_PANEL_FILL,
      layoutOptions: {
        stretch: true
      }
    }, providedOptions );

    const particleLegendItem = (
      labelIconNode: Node,
      labelStringProperty: TReadOnlyProperty<string>,
      providedOptions?: HBoxOptions
    ): HBox => {
      return new HBox( combineOptions<HBoxOptions>( {
        spacing: ITEM_SPACING,
        children: [
          labelIconNode,
          new RichText( labelStringProperty, {
            font: NuclearDecayCommonConstants.CONTROL_FONT,
            maxWidth: NuclearDecayCommonConstants.TEXT_MAX_WIDTH
          } )
        ]
      }, providedOptions ) );
    };

    const protonLegend = particleLegendItem(
      new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.protonColorProperty } ),
      NuclearDecayCommonStrings.protonStringProperty
    );

    const neutronLegend = particleLegendItem(
      new ShadedSphereNode( SPHERE_DIAMETER, { mainColor: ShredColors.neutronColorProperty } ),
      NuclearDecayCommonStrings.neutronStringProperty
    );

    const alphaParticleIcon = new AlphaParticleNode( {
      nucleonDiameter: SPHERE_DIAMETER
    } );

    const alphaParticleLegend = particleLegendItem(
      alphaParticleIcon,
      NuclearDecayCommonStrings.alphaParticleStringProperty
    );

    const content = new HBox( {
      spacing: 20,
      align: 'center',
      justify: 'center',
      yMargin: 5,
      children: [
        new VBox( {
          spacing: 10,
          align: 'left',
          children: [ protonLegend, neutronLegend ]
        } ),
        alphaParticleLegend
      ]
    } );

    super( content, options );
  }
}
