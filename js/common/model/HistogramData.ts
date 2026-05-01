// Copyright 2026, University of Colorado Boulder
/**
 * Manages histogram binning and data segmentation for the nuclear decay simulation suite.
 * Tracks decayed atom counts per time bin and undecayed atom info for display by DecayTimeHistogramPanel.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import NuclearDecayModel from './NuclearDecayModel.js';

const BINS_PER_SECOND = 20;
const BIN_SIZE_TIME = 1 / BINS_PER_SECOND; // seconds

// Atoms that decay after this time are not shown in the histogram.
const MAX_DISPLAY_TIME = 3.25; // seconds

export default class HistogramData {

  // Map from bin center time to count of decayed atoms in that bin.
  public readonly decayedBinsMap = new Map<number, number>();

  // The count of the tallest bin, used for dynamic box height sizing.
  public tallestBinCount = 0;

  // Number of undecayed atoms and their current time (for the undecayed indicator).
  public numberOfUndecayedAtoms = 0;
  public undecayedTime = 0;


  public constructor( private readonly model: NuclearDecayModel ) {
  }

  /**
   * Recomputes the histogram bins from the current model state. Called during model step.
   */
  public step(): void {
    this.decayedBinsMap.clear();
    this.tallestBinCount = 0;

    this.model.decayedAtoms.forEach( atom => {

      affirm( atom.decayTime !== null, 'Decayed atoms should have a decay time' );

      const bin = roundToInterval( atom.decayTime, BIN_SIZE_TIME );

      // Atoms with very high decay times are not shown.
      if ( bin > MAX_DISPLAY_TIME ) { return; }

      const newCount = ( this.decayedBinsMap.get( bin ) ?? 0 ) + 1;
      this.decayedBinsMap.set( bin, newCount );
      if ( newCount > this.tallestBinCount ) {
        this.tallestBinCount = newCount;
      }
    } );

    this.numberOfUndecayedAtoms = this.model.undecayedAtoms.length;
    if ( this.numberOfUndecayedAtoms > 0 ) {
      this.undecayedTime = this.model.undecayedAtoms[ 0 ].time;
    }

  }

  /**
   * Whether the undecayed atoms indicator should be visible (atoms exist and within display range).
   */
  public showUndecayed(): boolean {
    return this.numberOfUndecayedAtoms > 0 && this.undecayedTime <= MAX_DISPLAY_TIME;
  }
}
