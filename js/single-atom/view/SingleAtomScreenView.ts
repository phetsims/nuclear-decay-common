// Copyright 2026, University of Colorado Boulder

/**
 * SingleAtomScreenView is responsible for the visual representation of the Single Atom Screen
 * in the Alpha and Beta Decay simulations.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import DynamicNucleusNode from '../../common/view/DynamicNucleusNode.js';
import SingleAndMultipleAtomsScreenView, { SingleAndMultipleAtomsScreenViewOptions } from '../../common/view/SingleAndMultipleAtomsScreenView.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import SingleAtomModel from '../model/SingleAtomModel.js';
import EquationAccordionBox from './EquationAccordionBox.js';
import ParticleCountsAccordionBox from './ParticleCountsAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type SingleAtomScreenViewOptions = SelfOptions & SingleAndMultipleAtomsScreenViewOptions;

export default class SingleAtomScreenView extends SingleAndMultipleAtomsScreenView {

  public readonly particleCountsAccordionBox: ParticleCountsAccordionBox;

  public readonly equationAccordionBox: EquationAccordionBox;

  protected declare atomNodes: DynamicNucleusNode[];

  public constructor( model: SingleAtomModel, providedOptions: SingleAndMultipleAtomsScreenViewOptions ) {

    const options = optionize<SingleAtomScreenViewOptions, SelfOptions, SingleAndMultipleAtomsScreenViewOptions>()( {
    }, providedOptions );

    super( model, options );

    const replayButton = new RestartButton( {
      listener: () => {
        model.replay();
        this.updateAtomNodes();
      },
      enabledProperty: model.hasDecayOccurredProperty,
      accessibleName: NuclearDecayCommonFluent.a11y.replayDecay.accessibleNameStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.replayDecay.accessibleHelpTextStringProperty,
      tandem: options.tandem.createTandem( 'replayButton' )
    } );
    this.timeControlNode.addPushButton( replayButton, 0 );

    // Right contents panel
    this.particleCountsAccordionBox = new ParticleCountsAccordionBox( model, {
      tandem: options.tandem.createTandem( 'particleCountsAccordionBox' )
    } );

    this.equationAccordionBox = new EquationAccordionBox( model.selectedIsotopeProperty,
      model.isPlayAreaEmptyProperty,
      model.hasDecayOccurredProperty,
      model.selectedIsotopeProperty.derived( isotope => isotope === 'custom' ),
      {
        tandem: options.tandem.createTandem( 'equationAccordionBox' ),
        expandedDefaultValue: false
      } );
    this.rightColumnControls.addChild( this.particleCountsAccordionBox );
    this.rightColumnControls.addChild( this.equationAccordionBox );

    Multilink.multilink( [ model.potentialEnergyProperty, model.alphaParticleEnergyProperty ], () => {
      model.resetAtomDecayStates();
      this.atomNodes.forEach( atomNode => {
        atomNode.agitateNucleus();
      } );
    } );

    // Control area PDOM order: Time Controls → Reset All
    this.pdomControlAreaNode.pdomOrder = [
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
    this.equationAccordionBox.reset();
    this.particleCountsAccordionBox.reset();
  }
}
