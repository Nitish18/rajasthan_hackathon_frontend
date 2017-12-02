import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import Slider from 'rc-slider';
import { addHeatMap } from './helpers';
import 'rc-slider/assets/index.css';

const style = {
  width: '100vw',
  height: '100vh'
};

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const styles = {
  slider: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    minHeight: 64,
    background: 'rgba(255,255,255,0.5)',
  }
};

const marks = {
  0: '1999',
  10: '2000',
  20: '2001',
  30: '2002',
  40: '2003',
  50: '2004',
  60: '2005',
  70: '2006',
  80: '2007',
  90: '2008',
  100: ''
};

const log = value => {
  console.log(value);
}

const InputSlider = () => {
  return (
    <div style={styles.slider}>
      <Slider min={-10} marks={marks} step={null} onChange={log} defaultValue={20} />
    </div>
  );
}

class App extends Component {
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.map,
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: 2,
    });
    addHeatMap(map);
  }
  render() {
    return (
      <div>
        <div style={style} ref={map => { this.map = map; }} />
        <InputSlider />
      </div>
    );
  }
}

export default App;
