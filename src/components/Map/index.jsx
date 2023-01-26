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

export const percentHexValues = [
  '#DEDAFB',
  '#BCB2FE',
  '#8F81EE',
  '#6A5CD8',
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

export const percentBins = [0, 20, 40, 60, 80];

export const parametersBins = {
  1: [0, 55, 155, 255, 355, 425, 605], // PM10 (µg/m³)
  2: [0, 12.1, 35.5, 55.5, 150.5, 250.5, 501], // PM2.5 (µg/m³)
  3: [0, 137.2, 323.4, 0.165, 401.5, 793.8, 1183.84], // O₃ mass (µg/m³)
  4: [0, 5122.5, 10943.5, 14086.8, 17928.7, 35391.7, 58675.7], // CO mass (µg/m³)
  5: [0, 101.5, 190, 679, 1222, 2350, 3852], // NO₂ mass (µg/m³)
  6: [0, 94.5, 199, 487.5, 799, 1585, 2630.5], // SO₂ mass (µg/m³)
  7: [0, 0.054, 0.101, 0.361, 0.65, 1.25, 2.05], // NO₂ (ppm)
  8: [0, 25, 35, 50, 87, 200, 400], // CO (ppm)
  9: [0, 0.094, 0.199, 0.487, 0.799, 1.585, 2.631], // SO₂ (ppm)
  10: [0, 0.055, 0.125, 0.165, 0.205, 0.405, 0.604], // O₃ (ppm)
  11: [0, 12.1, 35.5, 55.5, 150.5, 250.5, 501], // BC (µg/m³) - made a judgement call here
  19: [0, 12.1, 35.5, 55.5, 150.5, 250.5, 501], // PM1 (µg/m³)
  21: [0, 400, 1000, 2000, 3000, 4000, 5000], // CO₂ (ppm) - made a judgement call here
  27: [0, 615, 1230, 2460, 3690, 4920, 6150], // NOx mass (µg/m³)
  28: [0, 0.094, 0.199, 0.487, 0.799, 1.585, 2.631], // CH₄ (ppm) - made a judgement call here 1000 ppm is limit for OSHA
  33: [0, 12.1, 35.5, 55.5, 150.5, 250.5, 501], // UFP count (particles/cm³)
  35: [0, 0.094, 0.199, 0.487, 0.799, 1.585, 2.631], // NO (ppm) - made a judgement call here
  126: [0, 12.1, 35.5, 55.5, 150.5, 250.5, 501], // PM1 count (particles/cm³
  130: [0, 0.094, 0.199, 0.487, 0.799, 1.585, 2.631], // PM2.5 count (particles/cm³) - made a judgement call here
  135: [0, 0.094, 0.199, 0.487, 0.799, 1.585, 2.631], // PM10 count (particles/cm³)
  19840: [0, 0.5, 1, 2, 3, 4, 5], // NOx (ppm)
  19843: [0, 4.5, 9.5, 12.5, 15.5, 30.5, 50.5], // NO mass (µg/m³) - made a judgement call here
  19844: [0, 12.1, 35.5, 55.5, 150.5, 250.5, 501], // PM4 (µg/m³) *
};

function getField(store) {
  return store.mapThreshold.active
    ? [
        'number',
        [
          'get',
          `period_${store.mapThreshold.period}_threshold_${store.mapThreshold.threshold}`,
        ],
      ]
    : ['number', ['get', 'value']];
}

function colorScale(parameter) {
  const bins = hexValues.map((c, i) => [
    parametersBins[parameter][i],
    c,
  ]);
  return bins;
}

function percentColorScale() {
  const bins = percentHexValues.map((c, i) => [percentBins[i], c]);
  return bins;
}

function locationsCircleOpacityExpression(store) {
  return store.mapThreshold.active
    ? [
        'case',
        [
          'has',
          `period_${store.mapThreshold.period}_threshold_${store.mapThreshold.threshold}`,
        ],
        1,
        0,
      ]
    : 1;
}

function getColorScale(store) {
  return store.mapThreshold.active
    ? percentColorScale().flat()
    : colorScale(store.parameter.id).flat();
}

function createTileUrl(store) {
  let parameters = '';
  if (store.parameter.id) {
    parameters = `parameters_id=${store.parameter?.id}`;
  }
  let isMonitor = '';
  if (store.mapFilters.monitor && store.mapFilters.airSensor) {
    isMonitor = '';
  }
  if (!store.mapFilters.monitor && store.mapFilters.airSensor) {
    isMonitor = '&monitor=false';
  }
  if (store.mapFilters.monitor && !store.mapFilters.airSensor) {
    isMonitor = '&monitor=true';
  }
  let excludeInactive = '';
  if (store.mapFilters.excludeInactive) {
    excludeInactive = '&active=true';
  }
  let providers_ids = '';
  if (store.mapFilters.providers.length > 0) {
    const providers = store.mapFilters.providers
      .map((o) => o.id)
      .join(',');
    providers_ids = `&providers_id=${providers}`;
  }

  return `${
    import.meta.env.VITE_API_BASE_URL
  }/v3/locations/tiles/{z}/{x}/{y}.pbf?${parameters}${isMonitor}${excludeInactive}${providers_ids}`;
}

function createThresholdTileUrl(store) {
  let parameters = '';
  if (store.mapThreshold.parameter_id) {
    parameters = `parameters_id=${store.mapThreshold.parameter_id}`;
  }
  let isMonitor = '';
  if (store.mapFilters.monitor && store.mapFilters.airSensor) {
    isMonitor = '';
  }
  if (!store.mapFilters.monitor && store.mapFilters.airSensor) {
    isMonitor = '&monitor=false';
  }
  if (store.mapFilters.monitor && !store.mapFilters.airSensor) {
    isMonitor = '&monitor=true';
  }
  let excludeInactive = '';
  if (store.mapFilters.excludeInactive) {
    excludeInactive = '&active=true';
  }
  let providers_ids = '';
  if (store.mapFilters.excludedProviders.length > 0) {
    const providers = store.providers().map((o) => o.id);
    const ids = providers
      .filter((o) => !store.mapFilters.excludedProviders.includes(0))
      .join(',');
    providers_ids = `&providers_id=${ids}`;
  }

  return `${
    import.meta.env.VITE_API_BASE_URL
  }/v3/thresholds/tiles/{z}/{x}/{y}.pbf?${parameters}${isMonitor}${excludeInactive}${providers_ids}`;
}

export function Map() {
  const [
    store,
    {
      setViewport,
      loadLocation,
      setLocationId,
      loadRecentMeasurements,
    },
  ] = useStore();
  const [cursorStyle, setCursorStyle] = createSignal('');

  function getFeature(e) {
    const features = e.target.queryRenderedFeatures(e.point);
    const locationId = features[0].properties.sensor_nodes_id;
    loadLocation(locationId);
    loadRecentMeasurements(locationId);

    return features[0].geometry.coordinates;
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
            store.mapThreshold.active
              ? createThresholdTileUrl(store)
              : createTileUrl(store),
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
                ['case', ['==', ['get', 'ismonitor'], true], 4, 2],
                14,
                ['case', ['==', ['get', 'ismonitor'], true], 32, 15],
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
                'case',
                ['==', ['get', 'active'], true],
                [
                  'interpolate',
                  ['linear'],
                  getField(store),
                  -1,
                  '#ddd',
                  ...getColorScale(store),
                ],
                '#e8ebed',
              ],
              'circle-stroke-color': [
                'case',
                ['==', ['get', 'ismonitor'], true],
                'white',
                'grey',
              ],
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                2,
                ['case', ['==', ['get', 'ismonitor'], true], 1, 0.25],
                14,
                ['case', ['==', ['get', 'ismonitor'], true], 6, 0],
              ],
              'circle-stroke-opacity':
                locationsCircleOpacityExpression(store),
              'circle-opacity':
                locationsCircleOpacityExpression(store),
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                ['case', ['==', ['get', 'ismonitor'], true], 3, 2],
                14,
                ['case', ['==', ['get', 'ismonitor'], true], 22, 13],
              ],
            },
          }}
        />
        <Layer
          id="inactive-locations"
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
              'circle-color': '#7e8c9a',
              'circle-opacity': [
                'case',
                ['==', ['get', 'active'], true],
                0,
                1,
              ],
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                2,
                14,
                8,
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
                ['case', ['==', ['get', 'ismonitor'], true], 5, 4],
                14,
                ['case', ['==', ['get', 'ismonitor'], true], 25, 17],
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
              ['get', 'sensor_nodes_id'],
              ['literal', store.id || 0],
            ],
            paint: {
              'circle-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'value']],
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
                ['case', ['==', ['get', 'ismonitor'], true], 3, 2],
                14,
                ['case', ['==', ['get', 'ismonitor'], true], 22, 13],
              ],
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                2,
                ['case', ['==', ['get', 'ismonitor'], true], 2, 1],
                14,
                ['case', ['==', ['get', 'ismonitor'], true], 6, 4],
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
            minzoom: 11,
            maxzoom: 24,
            'source-layer': 'default',
            layout: {
              'text-field': ['get', 'period_1_threshold_5'],
              'text-font': [
                'Space Grotesk Regular',
                'Arial Unicode MS Regular',
              ],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10,
                12,
                24,
                18,
              ],
              'text-transform': 'uppercase',
              'text-allow-overlap': true,
              'text-letter-spacing': 0,
              'text-offset': [0, 0],
            },
            paint: {
              'text-color': [
                'case',
                ['==', ['get', 'active'], true],
                'white',
                'black',
              ],
            },
          }}
        />
      </Source>
    </MapGL>
  );
}
