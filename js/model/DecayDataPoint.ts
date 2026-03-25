// Copyright 2026, University of Colorado Boulder
/**
 * Simple type for a data point in the decay graph.
 * Will be represented in the view as a little rectangle.
 *
 * @author Agustín Vallejo
 */

type DecayDataPoint = {
  // The x value of the data point, which is the time in seconds of the decay event.
  x: number;
};

export default DecayDataPoint;