// Copyright 2026, University of Colorado Boulder

/**
 * Screen summary content for the Decay Rate screen, shared between alpha and beta decay sims.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import NuclearDecayModel from '../../common/model/NuclearDecayModel.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';

export default class DecayRateScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: NuclearDecayModel ) {

    const currentDetailsStringProperty = NuclearDecayCommonFluent.a11y.decayRate.screenSummary.currentDetails.createProperty( {
      atom: model.isPlayAreaEmptyProperty.derived( isEmpty => isEmpty ? 'noAtoms' : 'withAtoms' ),
      percentage: model.percentageOfUndecayedProperty.derived( p => `${roundSymmetric( p * 100 )}` )
    } );

    const interactionHintStringProperty = new DerivedStringProperty(
      [
        model.decayedCountProperty,
        NuclearDecayCommonFluent.a11y.decayRate.screenSummary.interactionHint.addAtomsStringProperty,
        NuclearDecayCommonFluent.a11y.decayRate.screenSummary.interactionHint.afterDecayStringProperty
      ],
      ( decayedCount, addHint, afterHint ) => decayedCount > 0 ? afterHint : addHint
    );

    super( {
      playAreaContent: NuclearDecayCommonFluent.a11y.decayRate.screenSummary.playAreaStringProperty,
      controlAreaContent: NuclearDecayCommonFluent.a11y.decayRate.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: interactionHintStringProperty
    } );
  }
}
