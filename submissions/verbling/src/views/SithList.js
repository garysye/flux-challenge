import React from 'react';
import SithEntry from './SithEntry';
import SithStore from '../stores/SithStore';
import SithActions from '../actions/SithActions';
import _ from 'lodash';

// Retrieves updates from store to use as state
function getSithUpdates() {
  return {
    sith: SithStore.getSith(),
    isApprenticeAvail: SithStore.isApprenticeAvail(),
    isMasterAvail: SithStore.isMasterAvail(),
    sithAlert: SithStore.getSithAlert()
  };
}

export default class SithList extends React.Component {
  constructor() {
    super();
    this.state = getSithUpdates();
  }

  componentDidMount() {
    SithStore.addChangeListener(() => this.setState(getSithUpdates()));
    SithActions.initialize(5);
  }

  _handleButtonUp() {
    if (this.state.isMasterAvail) {
      SithActions.scrollUp(2);
    }
  }

  _handleButtonDown() {
    if (this.state.isApprenticeAvail) {
      SithActions.scrollDown(2);
    }
  }

  render() {
    var sithList = this.state.sith;
    var sithEntries = [];
    var buttonUpClass = "css-button-up";
    var buttonDownClass = "css-button-down";
    //Checks if buttons should be disabled
    if (!this.state.isMasterAvail || this.state.sithAlert) {
      buttonUpClass += ' css-button-disabled';
    }
    if (!this.state.isApprenticeAvail || this.state.sithAlert) {
      buttonDownClass += ' css-button-disabled';
    }
    //Populates list of Sith with entries
    _.forEach(sithList, (sith, ind) => {
      sithEntries.push(<SithEntry sith={sith} key={ind} />);
    });  
    return (
      <section className="css-scrollable-list">
        <ul className="css-slots">{sithEntries}</ul>
        <div className="css-scroll-buttons">
          <button className={buttonUpClass} onClick={this._handleButtonUp.bind(this)}></button>
          <button className={buttonDownClass} onClick={this._handleButtonDown.bind(this)}></button>
        </div>
      </section>
    );
  }
};
