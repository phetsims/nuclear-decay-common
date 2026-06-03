// Copyright 2026, University of Colorado Boulder

/**
 * Updatable defines a minimal update contract for view nodes that are stepped by a parent screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

type Updatable = {
  update(): void;
};

export default Updatable;