import * as maplibre from 'maplibre-gl';
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import 'maplibre-gl/dist/maplibre-gl.css';
import destination from '@turf/destination';
import '~/assets/scss/components/list-card-map.scss';
import { Diplomat } from '../Diplomat';

interface ListCardMapDefinition {
  bbox: number[][];
  sensorNodesIds: number[];
}

function bounds(bbox: number[][]) {
  const sw = destination(bbox[0], 1, -135, { units: 'kilometers' });
  const ne = destination(bbox[2], 1, 45, { units: 'kilometers' });
  return [
    ...sw.geometry.coordinates,
    ...ne.geometry.coordinates,
  ] as [number, number, number, number];
}

const SOURCE_ID = 'locations';

export function ListCardMap(props: ListCardMapDefinition) {
  let containerRef: HTMLDivElement | undefined;
  let map: maplibre.Map | undefined;

  const [mapInstance, setMapInstance] = createSignal<maplibre.Map>();

  const hasValidBbox = () =>
    Array.isArray(props.bbox) &&
    props.bbox.length >= 3 &&
    props.bbox.every(
      (pair) =>
        Array.isArray(pair) &&
        typeof pair[0] === 'number' &&
        typeof pair[1] === 'number' &&
        !Number.isNaN(pair[0]) &&
        !Number.isNaN(pair[1])
    );

  onMount(() => {
    maplibre.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      true
    );

    if (!hasValidBbox() || !containerRef) return;

    const mapBounds = bounds(props.bbox);

    map = new maplibre.Map({
      container: containerRef,
      style: import.meta.env.VITE_MAP_STYLE,
      bounds: mapBounds,
      touchZoomRotate: false,
      dragRotate: false,
      interactive: false,
    });

    map.on('load', () => {
      if (props.sensorNodesIds.length > 0) {
        map!.addSource(SOURCE_ID, {
          type: 'vector',
          tiles: [
            `${import.meta.env.VITE_TILES_URL}/{z}/{x}/{y}.pbf?apiKey=${
              import.meta.env.VITE_TILES_API_KEY
            }`,
          ],
          minzoom: 1,
          maxzoom: 24,
          bounds: mapBounds,
        });

        map!.addLayer({
          id: 'locations',
          type: 'circle',
          source: SOURCE_ID,
          'source-layer': 'locations',
          paint: {
            'circle-color': [
              'case',
              ['in', ['get', 'locations_id'], ['literal', props.sensorNodesIds]],
              '#FEE172',
              'transparent',
            ],
            'circle-stroke-color': [
              'case',
              ['in', ['get', 'locations_id'], ['literal', props.sensorNodesIds]],
              '#33A3A1',
              'transparent',
            ],
            'circle-stroke-width': [
              'interpolate', ['linear'], ['zoom'], 2, 1, 14, 4,
            ],
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'], 1, 3, 12, 8,
            ],
          },
        });
      }

      setMapInstance(map);
    });
  });

  // Reactive: sensorNodesIds changes after initial mount
  createEffect(() => {
    const m = mapInstance();
    const ids = props.sensorNodesIds;
    if (!m) return;

    if (!m.getSource(SOURCE_ID)) {
      if (ids.length > 0 && hasValidBbox()) {
        m.addSource(SOURCE_ID, {
          type: 'vector',
          tiles: [
            `${import.meta.env.VITE_TILES_URL}/{z}/{x}/{y}.pbf?apiKey=${
              import.meta.env.VITE_TILES_API_KEY
            }`,
          ],
          minzoom: 1,
          maxzoom: 24,
          bounds: bounds(props.bbox),
        });

        m.addLayer({
          id: 'locations',
          type: 'circle',
          source: SOURCE_ID,
          'source-layer': 'locations',
          paint: {
            'circle-color': [
              'case',
              ['in', ['get', 'locations_id'], ['literal', ids]],
              '#FEE172',
              'transparent',
            ],
            'circle-stroke-color': [
              'case',
              ['in', ['get', 'locations_id'], ['literal', ids]],
              '#33A3A1',
              'transparent',
            ],
            'circle-stroke-width': [
              'interpolate', ['linear'], ['zoom'], 2, 1, 14, 4,
            ],
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'], 1, 3, 12, 8,
            ],
          },
        });
      }
      return;
    }

    // Source/layer already exist — just update the expressions with new ids
    if (m.getLayer('locations')) {
      m.setPaintProperty('locations', 'circle-color', [
        'case',
        ['in', ['get', 'locations_id'], ['literal', ids]],
        '#FEE172',
        'transparent',
      ]);
      m.setPaintProperty('locations', 'circle-stroke-color', [
        'case',
        ['in', ['get', 'locations_id'], ['literal', ids]],
        '#33A3A1',
        'transparent',
      ]);
    }
  });

  // Reactive: bbox changes after initial mount
  createEffect(() => {
    const m = mapInstance();
    if (!m || !hasValidBbox()) return;
    m.fitBounds(bounds(props.bbox));
  });

  onCleanup(() => {
    map?.remove();
  });

  return (
    <div class="list-card-map-container">
      <div ref={containerRef} class="map" />
      <Show when={mapInstance()}>
        <Diplomat map={mapInstance()!} />
      </Show>
    </div>
  );
}