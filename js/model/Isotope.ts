// Copyright 2026, University of Colorado Boulder
/**
 * Base model for a specific Isotope, which will hold the state of the isotope and perform any necessary
 * calculations related to its decay.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import AtomIdentifier from '../../../shred/js/AtomIdentifier.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonFluent from '../NuclearDecayCommonFluent.js';

type SelfOptions = {
  decaysInto?: Isotope | null; // Optional property to specify the isotope that this one decays into
};

export type IsotopeOptions = SelfOptions;

export default class Isotope {

  // Name of the element regardless of isotope, e.g. "Polonium"
  public readonly elementNameStringProperty: TReadOnlyProperty<string>;

  // Symbol of the element regardless of isotope, e.g. "Po"
  public readonly elementSymbolStringProperty: TReadOnlyProperty<string>;

  // Name of the isotope, e.g. "Polonium-211"
  public readonly isotopeNameStringProperty: TReadOnlyProperty<string>;

  // Symbol of the isotope, e.g. "<sup>211</sup>Po". Intended for use with RichText.
  public readonly isotopeSymbolStringProperty: TReadOnlyProperty<string>;

  public readonly protonCountProperty: TReadOnlyProperty<number>;
  public readonly neutronCountProperty: TReadOnlyProperty<number>;
  public readonly massNumberProperty: TReadOnlyProperty<number>;

  public readonly decaysIntoProperty: TReadOnlyProperty<Isotope | null>;

  public readonly halfLifeProperty: TReadOnlyProperty<number | null>;

  public constructor( protons: number, neutrons: number, providedOptions?: IsotopeOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, IsotopeOptions>()( {
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
        console.log( AtomIdentifier.getNuclideHalfLife( protonCount, neutronCount ) );
        return AtomIdentifier.getNuclideHalfLife( protonCount, neutronCount );
      }
    );

    this.elementNameStringProperty = AtomIdentifier.createDynamicNameProperty( this.protonCountProperty );

    this.elementSymbolStringProperty = this.protonCountProperty.derived( protons => AtomIdentifier.getSymbol( protons ) );

    this.isotopeNameStringProperty = new DerivedStringProperty(
      [
        this.massNumberProperty,
        this.elementNameStringProperty,
        NuclearDecayCommonFluent.isotopeNameNumberPatternStringProperty
      ], ( massNumber: number, elementName: string, pattern: string ) => {
        return StringUtils.fillIn( pattern, {
          name: elementName,
          massNumber: massNumber
        } );
      } );

    this.isotopeSymbolStringProperty = new DerivedStringProperty(
      [
        this.massNumberProperty,
        NuclearDecayCommonFluent.isotopeNumberSymbolPatternStringProperty
      ], ( massNumber: number, pattern: string ) => {
        return StringUtils.fillIn( pattern, {
          massNumber: massNumber,
          symbol: AtomIdentifier.getSymbol( protons )
        } );
      } );

  }
}

nuclearDecayCommon.register( 'Isotope', Isotope );