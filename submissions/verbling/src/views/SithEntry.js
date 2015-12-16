import React from 'react';

export default class SithEntry extends React.Component {

  render() {
    var sith = this.props.sith;
    var className = "css-slot";
    //If data on Sith is available, creates a entry
    if (sith) {
      if (sith.alert) {
        className += " css-sith-alert";
      }
      return (
        <li className={className}>
          <h3>{sith.name}</h3>
          <h6>Homeworld: {sith.homeworld.name}</h6>
        </li>
      );
    }
    //Else returns an empty item
    return (
      <li className={className} />
    );
  }
};
