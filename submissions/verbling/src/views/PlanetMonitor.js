import React from 'react';
import PlanetStore from '../stores/PlanetStore';

//Retrieves the planet from the store to use as state
var getPlanet = function () {
  return {
    planet: PlanetStore.getPlanet().name
  };
};

export default class PlanetMonitor extends React.Component {
  constructor() {
    super();
    this.state = getPlanet();
  }

  componentDidMount() {
    PlanetStore.addChangeListener(() => this.setState(getPlanet()));
  }

  render() {
    return (
      <h1 className="css-planet-monitor">
        Obiwan currently on {this.state.planet}
      </h1>
    );
  }
};
