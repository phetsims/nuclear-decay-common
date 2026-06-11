// Copyright 2026, University of Colorado Boulder
/**
 * Model for multiple atom screens in alpha and beta decay
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { DecayType } from '../../../../shred/js/AtomInfoUtils.js';
import { StartingIsotopes } from '../../common/model/NuclearDecayAtom.js';
import NuclearDecayModel, { NuclearDecayModelOptions } from '../../common/model/NuclearDecayModel.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';

type SelfOptions = EmptySelfOptions;

export type MultipleAtomDecayModelOptions = SelfOptions & NuclearDecayModelOptions;

export default class MultipleAtomsModel extends NuclearDecayModel {

  public constructor(
    startingIsotopes: StartingIsotopes[],
    decayType: DecayType,
    providedOptions?: MultipleAtomDecayModelOptions
  ) {
    const options = optionize<MultipleAtomDecayModelOptions, SelfOptions, NuclearDecayModelOptions>()( {
      maxNumberOfAtoms: NuclearDecayCommonConstants.MAX_ATOMS_SECOND_SCREEN,
      defaultAtomsToAdd: 10
    }, providedOptions );

    super( startingIsotopes, decayType, options );

    this.selectedIsotopeProperty.link( () => {
      this.atomsToAddProperty.reset();
    } );
  }
}
