// Copyright 2026, University of Colorado Boulder
/**
 * HalfLifeGrabberNode is a draggable node that allows the user to adjust the half-life of the custom isotope
 * in the Nuclear Decay simulation suite.
 * It is implemented as an AccessibleSlider, which provides keyboard accessibility and screen reader support.
 *
 * @author Agustín Vallejo
 */

import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import AccessibleSlider, { type AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';

type SelfOptions = EmptySelfOptions;

type ParentOptions = ShadedSphereNodeOptions & AccessibleSliderOptions;

export type HalfLifeGrabberNodeOptions = SelfOptions & StrictOmit<ParentOptions,
  'valueProperty' | 'enabledRangeProperty' | 'startDrag' | 'endDrag'>;

export default class HalfLifeGrabberNode extends AccessibleSlider( ShadedSphereNode, 1 ) {
  public constructor( model: NuclearDecayModel, providedOptions?: HalfLifeGrabberNodeOptions ) {
    const options = optionize<HalfLifeGrabberNodeOptions, SelfOptions, ParentOptions>()( {

      valueProperty: model.customHalfLifeProperty,
      enabledRangeProperty: model.customHalfLifeProperty.rangeProperty,

      mainColor: NuclearDecayCommonColors.halfLifeColorProperty,
      visibleProperty: model.selectedIsotopeProperty.derived( isotope => isotope === 'custom' ),
      cursor: 'pointer',

      // Keyboard accessibility: makes the sphere focusable and reachable via Tab.
      focusable: true,
      accessibleName: NuclearDecayCommonFluent.halfLifeStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.halfLifeSlider.accessibleHelpTextStringProperty,
      ariaOrientation: Orientation.HORIZONTAL,
      createAriaValueText: ( _formattedValue: number, value: number ) => {
        const isLogarithmic = model.timescaleProperty.value === 'exponential';
        const realTime = model.expandNormalizedTime( value, isLogarithmic );
        const shownTime = isLogarithmic ?
                          `10<sup>${toFixed( Math.log10( realTime ), 1 )}</sup>` :
                          toFixed( value, 2 );
        return StringUtils.fillIn( NuclearDecayCommonFluent.timeSecondsStringProperty.value, { time: shownTime } );
      },
      createContextResponseAlert: ( newValue: number, oldValue: number ) => {
        const increased = oldValue !== null && newValue > oldValue;
        const initialEProgress = increased
                                 ? NuclearDecayCommonFluent.a11y.qualitative.progressLowerStringProperty.value
                                 : NuclearDecayCommonFluent.a11y.qualitative.progressHigherStringProperty.value;
        const distanceProgress = increased
                                 ? NuclearDecayCommonFluent.a11y.qualitative.progressSmallerStringProperty.value
                                 : NuclearDecayCommonFluent.a11y.qualitative.progressLargerStringProperty.value;
        return NuclearDecayCommonFluent.a11y.halfLifeSlider.accessibleContextResponse.format( {
          initialEProgress: initialEProgress, distanceProgress: distanceProgress
        } );
      }
    }, providedOptions );

    const diameter = 15;

    super( diameter, options );
  }
}