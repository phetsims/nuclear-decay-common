// Copyright 2026, University of Colorado Boulder
/**
 * Subclass of Isotope which is in the process of decaying, so it has information on time and others.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import TProperty from '../../../axon/js/TProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import Isotope, { IsotopeOptions } from './Isotope.js';

type SelfOptions = EmptySelfOptions;

export type DecayingIsotopeOptions = SelfOptions & IsotopeOptions;

export default class DecayingAtom extends Isotope {

  public readonly timeProperty: TProperty<number>;

  public constructor( protons: number, neutrons: number, providedOptions: DecayingIsotopeOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, DecayingIsotopeOptions>()( {
      // Default options go here
    }, providedOptions );

    super( protons, neutrons, options );

    this.timeProperty = new NumberProperty( 0 );
  }

  public static startDecay( isotope: Isotope ): DecayingAtom {
    return new DecayingAtom( isotope.protonCountProperty.value, isotope.neutronCountProperty.value, {
      decaysInto: isotope.decaysIntoProperty.value
    } );
  }

  public step( dt: number ): void {
    this.timeProperty.value += dt;

    if ( this.halfLifeProperty.value && this.decaysIntoProperty.value && this.timeProperty.value > this.halfLifeProperty.value ) {
      // Do something when it decays, e.g. KABOOM
    }
  }
}

nuclearDecayCommon.register( 'DecayingAtom', DecayingAtom );