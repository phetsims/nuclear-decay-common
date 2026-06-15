// Copyright 2026, University of Colorado Boulder

/**
 * CanvasNode that draws the decay-time histogram blocks for DecayTimeHistogramPanel.
 * Replaces the Scenery-node-per-block approach with a single canvas pass for better performance.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import HistogramData from '../model/HistogramData.js';
import { Timescale } from '../model/NuclearDecayModel.js';

// Dimensions of the undecayed indicator in multi-atom mode.
const UNDECAYED_WIDTH = 25;
const UNDECAYED_HEIGHT = 16;

export default class DecayTimeHistogramCanvasNode extends CanvasNode {

  private readonly undecayedCountLabel: Text | null = null;

  private readonly graphHeight: number;

  public constructor(
    private readonly histogramData: HistogramData,
    private readonly getXForTime: ( time: number, timescale: Timescale ) => number,
    private readonly timescaleProperty: TReadOnlyProperty<Timescale>,
    private readonly isSingleAtomMode: boolean,
    canvasBounds: Bounds2
  ) {
    super( { canvasBounds: canvasBounds } );

    this.graphHeight = canvasBounds.height;

    if ( !isSingleAtomMode ) {

      // Only have the count label in multi-atom mode.
      this.undecayedCountLabel = new Text( '', {
        font: NuclearDecayCommonConstants.SMALL_LABEL_FONT,
        fill: 'black'
      } );
      this.addChild( this.undecayedCountLabel );
    }

    // To prevent spurious resizing of the panel
    this.localBounds = this.localBounds.copy();

  }

  /**
   * Refreshes the Scenery label and triggers a canvas repaint. Called each step.
   */
  public update(): void {
    if ( this.undecayedCountLabel ) {
      if ( this.histogramData.showUndecayed() ) {
        this.undecayedCountLabel.visible = true;
        const x = this.getXForTime( this.histogramData.undecayedTime, this.timescaleProperty.value );
        this.undecayedCountLabel.string = this.histogramData.numberOfUndecayedAtoms;
        this.undecayedCountLabel.centerX = x + UNDECAYED_WIDTH / 2;
        this.undecayedCountLabel.centerY = UNDECAYED_HEIGHT / 2;
      }
      else {
        this.undecayedCountLabel.visible = false;
      }
    }

    this.invalidatePaint();
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    const data = this.histogramData;
    const timescale = this.timescaleProperty.value;

    const BOX_WIDTH = 6;
    const tallestBinCount = data.tallestBinCount;
    const useBoxMode = tallestBinCount * 9 < this.graphHeight;
    const BOX_HEIGHT = 9;

    context.fillStyle = 'black';
    context.strokeStyle = 'grey';
    context.lineWidth = 1;

    data.decayedBinsMap.forEach( ( value, bin ) => {
      const x = timescale === 'linear' ?
                this.getXForTime( bin, timescale ) :
                this.getXForTime( Math.pow( 10, bin ), timescale );

      if ( useBoxMode ) {

        // Draw individual stacked squares, one per atom.
        for ( let n = 0; n < value; n++ ) {
          const y = this.graphHeight - ( n + 1 ) * BOX_HEIGHT;
          context.fillRect( x, y, BOX_WIDTH, BOX_HEIGHT );
          context.strokeRect( x, y, BOX_WIDTH, BOX_HEIGHT );
        }
      }
      else {

        // Too many atoms to draw individual boxes, draw a single proportional bar instead.
        // The tallest bin fills the full graph height; all others scale accordingly.
        const barHeight = tallestBinCount > 0 ? ( value / tallestBinCount ) * this.graphHeight : 0;
        const y = this.graphHeight - barHeight;
        context.fillRect( x, y, BOX_WIDTH, barHeight );
        context.strokeRect( x, y, BOX_WIDTH, barHeight );
      }
    } );

    if ( data.showUndecayed() ) {
      const undecayedWidth = this.isSingleAtomMode ? 6 : UNDECAYED_WIDTH;
      const undecayedHeight = this.isSingleAtomMode ? 9 : UNDECAYED_HEIGHT;
      const x = this.getXForTime( data.undecayedTime, timescale );

      context.fillStyle = NuclearDecayCommonColors.undecayedProperty.value.toCSS();
      context.strokeStyle = 'black';
      context.fillRect( x, 0, undecayedWidth, undecayedHeight );
      context.strokeRect( x, 0, undecayedWidth, undecayedHeight );
    }
  }
}
