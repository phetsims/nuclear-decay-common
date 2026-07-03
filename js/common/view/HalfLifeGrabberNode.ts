// Copyright 2026, University of Colorado Boulder
/**
 * HalfLifeGrabberNode is a draggable node that allows the user to adjust the half-life of the custom isotope
 * in the Nuclear Decay simulation suite.
 * It is implemented as an AccessibleSlider, which provides keyboard accessibility and screen reader support.
 *
 * @author Agustín Vallejo
 */

import { clamp } from '../../../../dot/js/util/clamp.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import AccessibleSlider, { type AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayModel, { Timescale } from '../model/NuclearDecayModel.js';
import formatTimescaleStrings from './formatTimescaleStrings.js';

type SelfOptions = EmptySelfOptions;

type ParentOptions = ShadedSphereNodeOptions & AccessibleSliderOptions;

export type ContextResponseAlert = ( mappedValue: number, newValue: number, oldValue: number ) => string;

export type HalfLifeGrabberNodeOptions = SelfOptions & StrictOmit<ParentOptions,
  'valueProperty' | 'enabledRangeProperty' | 'startDrag' | 'drag' | 'endDrag'>;

const EXPONENT_RANGE = NuclearDecayCommonConstants.EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE;

// Small, nonzero delta so that a shift+arrow press changes the normalized value at all. constrainValue below is what
// actually determines the resulting mantissa, this just needs to point the value in the right direction.
const EXPONENTIAL_SHIFT_KEYBOARD_STEP = 1 / ( 100 * EXPONENT_RANGE.getLength() );

export default class HalfLifeGrabberNode extends AccessibleSlider( ShadedSphereNode, 1 ) {

