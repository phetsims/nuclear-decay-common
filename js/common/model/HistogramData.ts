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

// Histogram settings for linear time
const BINS_PER_SECOND = 20;
const BIN_SIZE_TIME = 1 / BINS_PER_SECOND; // seconds

// Atoms that decay after this time are not shown in the histogram.
const MAX_DISPLAY_TIME = 3.25; // seconds

// Histogram settings for exponential time
const BINS_PER_EXPONENT = 20 / 6; // 20 bins per 6 exponent range (10^-3s to 10^3s)
const EXPONENT_BIN_SIZE = 1 / BINS_PER_EXPONENT; // exponent range per bin
const MAX_EXPONENT = 19;

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
  public update(): void {
    this.decayedBinsMap.clear();
    this.tallestBinCount = 0;

    this.model.decayedAtoms.forEach( atom => {

      affirm( atom.decayTime !== null, 'Decayed atoms should have a decay time' );

      if ( this.model.timescaleProperty.value === 'linear' ) {
        const bin = roundToInterval( atom.decayTime, BIN_SIZE_TIME );

        // Atoms with very high decay times are not shown.
        if ( bin > MAX_DISPLAY_TIME ) { return; }

        const newCount = ( this.decayedBinsMap.get( bin ) ?? 0 ) + 1;
        this.decayedBinsMap.set( bin, newCount );
        if ( newCount > this.tallestBinCount ) {
          this.tallestBinCount = newCount;
        }
      }
      if ( this.model.timescaleProperty.value === 'exponential' ) {
        const bin = roundToInterval( Math.log10( atom.decayTime ), EXPONENT_BIN_SIZE );

        // Atoms with very high decay times are not shown.
        if ( bin > MAX_EXPONENT ) { return; }

        const newCount = ( this.decayedBinsMap.get( bin ) ?? 0 ) + 1;
        this.decayedBinsMap.set( bin, newCount );
        if ( newCount > this.tallestBinCount ) {
          this.tallestBinCount = newCount;
        }
      }

    } );
  }

  public reset(): void {
    this.decayedBinsMap.clear();
    this.tallestBinCount = 0;
    this.numberOfUndecayedAtoms = 0;
    this.undecayedTime = 0;
  }

  public step(): void {
    this.numberOfUndecayedAtoms = this.model.undecayedAtoms.length;
    if ( this.numberOfUndecayedAtoms > 0 ) {
      this.undecayedTime = this.model.timeProperty.value;
    }
    else {
      this.undecayedTime = 0;
    }
  }

  /**
   * Whether the undecayed atoms indicator should be visible (atoms exist and within display range).
   */
  public showUndecayed(): boolean {
    const maxDisplayTime = this.model.timescaleProperty.value === 'linear' ? MAX_DISPLAY_TIME : Math.pow( 10, MAX_EXPONENT );
    return this.numberOfUndecayedAtoms > 0 && this.undecayedTime <= maxDisplayTime;
  }
}
