import * as maplibre from 'maplibre-gl';
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import 'maplibre-gl/dist/maplibre-gl.css';

import destination from '@turf/destination';
import { useStore } from '~/stores';

import '~/assets/scss/components/list-map.scss';
import { Diplomat } from '../Diplomat';

interface ListDefinition {
  listsId: number;
  ownersId: number;
  usersId: number;
  role: string;
  label: string;
  description: string;
  visibility: boolean;
  userCount: number;
  locationsCount: number;
  sensorNodesIds: number[];
  bbox: number[][];
}

interface ListMapDefinition {
  list: ListDefinition;
}

function bounds(bbox: number[][]) {
  const sw = destination(bbox[0], 1, -135, { units: 'kilometers' });
  const ne = destination(bbox[2], 1, 45, { units: 'kilometers' });
  return [
    ...sw.geometry.coordinates,
    ...ne.geometry.coordinates,
  ] as [number, number, number, number];
}

function calculateFlyToDuration(zoom: number) {
  return 2500 / (zoom / 5);
}

const SOURCE_ID = 'locations';

export function ListMap(props: ListMapDefinition) {
  const [store, { setSelectedLocationsId }] = useStore();

  let containerRef: HTMLDivElement | undefined;
  let map: maplibre.Map | undefined;

  const [mapInstance, setMapInstance] = createSignal<maplibre.Map>();

  const hasValidBbox = () =>
    Array.isArray(props.list.bbox) &&
    props.list.bbox.length >= 3 &&
    props.list.bbox.every(
      (pair) =>
        Array.isArray(pair) &&
        typeof pair[0] === 'number' &&
        typeof pair[1] === 'number' &&
        !Number.isNaN(pair[0]) &&
        !Number.isNaN(pair[1])
    );

  function getFeature(e: maplibre.MapMouseEvent) {
    const features = map!.queryRenderedFeatures(e.point);
    const locationsId = features[0].properties?.locations_id;
    setSelectedLocationsId(locationsId);
    return features[0].geometry as GeoJSON.Point;
  }

  onMount(() => {
    maplibre.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      true
    );

    if (!containerRef) return;

    map = new maplibre.Map({
      container: containerRef,
      style: import.meta.env.VITE_MAP_STYLE,
      ...(hasValidBbox() ? { bounds: bounds(props.list.bbox) } : {}),
      minZoom: 1,
      maxZoom: 20,
      touchZoomRotate: false,
      dragRotate: false,
    });

    map.on('mouseover', 'locations', () => {
      map!.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'locations', () => {
      map!.getCanvas().style.cursor = '';
    });

    map.on('click', 'locations', (e) => {
      const geometry = getFeature(e);
      const coordinates = geometry.coordinates as [number, number];
      map!.flyTo({
        center: coordinates,
        zoom: map!.getZoom() > 12 ? map!.getZoom() : 12,
        duration: calculateFlyToDuration(map!.getZoom()),
        essential: true,
      });
    });

    map.addControl(
      new maplibre.NavigationControl({ showCompass: false, showZoom: true }),
      'bottom-left'
    );

    map.on('load', () => {
      const ids = props.list.sensorNodesIds;

      map!.addSource(SOURCE_ID, {
        type: 'vector',
        tiles: [
          `${import.meta.env.VITE_TILES_URL}/{z}/{x}/{y}.pbf?apiKey=${
            import.meta.env.VITE_TILES_API_KEY
          }`,
        ],
        minzoom: 1,
        maxzoom: 24,
      });

      map!.addLayer({
        id: 'locations',
        type: 'circle',
        source: SOURCE_ID,
        'source-layer': 'locations',
        paint: {
          'circle-color': [
            'case',
            ['in', ['get', 'locations_id'], ['literal', ids]],
            'transparent',
            '#A9B0BB',
          ],
          'circle-stroke-color': [
            'case',
            ['in', ['get', 'locations_id'], ['literal', ids]],
            'transparent',
            '#FFFFFF',
          ],
          'circle-stroke-width': [
            'interpolate', ['linear'], ['zoom'], 2, 1, 14, 4,
          ],
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'], 1, 3, 12, 14,
          ],
        },
      });

      map!.addLayer({
        id: 'listlocations',
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
            'interpolate', ['linear'], ['zoom'], 1, 3, 12, 14,
          ],
        },
      });

      setMapInstance(map);
    });
  });

  createEffect(() => {
    const m = mapInstance();
    const ids = props.list.sensorNodesIds;
    if (!m) return;

    if (m.getLayer('locations')) {
      m.setPaintProperty('locations', 'circle-color', [
        'case',
        ['in', ['get', 'locations_id'], ['literal', ids]],
        'transparent',
        '#A9B0BB',
      ]);
      m.setPaintProperty('locations', 'circle-stroke-color', [
        'case',
        ['in', ['get', 'locations_id'], ['literal', ids]],
        'transparent',
        '#FFFFFF',
      ]);
    }

    if (m.getLayer('listlocations')) {
      m.setPaintProperty('listlocations', 'circle-color', [
        'case',
        ['in', ['get', 'locations_id'], ['literal', ids]],
        '#FEE172',
        'transparent',
      ]);
      m.setPaintProperty('listlocations', 'circle-stroke-color', [
        'case',
        ['in', ['get', 'locations_id'], ['literal', ids]],
        '#33A3A1',
        'transparent',
      ]);
    }
  });

  createEffect(() => {
    const m = mapInstance();
    if (!m || !hasValidBbox()) return;
    m.fitBounds(bounds(props.list.bbox));
  });

  onCleanup(() => {
    map?.remove();
  });

  return (
    <div class="list-map-container">
      <div ref={containerRef} class="list-map" />
      <Show when={mapInstance()}>
        <Diplomat map={mapInstance()!} />
      </Show>
    </div>
  );
}