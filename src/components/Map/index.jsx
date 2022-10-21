import MapGL, { Source, Layer, Control } from 'solid-map-gl';
import Geocoder from '../Geocoder';
import { createSignal } from 'solid-js';
import { useStore } from '../../stores';
import * as d3 from 'd3';

function calculateFlyToDuration(zoom) {
  return 2500 / (zoom / 5);
}
const hexValues = [
  '#DEDAFB',
  '#CEC7FF',
  '#BCB2FE',
  '#A597FD',
  '#8576ED',
  '#7867EB',
  '#6A5CD8',
  '#584DAE',
  '#241050',
];

export default function Map() {
  const [store, { setViewport, set, loadLocation, setLocationId }] =
    useStore();
  console.log(JSON.stringify(store.viewport));
  console.log(JSON.stringify(store.overlay.parameter));
  const [cursorStyle, setCursorStyle] = createSignal('');

  function getFeature(e) {
    const features = e.target.queryRenderedFeatures(e.point);
    const locationId = features[0].properties.locationId;
    loadLocation(locationId);
  }

  function calculateColorScale(max, hexValues) {
    const color = d3
      .scaleQuantize()
      .domain([0, max])
      .range(hexValues);
    const bins = hexValues.map((c) => [color.invertExtent(c)[0], c]);
    return bins;
  }

  function getActiveParameter() {}

  console.log(store.overlay);

  return (
    <MapGL
      class="map"
      style={{ top: '80px' }}
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
                  3,
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
            getFeature(e);
            e.target.flyTo({
              center: [e.lngLat.lng, e.lngLat.lat],
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
                ...calculateColorScale(100, hexValues).flat() /*
                0,
                '#ddd9fa',
                5.55555555555556,
                '#cdc6ff',
                11.11111111111111,
                '#bbb1fe',
                33.66666666666666,
                '#a497fc',
                44.22222222222223,
                '#8476ed',
                55.77777777777777,
                '#7767ea',
                77.3333333333333,
                '#6a5cd8',
                88.8888888888889,
                '#574cad',
                100.44444444444446,
                '#231050',
                */,
              ],
              'circle-stroke-color': [
                'match',
                ['get', 'sensorType'],
                'low-cost sensor',
                'grey',
                'reference grade',
                'white',
                'black',
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
                  1,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  0,
                  'reference grade',
                  6,
                  2,
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
                  0,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  13, //13,
                  'reference grade',
                  22, //19,
                  0,
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
                  0,
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
                ...calculateColorScale(500, hexValues).flat(),
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
                  0,
                ],
                14,
                [
                  'match',
                  ['get', 'sensorType'],
                  'low-cost sensor',
                  13, //13,
                  'reference grade',
                  22, //19,
                  0,
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
                  2,
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
            minzoom: 10,
            maxzoom: 24,
            'source-layer': 'default',
            layout: {
              'text-field': ['get', 'lastValue'],
              'text-font': ['Space Grotesk', 'Arial Unicode MS Bold'],
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
              'text-color': [
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
              ],
            },
          }}
        />
      </Source>
    </MapGL>
  );
}
