// Copyright 2026, University of Colorado Boulder
/**
 * Base model for a specific Isotope, which will hold the state of the isotope and perform any necessary
 * calculations related to its decay.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import AtomIdentifier from '../../../shred/js/AtomIdentifier.js';

type SelfOptions = {
  decaysInto?: Isotope | null; // Optional property to specify the isotope that this one decays into
};

export type IsotopeOptions = SelfOptions;

export default class Isotope {

  public readonly elementNameStringProperty: TReadOnlyProperty<string>;

  public readonly protonCountProperty: TReadOnlyProperty<number>;
  public readonly neutronCountProperty: TReadOnlyProperty<number>;

  public readonly decaysIntoProperty: TReadOnlyProperty<Isotope> | null;

  public constructor( protons: number, neutrons: number, providedOptions?: IsotopeOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, IsotopeOptions>()( {
      decaysInto: null
    }, providedOptions );

    this.protonCountProperty = new NumberProperty( protons );
    this.neutronCountProperty = new NumberProperty( neutrons );

    this.decaysIntoProperty = options.decaysInto ? new Property<Isotope>( options.decaysInto ) : null;

    this.elementNameStringProperty = AtomIdentifier.createDynamicNameProperty( this.protonCountProperty );
  }
}

nuclearDecayCommon.register( 'Isotope', Isotope );