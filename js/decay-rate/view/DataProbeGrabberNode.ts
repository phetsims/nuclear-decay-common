// Copyright 2026, University of Colorado Boulder
/**
 * DataProbeGrabberNode is a draggable node that allows the user to adjust the data probe on the Decay Rate screen
 * to learn about the current value of the graph.
 * It is implemented as an AccessibleSlider, which provides keyboard accessibility and screen reader support.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import AccessibleSlider, { type AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import NuclearDecayCommonFluent from '../../NuclearDecayCommonFluent.js';

// The maximum time displayed on the x-axis (seconds), mirrored from DecayRateGraphPanel.
const MAX_TIME = 3.5;

type SelfOptions = EmptySelfOptions;

type ParentOptions = ShadedSphereNodeOptions & AccessibleSliderOptions;

export type DataProbeGrabberNodeOptions = SelfOptions & StrictOmit<ParentOptions,
  'valueProperty' | 'enabledRangeProperty' | 'startDrag' | 'endDrag'>;

export default class DataProbeGrabberNode extends AccessibleSlider( ShadedSphereNode, 1 ) {
  public constructor(
    dataProbeXProperty: NumberProperty,
    graphWidth: number,
    providedOptions?: DataProbeGrabberNodeOptions
  ) {
    const options = optionize<DataProbeGrabberNodeOptions, SelfOptions, ParentOptions>()( {

      valueProperty: dataProbeXProperty,
      enabledRangeProperty: dataProbeXProperty.rangeProperty,

      mainColor: 'grey',
      cursor: 'ew-resize',

      // Keyboard accessibility: makes the sphere focusable and reachable via Tab.
      focusable: true,
      accessibleName: NuclearDecayCommonFluent.dataProbeStringProperty,
      accessibleHelpText: NuclearDecayCommonFluent.a11y.dataProbeSlider.accessibleHelpTextStringProperty,
      ariaOrientation: Orientation.HORIZONTAL,
      createAriaValueText: ( _formattedValue: number, value: number ) => {
        const time = ( value / graphWidth ) * MAX_TIME;
        return toFixed( time, 2 );
      }
    }, providedOptions );

    const diameter = 15;

    super( diameter, options );
  }
}
