// Copyright 2026, University of Colorado Boulder
/**
 * HalfLifeGrabberNode is a draggable node that allows the user to adjust the half-life of the custom isotope
 * in the Nuclear Decay simulation suite.
 * It is implemented as an AccessibleSlider, which provides keyboard accessibility and screen reader support.
 *
 * @author Agustín Vallejo
 */

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
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import formatTimescaleStrings from './formatTimescaleStrings.js';

type SelfOptions = EmptySelfOptions;

type ParentOptions = ShadedSphereNodeOptions & AccessibleSliderOptions;

export type HalfLifeGrabberNodeOptions = SelfOptions & StrictOmit<ParentOptions,
  'valueProperty' | 'enabledRangeProperty' | 'startDrag' | 'drag' | 'endDrag'>;

export default class HalfLifeGrabberNode extends AccessibleSlider( ShadedSphereNode, 1 ) {
  public constructor( model: NuclearDecayModel, providedOptions?: HalfLifeGrabberNodeOptions ) {
    const numberOfExponents = NuclearDecayCommonConstants.EXPONENTIAL_HALF_LIFE_EXPONENT_RANGE.getLength();

    const valueChangeSoundPlayer = new ValueChangeSoundPlayer( model.customHalfLifeProperty.rangeProperty, {
      numberOfMiddleThresholds: numberOfExponents
    } );
    let previousValue = model.customHalfLifeProperty.value;

    const options = optionize<HalfLifeGrabberNodeOptions, SelfOptions, ParentOptions>()( {

      valueProperty: model.customHalfLifeProperty,
      enabledRangeProperty: model.customHalfLifeProperty.rangeProperty,

      keyboardStep: 3 / numberOfExponents, // Goes every 10^3 exponents like the ticks in the graph
      shiftKeyboardStep: 1 / numberOfExponents, // Goes every 10^1
      pageKeyboardStep: 6 / numberOfExponents, // Every 10^6

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

        const increased = newValue > previousValue;
        const initialEProgress = increased
                                 ? NuclearDecayCommonFluent.a11y.qualitative.progressLowerStringProperty.value
                                 : NuclearDecayCommonFluent.a11y.qualitative.progressHigherStringProperty.value;
        const distanceProgress = increased
                                 ? NuclearDecayCommonFluent.a11y.qualitative.progressLargerStringProperty.value
                                 : NuclearDecayCommonFluent.a11y.qualitative.progressSmallerStringProperty.value;
        this.addAccessibleContextResponse( NuclearDecayCommonFluent.a11y.halfLifeSlider.accessibleContextResponse.format( {
          initialEProgress: initialEProgress, distanceProgress: distanceProgress
        } ), { responseGroup: 'halfLifeGrabberNode' } );

        previousValue = newValue;
      }
    }, providedOptions );

    const diameter = 15;

    super( diameter, options );
  }
}