// Copyright 2026, University of Colorado Boulder
/**
 * SortButton is a button that when clicked will sort the decaying atoms into rows and columns
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';

type SelfOptions = EmptySelfOptions;
type SortButtonOptions = SelfOptions & WithRequired<RectangularPushButtonOptions, 'tandem'>;

export default class SortButton extends RectangularPushButton {

  public constructor(
    providedOptions: SortButtonOptions
  ) {
    const tenFrameIcon = SortButton.createTenFrameIcon();
    const options = optionize<SortButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
        content: tenFrameIcon,
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      }, providedOptions );
    super( options );
  }

  private static createTenFrameIcon(): Node {
    const tenFrameWidth = 48;
    const tenFrameHeight = 22;
    const tenFrameLineWidth = 2;

    // outer frame
    const shape = new Shape().rect( 0, 0, tenFrameWidth, tenFrameHeight );
    shape.moveTo( 0, tenFrameHeight / 2 );

    // horizontal line
    shape.lineTo( tenFrameWidth, tenFrameHeight / 2 );

    // vertical lines
    const verticalLineSpacing = tenFrameWidth / 5;
    _.times( 4, i => {
      shape.moveTo( verticalLineSpacing + i * verticalLineSpacing, 0 );
      shape.lineTo( verticalLineSpacing + i * verticalLineSpacing, tenFrameHeight );
    } );

    const shapeWidth = shape.bounds.width;

    return new Path( shape, {
      stroke: 'black',
      lineWidth: tenFrameLineWidth,
      localBounds: Bounds2.rect( 0, -shape.bounds.height / 2, shapeWidth, shapeWidth )
    } );
  }
}
