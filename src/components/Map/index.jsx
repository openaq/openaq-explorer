/* eslint-disable solid/style-prop */
import MapGL, { Source, Layer, Control } from 'solid-map-gl';
import { useMapContext } from 'solid-map-gl';
import * as maplibre from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// import Geocoder from '../Geocoder';
import { useStore } from '~/stores';
import { createEffect, createSignal } from 'solid-js';

function calculateFlyToDuration(zoom) {
  return 2500 / (zoom / 5);
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

// function createTileUrl(store) {
//   let parameters = '';
//   if (store.parameter.id) {
//     parameters = `parameters_id=${store.parameter?.id}`;
//   }
//   let isMonitor = '';
//   if (store.mapFilters.monitor && store.mapFilters.airSensor) {
//     isMonitor = '';
//   }
//   if (!store.mapFilters.monitor && store.mapFilters.airSensor) {
//     isMonitor = '&monitor=false';
//   }
//   if (store.mapFilters.monitor && !store.mapFilters.airSensor) {
//     isMonitor = '&monitor=true';
//   }
//   let excludeInactive = '';
//   if (store.mapFilters.excludeInactive) {
//     excludeInactive = '&active=true';
//   }
//   let providers_ids = '';
//   if (store.mapFilters.providers.length > 0) {
//     const providers = store.mapFilters.providers
//       .map((o) => o.id)
//       .join(',');
//     providers_ids = `&providers_id=${providers}`;
//   }

//   return `${
//     import.meta.env.VITE_API_BASE_URL
//   }/v3/locations/tiles/{z}/{x}/{y}.pbf?${parameters}${isMonitor}${excludeInactive}${providers_ids}`;
// }

function Bounds() {
  const [ctx] = useMapContext();

  const [viewport, setViewport] = createSignal();
  const [mapBbox, setMapBbox] = createSignal();

  createEffect(() => {
    if (viewport() && mapBbox()) {
      const bounds = [...mapBbox()];
      ctx.map.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        { padding: { top: 90, bottom: 150, left: 20, right: 360 } }
      );
    }
  });
  return <></>;
}

export function Map() {
  const [cursorStyle, setCursorStyle] = createSignal();

  const [store, { loadLocation }] = useStore();

  const [viewport, setViewport] = createSignal();

  createEffect(() => {
    localStorage.setItem('viewport', viewport());
  });

  function getFeature(e) {
    const features = e.target.queryRenderedFeatures(e.point);
    const locationId = features[0].properties.sensor_nodes_id;
    //setLocationId(locationId);
    loadLocation(locationId);
    // loadRecentMeasurements(locationId);

    return features[0].geometry.coordinates;
  }

  return (
    <MapGL
      class="map"
      mapLib={maplibre}
      options={{
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
        style: import.meta.env.VITE_MAP_STYLE,
        touchZoomRotate: false,
        dragRotate: false,
        minZoom: 1,
        maxZoom: 20,
        hash: true,
      }}
      cursorStyle={cursorStyle()}
      onMouseOver={{ locations: () => setCursorStyle('pointer') }}
      onMouseLeave={{ locations: () => setCursorStyle('') }}
      viewport={viewport()}
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
      {/* <Geocoder /> */}
      <Source
        source={{
          id: 'locations',
          type: 'vector',
          tiles: [
            `https://api.openaq.org/v3/locations/tiles/{z}/{x}/{y}.pbf?parameters_id=2`,
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
            'source-layer': 'default',
            paint: {
              'circle-color': '#6a5cd8',
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
              'circle-stroke-opacity': 1,
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
            },
          }}
        />
        <Layer
          id="inactive-locations"
          //   onClick={(e) => {
          //     const coordinates = getFeature(e);
          //     e.target.flyTo({
          //       center: coordinates,
          //       zoom: e.target.getZoom() > 12 ? e.target.getZoom() : 12,
          //       duration: calculateFlyToDuration(e.target.getZoom()),
          //       essential: true,
          //     });
          //   }}
          style={{
            type: 'circle',
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
            'source-layer': 'default',
            filter: ['==', ['get', 'locationId'], ['literal', 0]],
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
            'source-layer': 'default',
            filter: [
              '==',
              ['get', 'sensor_nodes_id'],
              ['literal', 0],
            ],
            paint: {
              'circle-color': 'blue',
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
            minzoom: 11,
            maxzoom: 24,
            'source-layer': 'default',
            layout: {
              'text-field': ['get', 'exceedance'],
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
      <Bounds />
    </MapGL>
  );
}
