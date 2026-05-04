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
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ArrowShape, { ArrowShapeOptions } from '../../../../scenery-phet/js/ArrowShape.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import AccessibleSlider, { type AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';

type SelfOptions = {
  arrowShapeOptions?: ArrowShapeOptions;
};

type ParentOptions = PathOptions & AccessibleSliderOptions;

export type EnergyGrabberNodeOptions = SelfOptions & StrictOmit<ParentOptions,
  'valueProperty' | 'enabledRangeProperty' | 'startDrag' | 'endDrag'>;

export default class EnergyGrabberNode extends AccessibleSlider( Path, 1 ) {
  public constructor(
    energyProperty: NumberProperty,
    model: NuclearDecayModel,
    providedOptions?: EnergyGrabberNodeOptions
  ) {

    const sliderAriaValueText = ( value: number, range: Range ) => {
      const normalized = ( value - range.min ) / ( range.max - range.min );
      if ( normalized < 0.33 ) { return NuclearDecayCommonFluent.a11y.qualitative.valueLowStringProperty.value; }
      if ( normalized < 0.67 ) { return NuclearDecayCommonFluent.a11y.qualitative.valueMediumStringProperty.value; }
      return NuclearDecayCommonFluent.a11y.qualitative.valueHighStringProperty.value;
    };

    const options = optionize<EnergyGrabberNodeOptions, SelfOptions, ParentOptions>()( {

      valueProperty: energyProperty,
      enabledRangeProperty: energyProperty.rangeProperty,

      arrowShapeOptions: {
        headWidth: 20,
        tailWidth: 10,
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

      // Keyboard accessibility: makes the sphere focusable and reachable via Tab.
      focusable: true,
      ariaOrientation: Orientation.VERTICAL,
      createAriaValueText: ( _formattedValue, value ) => {
        const range = energyProperty.range;
        return sliderAriaValueText( value, range );
      },
      createContextResponseAlert: ( newValue, oldValue ) => {
        const increased = oldValue !== null && newValue > oldValue;
        const distanceProgress = increased
                                 ? NuclearDecayCommonFluent.a11y.qualitative.progressLargerStringProperty.value
                                 : NuclearDecayCommonFluent.a11y.qualitative.progressSmallerStringProperty.value;
        const hLifeProgress = increased
                              ? NuclearDecayCommonFluent.a11y.qualitative.progressShorterStringProperty.value
                              : NuclearDecayCommonFluent.a11y.qualitative.progressLongerStringProperty.value;
        return NuclearDecayCommonFluent.a11y.energyDiagramSliders.accessibleContextResponse.format( {
          distanceProgress: distanceProgress, hLifeProgress: hLifeProgress
        } );
      }
    }, providedOptions );

    const arrowShape = new ArrowShape( 0, 20, 0, -20, options.arrowShapeOptions );

    super( arrowShape, options );
  }
}