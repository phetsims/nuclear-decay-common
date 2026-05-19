// Copyright 2026, University of Colorado Boulder
/**
 * SortButton is a button that when clicked will sort the decaying atoms into rows and columns
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
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
    buttonBounds: Bounds2,
    providedOptions: SortButtonOptions
  ) {
    const sortedIcon = SortButton.createSortedIcon( buttonBounds );
    const options = optionize<SortButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      content: sortedIcon,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      size: new Dimension2( buttonBounds.width, buttonBounds.height )
    }, providedOptions );
    super( options );
  }

  private static createSortedIcon( bounds: Bounds2 ): Node {
    const sortedIconWidth = bounds.width;
    const sortedIconHeight = sortedIconWidth / 2;
    const sortedIconLineWidth = 2;
    const columns = 4;

    // outer frame
    const shape = new Shape().rect( 0, 0, sortedIconWidth, sortedIconHeight );
    shape.moveTo( 0, sortedIconHeight / 2 );

    // horizontal line
    shape.lineTo( sortedIconWidth, sortedIconHeight / 2 );

    // vertical lines
    const verticalLineSpacing = sortedIconWidth / columns;
    _.times( columns - 1, i => {
      shape.moveTo( verticalLineSpacing + i * verticalLineSpacing, 0 );
      shape.lineTo( verticalLineSpacing + i * verticalLineSpacing, sortedIconHeight );
    } );

    return new Path( shape, {
      stroke: 'black',
      lineWidth: sortedIconLineWidth
    } );
  }
}
