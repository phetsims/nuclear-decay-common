// Copyright 2026, University of Colorado Boulder
/**
 * Model for decay rates screens in alpha and beta decay
 *
 * @author Agustín Vallejo
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import NuclearDecayModel, { NuclearDecayModelOptions, SelectableIsotopes } from './NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

export type DecayRateModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class DecayRateModel extends NuclearDecayModel {
  public constructor(
    selectableIsotopes: SelectableIsotopes[],
    providedOptions?: DecayRateModelOptions
  ) {
    const options = optionize<DecayRateModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
      // Default options go here
    }, providedOptions );

    super( selectableIsotopes, options );
    //nop
  }
}