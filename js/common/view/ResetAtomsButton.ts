// Copyright 2025-2026, University of Colorado Boulder
/**
 * Rectangular button that will reset the atoms in the screen.
 * The listener should be provided because logic might vary between screens.
 *
 * @author Agustín Vallejo (PhET Simulactive Interactions)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import undoSolidShape from '../../../../sherpa/js/fontawesome-5/undoSolidShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';

type SelfOptions = EmptySelfOptions;

export type ResetAtomsButtonOptions = SelfOptions & WithRequired<RectangularPushButtonOptions, 'tandem' | 'listener' >;

export default class ResetAtomsButton extends RectangularPushButton {
  public constructor( isPlayAreaEmptyProperty: TReadOnlyProperty<boolean>, providedOptions: ResetAtomsButtonOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, RectangularPushButtonOptions>()( {
      content: new Path( undoSolidShape, { scale: 0.038, fill: 'black' } ),
      baseColor: NuclearDecayCommonColors.resetButtonProperty,
      enabledProperty: isPlayAreaEmptyProperty.derived( empty => !empty )
    }, providedOptions );

    super( options );
  }
}