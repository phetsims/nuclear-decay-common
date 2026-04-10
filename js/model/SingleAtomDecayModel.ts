// Copyright 2026, University of Colorado Boulder
/**
 * Model for single atom screens in alpha and beta decay
 *
 * @author Agustín Vallejo
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import NuclearDecayModel, { NuclearDecayModelOptions, SelectableIsotopes } from './NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

export type SingleAtomDecayModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class SingleAtomDecayModel extends NuclearDecayModel {
  public constructor(
    selectableIsotopes: SelectableIsotopes[],
    providedOptions?: SingleAtomDecayModelOptions
  ) {
    const options = optionize<SingleAtomDecayModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
      // Default options go here
    }, providedOptions );

    super( selectableIsotopes, options );
    //nop
  }
}