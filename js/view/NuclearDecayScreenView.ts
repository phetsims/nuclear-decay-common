// Copyright 2026, University of Colorado Boulder
/**
 * Common screen view for Nuclear Decay simulations.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ScreenView, { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import TimeControlNode from '../../../scenery-phet/js/TimeControlNode.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import nuclearDecayCommon from '../nuclearDecayCommon.js';
import NuclearDecayCommonConstants from '../NuclearDecayCommonConstants.js';

type SelfOptions = EmptySelfOptions;

export type NuclearDecayScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class NuclearDecayScreenView extends ScreenView {
  public constructor( model: NuclearDecayModel, providedOptions: NuclearDecayScreenViewOptions ) {
    const options = optionize<SelfOptions, EmptySelfOptions, NuclearDecayScreenViewOptions>()( {
      // Default options go here
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - NuclearDecayCommonConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NuclearDecayCommonConstants.SCREEN_VIEW_Y_MARGIN,
      // tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    const timeControls = new TimeControlNode( new BooleanProperty( false ), {
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => {}
        }
      },
      bottom: resetAllButton.top - 20,
      right: resetAllButton.right
    } );
    this.addChild( timeControls );

  }

  public reset(): void {
    // TO BE IMPLEMENTED
  }
}

nuclearDecayCommon.register( 'NuclearDecayScreenView', NuclearDecayScreenView );