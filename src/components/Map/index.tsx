/* eslint-disable solid/style-prop */
import * as maplibre from 'maplibre-gl';
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useStore } from '~/stores';
import { Geocoder } from '../Geocoder';
import { Diplomat } from '../Diplomat';

import '~/assets/scss/components/map.scss';
import InfoIcon from '~/assets/imgs/svgs/info.svg';

function calculateFlyToDuration(zoom: number) {
  return 2500 / (zoom / 5);
}

const SOURCE_ID = 'locations';

export function Map() {
  const [store, { setSelectedLocationsId, setViewport }] = useStore();

  let containerRef: HTMLDivElement | undefined;
  let map: maplibre.Map | undefined;

  const [mapInstance, setMapInstance] = createSignal<maplibre.Map>();

  const calculateIsMonitor = (): boolean => {
    if (!store.showMonitors && store.showAirSensors) return false;
    if (store.showMonitors && !store.showAirSensors) return true;
    return false;
  };

  const setVisibility = () => {
    const arr: any[] = ['all'];
    if (store.mapParameter !== 'all') {
      arr.push(['==', ['get', store.mapParameter], true]);
    }
    if ((store.providers?.length ?? 0) > 0) {
      arr.push(['in', ['get', 'providers_id'], ['literal', store.providers]]);
    }
    if ((store.groupLocationsIds?.length ?? 0) > 0) {
      arr.push([
        'in',
        ['get', 'locations_id'],
        ['literal', store.groupLocationsIds],
      ]);
    }
    if (store.showOnlyActiveLocations) {
      arr.push(['==', ['get', 'active'], true]);
    }

    if (store.showMonitors && store.showAirSensors) {
      return arr;
    } else {
      const isMonitor = calculateIsMonitor();
      arr.push(['==', ['get', 'ismonitor'], isMonitor]);
    }
    return arr;
  };

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
      center: store.viewport.center,
      zoom: store.viewport.zoom,
      minZoom: 1,
      maxZoom: 20,
      hash: true,
      touchZoomRotate: false,
      dragRotate: false,
      attributionControl: false,
    });

    map.addControl(new maplibre.ScaleControl(), 'bottom-left');
    map.addControl(
      new maplibre.AttributionControl({
        customAttribution:
          '© <a href="https://geocode.earth">Geocode Earth</a>, Powered by <a href="https://protomaps.com">Protomaps</a>',
      }),
      'bottom-right'
    );
    map.addControl(
      new maplibre.NavigationControl({ showCompass: false, showZoom: true }),
      'bottom-left'
    );

    map.on('moveend', () => {
      setViewport({
        center: map!.getCenter().toArray() as [number, number],
        zoom: map!.getZoom(),
      });
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

    map.on('load', () => {
      map!.addSource(SOURCE_ID, {
        type: 'vector',
        tiles: [
          `${import.meta.env.VITE_TILES_URL}/{z}/{x}/{y}.pbf?apiKey=${
            import.meta.env.VITE_TILES_API_KEY
          }`,
        ],
        minzoom: 1,
        maxzoom: 24,
        bounds: [-180, -90, 180, 90],
      });

      map!.addLayer({
        id: 'locations-shadow',
        type: 'circle',
        source: SOURCE_ID,
        'source-layer': 'locations',
        paint: {
          'circle-color': 'black',
          'circle-blur': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1,
            0.75,
            14,
            0.25,
          ],
          'circle-translate': [0, 4],
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
              'case',
              setVisibility(),
              ['case', ['==', ['get', 'ismonitor'], true], 4, 2],
              0,
            ],
            14,
            [
              'case',
              setVisibility(),
              ['case', ['==', ['get', 'ismonitor'], true], 32, 15],
              0,
            ],
          ],
        },
      });

      map!.addLayer({
        id: 'locations',
        type: 'circle',
        source: SOURCE_ID,
        'source-layer': 'locations',
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'active'], true],
            '#6a5cd8',
            '#7e8c9a',
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
            [
              'case',
              setVisibility(),
              ['case', ['==', ['get', 'ismonitor'], true], 1, 0.25],
              0,
            ],
            14,
            [
              'case',
              setVisibility(),
              ['case', ['==', ['get', 'ismonitor'], true], 6, 0],
              0,
            ],
          ],
          'circle-stroke-opacity': ['case', setVisibility(), 1, 0],
          'circle-opacity': ['case', setVisibility(), 1, 0],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1,
            [
              'case',
              setVisibility(),
              ['case', ['==', ['get', 'ismonitor'], true], 3, 2],
              0,
            ],
            14,
            [
              'case',
              setVisibility(),
              ['case', ['==', ['get', 'ismonitor'], true], 22, 13],
              0,
            ],
          ],
        },
      });

      map!.addLayer({
        id: 'selected-location-shadow',
        type: 'circle',
        source: SOURCE_ID,
        'source-layer': 'locations',
        filter: [
          '==',
          ['get', 'locations_id'],
          ['literal', store.locationsId || 0],
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
      });

      map!.addLayer({
        id: 'selected-location',
        type: 'circle',
        source: SOURCE_ID,
        'source-layer': 'locations',
        filter: [
          '==',
          ['get', 'locations_id'],
          ['literal', store.locationsId || 0],
        ],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'active'], true],
            '#6a5cd8',
            '#7e8c9a',
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
      });

      setMapInstance(map);
    });
  });

  createEffect(() => {
    const m = mapInstance();
    const { center, zoom } = store.viewport;
    if (!m) return;

    const current = m.getCenter();
    if (
      current.lng !== center[0] ||
      current.lat !== center[1] ||
      m.getZoom() !== zoom
    ) {
      m.jumpTo({ center, zoom });
    }
  });

  createEffect(() => {
    const m = mapInstance();
    const b = store.bounds;
    if (!m || b.length !== 4) return;

    m.fitBounds(
      [
        [b[0], b[1]],
        [b[2], b[3]],
      ],
      { padding: { top: 90, bottom: 150, left: 20, right: 360 } }
    );
  });

  createEffect(() => {
    const m = mapInstance();
    const visibility = setVisibility(); // reads store.mapParameter, store.providers, etc.
    if (!m?.getLayer('locations-shadow')) return;

    m.setPaintProperty('locations-shadow', 'circle-radius', [
      'interpolate',
      ['linear'],
      ['zoom'],
      1,
      [
        'case',
        visibility,
        ['case', ['==', ['get', 'ismonitor'], true], 4, 2],
        0,
      ],
      14,
      [
        'case',
        visibility,
        ['case', ['==', ['get', 'ismonitor'], true], 32, 15],
        0,
      ],
    ]);

    m.setPaintProperty('locations', 'circle-stroke-width', [
      'interpolate',
      ['linear'],
      ['zoom'],
      2,
      [
        'case',
        visibility,
        ['case', ['==', ['get', 'ismonitor'], true], 1, 0.25],
        0,
      ],
      14,
      [
        'case',
        visibility,
        ['case', ['==', ['get', 'ismonitor'], true], 6, 0],
        0,
      ],
    ]);
    m.setPaintProperty('locations', 'circle-stroke-opacity', [
      'case',
      visibility,
      1,
      0,
    ]);
    m.setPaintProperty('locations', 'circle-opacity', [
      'case',
      visibility,
      1,
      0,
    ]);
    m.setPaintProperty('locations', 'circle-radius', [
      'interpolate',
      ['linear'],
      ['zoom'],
      1,
      [
        'case',
        visibility,
        ['case', ['==', ['get', 'ismonitor'], true], 3, 2],
        0,
      ],
      14,
      [
        'case',
        visibility,
        ['case', ['==', ['get', 'ismonitor'], true], 22, 13],
        0,
      ],
    ]);
  });

  createEffect(() => {
    const m = mapInstance();
    const locationsId = store.locationsId || 0;
    if (!m?.getLayer('selected-location')) return;

    const filter = ['==', ['get', 'locations_id'], ['literal', locationsId]];
    m.setFilter('selected-location-shadow', filter as any);
    m.setFilter('selected-location', filter as any);
  });

  onCleanup(() => {
    map?.remove();
  });

  return (
    <div class="map-container">
      <div ref={containerRef} class="map" />
      <Show when={mapInstance()}>
        <Geocoder map={mapInstance()!} />
        <Diplomat map={mapInstance()!} />
      </Show>
      <div class="getting-started-link">
        <InfoIcon
          viewBox="0 0 25 25"
          role="img"
          aria-label="Info Icon"
          class="info-icon"
        />
        <a href="/getting-started">Learn how to use the Explorer</a>
      </div>
    </div>
  );
}
