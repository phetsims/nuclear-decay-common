// Copyright 2026, University of Colorado Boulder

/**
 * SingleAtomScreenView is responsible for the visual representation of the Single Atom Screen
 * in the Alpha and Beta Decay simulations.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import EquationAccordionBox from '../../../../nuclear-decay-common/js/common/view/EquationAccordionBox.js';
import ParticleCountsAccordionBox from '../../../../nuclear-decay-common/js/common/view/ParticleCountsAccordionBox.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import DecayHistogramScreenView, { DecayHistogramScreenViewOptions } from '../../common/view/DecayHistogramScreenView.js';
import SingleAtomModel from '../model/SingleAtomModel.js';

type SelfOptions = EmptySelfOptions;

export type SingleAtomScreenViewOptions = SelfOptions & DecayHistogramScreenViewOptions;

export default class SingleAtomScreenView extends DecayHistogramScreenView {

  public readonly particleCountsAccordionBox: Node;

  public readonly equationAccordionBox: Node;

  public constructor( model: SingleAtomModel, providedOptions: DecayHistogramScreenViewOptions ) {

    const options = optionize<SingleAtomScreenViewOptions, SelfOptions, DecayHistogramScreenViewOptions>()( {
      // TODO: Move from Alpha Decay to here https://github.com/phetsims/alpha-decay/issues/3
      // screenSummaryContent: new ADSingleAtomScreenSummaryContent( model )
    }, providedOptions );

    super( model, options );

    // Right contents panel
    this.particleCountsAccordionBox = new ParticleCountsAccordionBox( model, {
      tandem: options.tandem.createTandem( 'particleCountsAccordionBox' )
    } );
    this.equationAccordionBox = new EquationAccordionBox( model.selectedIsotopeProperty,
      model.isPlayAreaEmptyProperty,
      model.hasDecayOccurredProperty,
      {
        tandem: options.tandem.createTandem( 'equationAccordionBox' )
      } );
    this.rightColumnControls.addChild( this.particleCountsAccordionBox );
    this.rightColumnControls.addChild( this.equationAccordionBox );

    // Heading node grouping the decay timeline histogram panel under "Decay Data".
    const decayDataHeadingNode = new Node( {

      // TODO: Move from Alpha Decay to here https://github.com/phetsims/alpha-decay/issues/3
      // accessibleHeading: AlphaDecayFluent.a11y.decayDataHeadingStringProperty
    } );
    this.addChild( decayDataHeadingNode );

    // Control area PDOM order: Time Controls → Reset All
    this.pdomControlAreaNode.pdomOrder = [
      this.timeControlNode,
      this.resetAllButton
    ];
  }
}
