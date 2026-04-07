// Copyright 2026, University of Colorado Boulder
/**
 * Base model for a specific Isotope, which will hold the state of the isotope and perform any necessary
 * calculations related to its decay.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import AtomInfoUtils from '../../../shred/js/AtomInfoUtils.js';

type SelfOptions = {
  decaysInto?: Isotope | null; // Optional property to specify the isotope that this one decays into
};

export type IsotopeOptions = SelfOptions;

export default class Isotope {

  public readonly protonCountProperty: TReadOnlyProperty<number>;
  public readonly neutronCountProperty: TReadOnlyProperty<number>;
  public readonly massNumberProperty: TReadOnlyProperty<number>;

  public readonly decaysIntoProperty: TReadOnlyProperty<Isotope | null>;

  public readonly halfLifeProperty: TReadOnlyProperty<number | null>;

  public constructor( protons: number, neutrons: number, providedOptions?: IsotopeOptions ) {
    const options = optionize<IsotopeOptions, SelfOptions, IsotopeOptions>()( {
      decaysInto: null
    }, providedOptions );

    this.protonCountProperty = new NumberProperty( protons );
    this.neutronCountProperty = new NumberProperty( neutrons );
    this.massNumberProperty = new DerivedProperty(
      [
        this.protonCountProperty,
        this.neutronCountProperty
      ], ( protonCount: number, neutronCount: number ) => {
        return protonCount + neutronCount;
      }
    );

    this.decaysIntoProperty = new Property<Isotope | null>( options.decaysInto );

    this.halfLifeProperty = new DerivedProperty(
      [
        this.protonCountProperty,
        this.neutronCountProperty
      ], ( protonCount: number, neutronCount: number ) => {
        return AtomInfoUtils.getNuclideHalfLife( protonCount, neutronCount );
      }
    );

  }
}
