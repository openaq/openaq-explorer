import MapGL, { Layer, Source, Viewport } from 'solid-map-gl';
import * as maplibre from 'maplibre-gl';
import { createSignal, Show } from 'solid-js';
import 'maplibre-gl/dist/maplibre-gl.css';
import destination from '@turf/destination';
import '~/assets/scss/components/list-card-map.scss';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DetailMapDefinition {
  bbox: number[][];
  sensorNodesIds: number[];
}

function bounds(bbox: number[][]) {
  const sw = destination(bbox[0], 1, -135, { units: 'kilometers' });
  const ne = destination(bbox[2], 1, 45, { units: 'kilometers' });
  return [...sw.geometry.coordinates, ...ne.geometry.coordinates];
}

export function ListCardMap(props: DetailMapDefinition) {
  const [viewport] = createSignal({
    bounds: bounds(props.bbox),
  } as Viewport);

  return (
    <div class="list-card-map-container">
      <MapGL
        class="map"
        mapLib={maplibre}
        options={{
          accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
          style: import.meta.env.VITE_MAP_STYLE,
          touchZoomRotate: false,
          dragRotate: false,
          interactive: false,
        }}
        viewport={viewport()}
      >
        <Show when={props.sensorNodesIds.length > 0}>
          <Source
            source={{
              id: 'locations',
              type: 'vector',
              tiles: [
                `${import.meta.env.VITE_TILES_URL}/{z}/{x}/{y}.pbf?apiKey=${
                  import.meta.env.VITE_TILES_API_KEY
                }`,
              ],
              minzoom: 1,
              maxzoom: 24,
              bounds: bounds(props.bbox),
            }}
          >
            <Layer
              id="locations"
              style={{
                type: 'circle',
                'source-layer': 'locations',
                paint: {
                  'circle-color': [
                    'case',
                    [
                      'in',
                      ['get', 'locations_id'],
                      ['literal', props.sensorNodesIds],
                    ],
                    '#FEE172',
                    'transparent',
                  ],
                  'circle-stroke-color': [
                    'case',
                    [
                      'in',
                      ['get', 'locations_id'],
                      ['literal', props.sensorNodesIds],
                    ],
                    '#33A3A1',
                    'transparent',
                  ],
                  'circle-stroke-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    2,
                    1,
                    14,
                    4,
                  ],
                  'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    1,
                    3,
                    12,
                    8,
                  ],
                },
              }}
            />
          </Source>
        </Show>
      </MapGL>
    </div>
  );
}
