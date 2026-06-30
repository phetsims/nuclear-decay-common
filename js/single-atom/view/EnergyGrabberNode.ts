// Copyright 2026, University of Colorado Boulder
/**
 * EnergyGrabberNode is a draggable arrow that allows the user to adjust the energy levels for the atom
 * in the Nuclear Decay simulation suite.
 * It is implemented as an AccessibleSlider, which provides keyboard accessibility and screen reader support.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { equalsEpsilon } from '../../../../dot/js/util/equalsEpsilon.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ArrowShape, { ArrowShapeOptions } from '../../../../scenery-phet/js/ArrowShape.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import AccessibleSlider, { type AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import NuclearDecayModel from '../../common/model/NuclearDecayModel.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';

type SelfOptions = {
  arrowShapeOptions?: ArrowShapeOptions;
};

type ParentOptions = PathOptions & AccessibleSliderOptions;

export type EnergyGrabberNodeOptions = SelfOptions & StrictOmit<ParentOptions,
  'valueProperty' | 'enabledRangeProperty' | 'startDrag' | 'drag' | 'endDrag'>;

export default class EnergyGrabberNode extends AccessibleSlider( Path, 1 ) {
  public constructor(
    energyProperty: NumberProperty,
    model: NuclearDecayModel,
    providedOptions?: EnergyGrabberNodeOptions
  ) {

    const shiftStepSize = 0.05;

    const valueChangeSoundPlayer = new ValueChangeSoundPlayer( energyProperty.rangeProperty, {
      numberOfMiddleThresholds: energyProperty.rangeProperty.value.getLength() / shiftStepSize
    } );
    let previousValue = energyProperty.value;
    let previousHalfLife = model.halfLifeProperty.value;

    const sliderAriaValueText = ( value: number, range: Range ) => {
      const normalized = ( value - range.min ) / ( range.max - range.min );
      if ( normalized < 0.33 ) { return NuclearDecayCommonFluent.a11y.qualitative.valueLowStringProperty.value; }
      if ( normalized < 0.67 ) { return NuclearDecayCommonFluent.a11y.qualitative.valueMediumStringProperty.value; }
      return NuclearDecayCommonFluent.a11y.qualitative.valueHighStringProperty.value;
    };

    const options = optionize<EnergyGrabberNodeOptions, SelfOptions, ParentOptions>()( {

      valueProperty: energyProperty,
      enabledRangeProperty: energyProperty.rangeProperty,

      shiftKeyboardStep: shiftStepSize,
      keyboardStep: 2 * shiftStepSize,
      pageKeyboardStep: 4 * shiftStepSize,

      arrowShapeOptions: {
        headWidth: 15,
        tailWidth: 5,
        doubleHead: true
      },

      visibleProperty: new DerivedProperty(
        [ model.isPlayAreaEmptyProperty, model.selectedIsotopeProperty ],
        ( isEmpty, selectedIsotope ) => {
          return !isEmpty && selectedIsotope === 'custom';
        }
      ),
      cursor: 'pointer',
      stroke: 'black',

      fill: 'yellow',

      // Keyboard accessibility: makes the sphere focusable and reachable via Tab.
      focusable: true,
      ariaOrientation: Orientation.VERTICAL,
      createAriaValueText: ( _formattedValue, value ) => {
        const range = energyProperty.range;
        return sliderAriaValueText( value, range );
      },
      startDrag: () => { previousValue = energyProperty.value; },
      drag: () => {
        const newValue = energyProperty.value;
        const newHalfLife = model.halfLifeProperty.value;

        valueChangeSoundPlayer.playSoundIfThresholdReached( newValue, previousValue );

        let contextResponse = '';
        if ( equalsEpsilon( newHalfLife, previousHalfLife, 1e-3 ) ) {
          const unchanged = NuclearDecayCommonFluent.a11y.qualitative.progressUnchangedStringProperty.value;
          contextResponse = NuclearDecayCommonFluent.a11y.escapeDistanceContextResponse.format( {
            distanceProgress: unchanged,
            hLifeProgress: unchanged
          } );
        }
        else {
          const increased = newHalfLife > previousHalfLife;
          const distanceProgress = increased
                                   ? NuclearDecayCommonFluent.a11y.qualitative.progressLargerStringProperty.value
                                   : NuclearDecayCommonFluent.a11y.qualitative.progressSmallerStringProperty.value;
          const hLifeProgress = increased
                                ? NuclearDecayCommonFluent.a11y.qualitative.progressLongerStringProperty.value
                                : NuclearDecayCommonFluent.a11y.qualitative.progressShorterStringProperty.value;
          contextResponse = NuclearDecayCommonFluent.a11y.escapeDistanceContextResponse.format( {
            distanceProgress: distanceProgress, hLifeProgress: hLifeProgress
          } );
        }

        this.addAccessibleContextResponse( contextResponse, { responseGroup: 'energyGrabber' } );
        previousValue = newValue;
        previousHalfLife = newHalfLife;
      }
    }, providedOptions );

    const arrowShape = new ArrowShape( 0, 15, 0, -15, options.arrowShapeOptions );

    super( arrowShape, options );
  }
}