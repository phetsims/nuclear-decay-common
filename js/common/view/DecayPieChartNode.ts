// Copyright 2026, University of Colorado Boulder
/**
 * Node that shows the ammount of decayed and undecayed atoms in a pie chart.
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import NuclearDecayCommonColors from '../../NuclearDecayCommonColors.js';
import NuclearDecayCommonConstants from '../../NuclearDecayCommonConstants.js';
import NuclearDecayAtom from '../model/NuclearDecayAtom.js';
import NuclearDecayModel from '../model/NuclearDecayModel.js';

type SelfOptions = {
  radius?: number;
};

export type DecayPieChartNodeOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export class DecayPieChartNode extends VBox {
  public constructor(
    model: NuclearDecayModel,
    providedOptions: DecayPieChartNodeOptions ) {
    const options = optionize<DecayPieChartNodeOptions, SelfOptions, VBoxOptions>()( {
      spacing: 10,
      radius: 30
    }, providedOptions );

    const undecayedCountStringProperty = new StringProperty( '' );
    const decayedCountStringProperty = new StringProperty( '' );

    Multilink.multilink(
      [
        model.selectedIsotopeProperty,
        model.undecayedCountProperty,
        model.decayedCountProperty
      ], ( undecayedIsotope, undecayedCount, decayedCount ) => {
        const decayedIsotope = NuclearDecayAtom.getDecayProduct( undecayedIsotope );
        const undecayedSymbol = NuclearDecayAtom.getIsotopeMassAndSymbolString( undecayedIsotope );
        const decayedSymbol = NuclearDecayAtom.getIsotopeMassAndSymbolString( decayedIsotope );
        undecayedCountStringProperty.value = `${undecayedSymbol}: ${undecayedCount}`;
        decayedCountStringProperty.value = `${decayedSymbol}: ${decayedCount}`;
      }
    );

    // Isotope count labels at the top
    const undecayedCountLabel = new RichText( undecayedCountStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT,
      fill: NuclearDecayCommonColors.undecayedProperty
    } );
    const decayedCountLabel = new RichText( decayedCountStringProperty, {
      font: NuclearDecayCommonConstants.CONTROL_FONT
    } );

    const undecayedBackgroundCircle = new Circle( options.radius, {
      stroke: 'black'
    } );
    model.undecayedCountProperty.link( count => {
      undecayedBackgroundCircle.fill = count !== 0 ? NuclearDecayCommonColors.undecayedProperty : null;
    } );

    const decayedArc = new Path( null, {
      stroke: 'black',
      fill: NuclearDecayCommonColors.decayedProperty,
      visibleProperty: model.isPlayAreaEmptyProperty.derived( empty => !empty )
    } );

    model.percentageOfDecayedProperty.link( decayedPercent => {
      if ( decayedPercent === 0 ) {
        decayedArc.shape = null;
      }
      else {
        decayedArc.shape = new Shape().moveTo( 0, 0 ).arc(
          0, 0, options.radius, 0, 2 * Math.PI * decayedPercent ).lineTo( 0, 0 ).close();
      }
    } );

    const pieChartNode = new Node( {
      children: [ undecayedBackgroundCircle, decayedArc ]
    } );

    options.children = [ undecayedCountLabel, pieChartNode, decayedCountLabel ];

    super( options );
  }
}