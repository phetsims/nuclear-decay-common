// Copyright 2026, University of Colorado Boulder
/**
 * Utility that formats a time string given a timescale (linear or exponential)
 *
 * e.g. linear -> '912.2' ; exponential -> '9.1 times 10 to the 2'
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */


import { toFixed } from '../../../../dot/js/util/toFixed.js';
import ScientificNotationNode from '../../../../scenery-phet/js/ScientificNotationNode.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import { Timescale } from '../model/NuclearDecayModel.js';

const formatTimescaleStrings = ( value: number, timescale: Timescale, decimals = 1 ): string => {
  if ( timescale === 'linear' ) {
    return toFixed( value, decimals );
  }
  else {
    return NuclearDecayCommonFluent.a11y.scientificNotation.format(
      ScientificNotationNode.toScientificNotation( value, { mantissaDecimalPlaces: decimals } )
    );
  }
};

export default formatTimescaleStrings;