  public constructor( model: NuclearDecayModel, providedOptions?: HalfLifeGrabberNodeOptions ) {

    const valueChangeSoundPlayer = new ValueChangeSoundPlayer( model.customHalfLifeProperty.rangeProperty, {
      numberOfMiddleThresholds: EXPONENT_RANGE.getLength()
    } );
    let previousValue = model.customHalfLifeProperty.value;

    // In linear time, the keyboard steps are given in seconds (matching NuclearDecayCommonConstants.LINEAR_HALF_LIFE),
    // so they need to be converted to the normalized [0,1] range that customHalfLifeProperty actually uses. In
    // exponential time, the keyboardStep moves the exponent by 1 (e.g. 10^3 -> 10^4) and the pageKeyboardStep moves
    // it by 3 (like the ticks in the graph); constrainValue (below) is responsible for snapping the shiftKeyboardStep
    // presses to whole mantissa values (e.g. 4e5 -> 5e5).
    const getKeyboardSteps = ( timescale: Timescale ): Pick<ParentOptions, 'keyboardStep' | 'shiftKeyboardStep' | 'pageKeyboardStep'> => {
      if ( timescale === 'linear' ) {
        const linearRangeLength = NuclearDecayCommonConstants.LINEAR_HALF_LIFE.getLength();
        return {
          keyboardStep: 0.2 / linearRangeLength,
          shiftKeyboardStep: 0.1 / linearRangeLength,
          pageKeyboardStep: 0.4 / linearRangeLength
        };
      }
      return {
        keyboardStep: 1 / EXPONENT_RANGE.getLength(),
        shiftKeyboardStep: EXPONENTIAL_SHIFT_KEYBOARD_STEP,
        pageKeyboardStep: 3 / EXPONENT_RANGE.getLength()
      };
    };

    const initialKeyboardSteps = getKeyboardSteps( model.timescaleProperty.value );

    const options = optionize<HalfLifeGrabberNodeOptions, SelfOptions, ParentOptions>()( {

      valueProperty: model.customHalfLifeProperty,
      enabledRangeProperty: model.customHalfLifeProperty.rangeProperty,

      keyboardStep: initialKeyboardSteps.keyboardStep,
      shiftKeyboardStep: initialKeyboardSteps.shiftKeyboardStep,
      pageKeyboardStep: initialKeyboardSteps.pageKeyboardStep,

      // In exponential time, snap keyboard input to values with a whole-number mantissa (e.g. 4e5, not 4.2e5).
      // Shift+arrow moves exactly one mantissa step (1-9, wrapping to the next decade), in the direction of travel;
      // plain and page arrow presses (which move by whole exponents already) just round to the nearest exponent.
      // See https://github.com/phetsims/sun/issues/698 for why direction (via this.shiftKeyDown) matters here: a
      // fixed-size shiftKeyboardStep can land closer to its starting mantissa than to the next one, in which case
      // naive "nearest" rounding would silently cancel the key press.
      constrainValue: ( value: number ): number => {
        if ( model.timescaleProperty.value !== 'exponential' ) {
          return value;
        }

        const oldExponent = EXPONENT_RANGE.expandNormalizedValue( model.customHalfLifeProperty.value );
        const newExponent = EXPONENT_RANGE.expandNormalizedValue( value );

        let snappedExponent: number;
        if ( this.shiftKeyDown ) {
          const magnitude = Math.floor( oldExponent );
          const mantissa = roundSymmetric( Math.pow( 10, oldExponent - magnitude ) );

          if ( newExponent > oldExponent ) {
            snappedExponent = mantissa >= 10 ? magnitude + 1 : magnitude + Math.log10( mantissa + 1 );
          }
          else if ( newExponent < oldExponent ) {
            snappedExponent = mantissa <= 1 ? magnitude - 1 + Math.log10( 9 ) : magnitude + Math.log10( mantissa - 1 );
          }
          else {
            snappedExponent = oldExponent;
          }
        }
        else {
          snappedExponent = roundSymmetric( newExponent );
        }

        return EXPONENT_RANGE.getNormalizedValue( clamp( snappedExponent, EXPONENT_RANGE.min, EXPONENT_RANGE.max ) );
      },

      mainColor: NuclearDecayCommonColors.halfLifeColorProperty,
      visibleProperty: model.selectedIsotopeProperty.derived( isotope => isotope === 'custom' ),
      cursor: 'ew-resize',

      // Keyboard accessibility: makes the sphere focusable and reachable via Tab.
      focusable: true,
      accessibleName: NuclearDecayCommonFluent.halfLifeStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.halfLifeSlider.accessibleHelpTextStringProperty,
      ariaOrientation: Orientation.HORIZONTAL,
      createAriaValueText: ( _formattedValue: number, value: number ) => {
        const timescale = model.timescaleProperty.value;
        const time = model.expandNormalizedTime( value, timescale );
        const shownTime = formatTimescaleStrings( time, timescale );
        return StringUtils.fillIn( NuclearDecayCommonFluent.timeSecondsStringProperty.value, { time: shownTime } );
      },
      startDrag: () => { previousValue = model.customHalfLifeProperty.value; },
      drag: () => {
        const newValue = model.customHalfLifeProperty.value;
        valueChangeSoundPlayer.playSoundIfThresholdReached( newValue, previousValue );
        previousValue = newValue;
      }
    }, providedOptions );

    const diameter = 15;

    super( diameter, options );

    // Keep the keyboard steps in sync with the current timescale, since it can change (e.g. when the isotope
    // selection switches between 'custom' and a real isotope, or between single- and multi-atom screens).
    model.timescaleProperty.lazyLink( timescale => {
      const keyboardSteps = getKeyboardSteps( timescale );
      this.keyboardStep = keyboardSteps.keyboardStep!;
      this.shiftKeyboardStep = keyboardSteps.shiftKeyboardStep!;
      this.pageKeyboardStep = keyboardSteps.pageKeyboardStep!;
    } );
  }

  public setContextResponseAlert( contextResponseAlert: ContextResponseAlert | null ): void {
    this.createContextResponseAlert = contextResponseAlert;

  }
}