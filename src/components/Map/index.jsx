import MapGL, { Source, Layer, Control } from 'solid-map-gl';
import Geocoder from '../Geocoder';
import { createSignal } from 'solid-js';
import { useStore } from '../../stores';

function calculateFlyToDuration(zoom) {
  return 2500 / (zoom / 5);
}
export const hexValues = [
  '#CEC7FF',
  '#A497FD',
  '#8F81EE',
  '#7867EB',
  '#6A5CD8',
  '#584DAE',
  '#241050',
];

export const aqiHexValues = [
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
  'maroon',
];

export const parametersBins = {
  1: [0, 55, 155, 255, 355, 425, 605], //pm10
  2: [0, 12.1, 35.5, 55.5, 150.5, 250.5, 501], //pm25
  3: [0, 12.1, 35.5, 55.5, 150.5, 250, 501], // o3 mass
  4: [0, 5122.5, 10943.5, 14086.8, 17928.7, 35391.7, 58675.7], // co mass
  5: [0, 54, 101, 361, 650, 1250, 2050], //no2 mass
  6: [0, 66.9, 35.5, 55.5, 150.5], //so2 mass
  7: [0, 0.054, 0.101, 0.361, 0.65, 1.25, 2.05], // no2 ppm
  8: [0, 4.5, 9.5, 12.5, 15.5, 30.5, 50.5], // co ppm
  9: [0, 0.035, 0.075, 0.185, 0.305, 0.605, 1.004], // so2 ppm
  10: [0, 12.1, 35.5, 55.5, 150.5],
  11: [0, 12.1, 35.5, 55.5, 150.5],
};

export function Map() {
  const [store, { setViewport, loadLocation, setLocationId }] =
    useStore();
  const [cursorStyle, setCursorStyle] = createSignal('');

  function getFeature(e) {
    const features = e.target.queryRenderedFeatures(e.point);
    const locationId = features[0].properties.locationId;
    loadLocation(locationId);
    return features[0].geometry.coordinates;
  }

  function colorScale(parameter) {
    const bins = hexValues.map((c, i) => [
      parametersBins[parameter][i],
      c,
    ]);
    return bins;
  }

  return (
    <MapGL
      class="map"
      options={{
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
        style: import.meta.env.VITE_MAPBOX_STYLE,
        touchZoomRotate: false,
        dragRotate: false,
        minZoom: 1,
        maxZoom: 20,
      }}
      cursorStyle={cursorStyle()}
      onMouseOver={{ locations: () => setCursorStyle('pointer') }}
      onMouseLeave={{ locations: () => setCursorStyle('') }}
      viewport={store.viewport}
      onViewportChange={(e) => {
        return setViewport(e);
      }}
    >
      <Control type="scale" position="bottom-left" />
      <Control
        type="navigation"
        position="bottom-left"
        options={{ showCompass: false, showZoom: true }}
      />
      <Geocoder />
      <Source
        source={{
          id: 'locations',
          type: 'vector',
          tiles: [
            `${
              import.meta.env.VITE_API_BASE_URL
            }/v2/locations/tiles/{z}/{x}/{y}.pbf?parameter=${
              store.parameter?.id
            }`,
          ],
          minzoom: 1,
          maxzoom: 24,
          bounds: [-180, -90, 180, 90],
        }}
      >
        <Layer
          id="locations-shadow"
          style={{
            type: 'circle',
            source: 'locations',
            'source-layer': 'default',
            paint: {
              'circle-color': 'black',
              'circle-blur': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                0.95,
                14,
                0.45,
              ],
              'circle-translate': [0, 3],
              'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                0,
                14,
                0.5,
              ],
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  2,
                  'reference grade',
                  4,
                  0,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  15,
                  'reference grade',
                  32,
                  0,
                ],
              ],
            },
          }}
        />
        <Layer
          id="locations"
          onClick={(e) => {
            const coordinates = getFeature(e);
            e.target.flyTo({
              center: coordinates,
              zoom: e.target.getZoom() > 12 ? e.target.getZoom() : 12,
              duration: calculateFlyToDuration(e.target.getZoom()),
              essential: true,
            });
          }}
          style={{
            type: 'circle',
            source: 'locations',
            'source-layer': 'default',
            paint: {
              'circle-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'lastValue']],
                -1,
                '#ddd',
                ...colorScale(store.parameter.id).flat(),
              ],
              'circle-stroke-color': [
                'match',
                ['get', 'sensorType'],
                'low-cost sensor',
                'grey',
                'reference grade',
                'white',
                'grey',
              ],
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                2,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  0.25,
                  'reference grade',
                  1,
                  0.25,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  0,
                  'reference grade',
                  6,
                  0,
                ],
              ],
              'circle-opacity': 1,
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  2,
                  'reference grade',
                  3,
                  2,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  13, //13,
                  'reference grade',
                  22, //19,
                  13,
                ],
              ],
            },
          }}
        />
        <Layer
          id="selected-location-shadow"
          style={{
            type: 'circle',
            source: 'locations',
            'source-layer': 'default',
            filter: [
              '==',
              ['get', 'locationId'],
              ['literal', store.id || 0],
            ],
            paint: {
              'circle-color': '#000000',
              'circle-blur': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                0.25,
                14,
                0.35,
              ],
              'circle-opacity': 0.5,
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  4,
                  'reference grade',
                  5,
                  0,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  17,
                  'reference grade',
                  25,
                  17,
                ],
              ],
            },
          }}
        />
        <Layer
          id="selected-location"
          style={{
            type: 'circle',
            source: 'locations',
            'source-layer': 'default',
            filter: [
              '==',
              ['get', 'locationId'],
              ['literal', store.id || 0],
            ],
            paint: {
              'circle-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'lastValue']],
                -1,
                '#ddd',
                ...colorScale(store.parameter.id).flat(),
              ],
              'circle-opacity': 1,
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  2,
                  'reference grade',
                  3,
                  2,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  13, //13,
                  'reference grade',
                  22, //19,
                  13,
                ],
              ],
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                2,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  1,
                  'reference grade',
                  2,
                  1,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  4,
                  'reference grade',
                  6,
                  4,
                ],
              ],
              'circle-stroke-color': '#85DBD9',
            },
          }}
        />
        <Layer
          id="location-text"
          style={{
            type: 'symbol',
            source: 'locations',
            minzoom: 17,
            maxzoom: 24,
            'source-layer': 'default',
            layout: {
              'text-field': ['get', 'lastValue'],
              'text-font': [
                'Space Grotesk Regular',
                'Arial Unicode MS Regular',
              ],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10,
                8,
                24,
                14,
              ],
              'text-transform': 'uppercase',
              'text-allow-overlap': true,
              'text-letter-spacing': 0,
              'text-offset': [0, 0],
            },
            paint: {
              'text-color': 'white',
              /*
                'interpolate',
                ['linear'],
                ['number', ['get', 'lastValue']],
                -1,
                '#000',
                0,
                '#000',
                5.55555555555556,
                '#000',
                11.11111111111111,
                '#000',
                33.66666666666666,
                '#000',
                44.22222222222223,
                '#000',
                55.77777777777777,
                '#fff',
                77.3333333333333,
                '#fff',
                88.8888888888889,
                '#fff',
                100.44444444444446,
                '#fff',
                */
            },
          }}
        />
      </Source>
    </MapGL>
  );
}
