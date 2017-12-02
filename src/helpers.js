import { API_URL, years } from './config';

const defaultData = {
  type: 'FeatureCollection',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
    }
  },
  features: []
};

export const getGeoJsonData = (rawData=[]) => {
  const geoJsonData = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
      }
    },
    features: []
  };
  geoJsonData.features = rawData.map(function(d) {
    const { time, latlng } = d;
    const [lat, long] = latlng;
    const feature = {
      type: 'Feature',
      properties: {
        id: 'ak16994521',
        mag: 2.3,
        time,
        felt: null,
        tsunami: 0
      },
      geometry: {
        type: "Point",
        coordinates: [ long, lat ]
      }
    };
    const year = new Date(time).getFullYear();
    feature.properties.year = year;
    feature.properties.diseaseType = d.diseaseType || "null";
    return feature;
  });
  return geoJsonData;
};

export const addHeatMap = (map, isPredicted) => {
  map.on('load', function() {
    const url = `${API_URL}/getData?year=${years[0]}`;
    fetch(url)
      .then(response => response.json())
      .then(({ data }) => {
        const geoJsonData = getGeoJsonData(data);
        //Add a geojson point source.
        //Heatmap layers also work with a vector tile source.
        if (!isPredicted) {
          map.addSource('patients', {
              type: 'geojson',
              data: geoJsonData,
          });
        } else {
          map.addSource('patients', {
              type: 'geojson',
              data: defaultData,
          });
        }

        // map.addLayer({
        //     "id": "patients-heat",
        //     "type": "heatmap",
        //     "source": "patients",
        //     "maxzoom": 9,
        //     "paint": {
        //         //Increase the heatmap weight based on frequency and property magnitude
        //         "heatmap-weight": {
        //             "property": "mag",
        //             "type": "exponential",
        //             "stops": [
        //                 [0, 0],
        //                 [6, 1]
        //             ]
        //         },
        //         //Increase the heatmap color weight weight by zoom level
        //         //heatmap-ntensity is a multiplier on top of heatmap-weight
        //         "heatmap-intensity": {
        //             "stops": [
        //                 [0, 1],
        //                 [9, 3]
        //             ]
        //         },
        //         //Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        //         //Begin color ramp at 0-stop with a 0-transparancy color
        //         //to create a blur-like effect.
        //         "heatmap-color": {
        //             "stops": [
        //                 [0, "rgba(33,102,172,0)"],
        //                 [0.2, "rgb(103,169,207)"],
        //                 [0.4, "rgb(209,229,240)"],
        //                 [0.6, "rgb(253,219,199)"],
        //                 [0.8, "rgb(239,138,98)"],
        //                 [1, "rgb(178,24,43)"]
        //             ]
        //         },
        //         //Adjust the heatmap radius by zoom level
        //         "heatmap-radius": {
        //             "stops": [
        //                 [0, 2],
        //                 [9, 20]
        //             ]
        //         },
        //         //Transition from heatmap to circle layer by zoom level
        //         "heatmap-opacity": {
        //             "default": 1,
        //             "stops": [
        //                 [7, 1],
        //                 [9, 0]
        //             ]
        //         },
        //     }
        // }, 'waterway-label');

        map.addLayer({
            "id": "patients-point",
            "type": "circle",
            "source": "patients",
            // "minzoom": 7,
            "paint": {
                //Size circle raidus by earthquake magnitude and zoom level
                "circle-radius": {
                    "property": "mag",
                    "type": "exponential",
                    "stops": [
                        // [{ zoom: 7, value: 1 }, 1],
                        // [{ zoom: 7, value: 6 }, 4],
                        [{ zoom: 1, value: 1 }, 1],
                        [{ zoom: 1, value: 6 }, 4],
                        [{ zoom: 16, value: 1 }, 5],
                        [{ zoom: 16, value: 6 }, 50],
                    ]
                },
                //Color circle by earthquake magnitude
                "circle-color": {
                    "property": "diseaseType",
                    "type": "categorical",
                    "stops": [
                        ["WaterBorneDisease", "rgb(239,138,98)"],
                        ["RespiratoryDisease", "rgb(178,24,43)"],
                        ["kidneyDamage", "rgb(239,138,98)"],
                        ["diarrhoea", "rgb(178,24,43)"],
                        ["null", "rgba(255, 255, 255, 0)"]
                    ]
                },
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
            }
        }, 'waterway-label');
      })
      .catch((errorObject) => {
        console.log(errorObject);
      })
  });
};

// /trainSystem?year=2017
