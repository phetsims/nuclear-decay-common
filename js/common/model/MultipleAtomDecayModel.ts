// Copyright 2026, University of Colorado Boulder
/**
 * Model for multiple atom screens in alpha and beta decay
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NuclearDecayModel, { NuclearDecayModelOptions, SelectableIsotopes } from './NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

export type MultipleAtomDecayModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class MultipleAtomDecayModel extends NuclearDecayModel {

  public constructor(
    selectableIsotopes: SelectableIsotopes[],
    providedOptions?: MultipleAtomDecayModelOptions
  ) {
    const options = optionize<MultipleAtomDecayModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
    }, providedOptions );

    super( selectableIsotopes, options );
  }
}
