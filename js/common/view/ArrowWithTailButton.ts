// Copyright 2014-2025, University of Colorado Boulder

/**
 * Button that has a bold arrow with a tail (<-) different from ArrowButton which only has the triangle.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import type TPaint from '../../../../scenery/js/util/TPaint.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';

type SelfOptions = {
  soundPlayer?: TSoundPlayer;
  arrowRotation?: number;

  arrowFill?: TPaint;
  arrowStroke?: TPaint;
};

export type ArrowWithTailButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class ArrowWithTailButton extends RectangularPushButton {

  public constructor( providedOptions?: ArrowWithTailButtonOptions ) {

    const options = optionize<ArrowWithTailButtonOptions, StrictOmit<SelfOptions, 'soundPlayer'>, RectangularPushButtonOptions>()( {

      // Default margin values were set up to make this button match the size of the refresh button, since these
      // buttons often appear together.  See https://github.com/phetsims/scenery-phet/issues/44.
      xMargin: 8,
      yMargin: 10.9,

      baseColor: PhetColorScheme.BUTTON_YELLOW,

      arrowFill: 'black',
      arrowStroke: null,

      arrowRotation: 0

    }, providedOptions );

    const arrowShape = new ArrowShape( 0, 0, -28.5, 0, {
      tailWidth: 8,
      headWidth: 18,
      headHeight: 15
    } );
    options.content = new Path( arrowShape, {
      fill: options.arrowFill,
      stroke: options.arrowStroke,
      rotation: options.arrowRotation
    } );

    super( options );
  }
}
