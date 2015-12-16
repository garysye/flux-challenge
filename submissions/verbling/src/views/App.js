import React from 'react';
import PlanetStore from '../stores/PlanetStore';
import PlanetMonitor from './PlanetMonitor';
import SithList from './SithList';

export default class App extends React.Component {
  render() {
    return (
      <div className="css-root">
        <PlanetMonitor />
        <SithList />
      </div>
    );
  }
}

