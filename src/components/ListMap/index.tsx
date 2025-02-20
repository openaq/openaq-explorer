import MapGL, { Source, Layer, Control, Viewport } from 'solid-map-gl';
import * as maplibre from 'maplibre-gl';
import { createSignal } from 'solid-js';
import 'maplibre-gl/dist/maplibre-gl.css';

import destination from '@turf/destination';
import { useStore } from '~/stores';

import '~/assets/scss/components/list-map.scss';

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
  return [...sw.geometry.coordinates, ...ne.geometry.coordinates];
}

function calculateFlyToDuration(zoom: number) {
  return 2500 / (zoom / 5);
}

export function ListMap(props: ListMapDefinition) {
  const [viewport, setViewport] = createSignal({
    bounds: bounds(props.list.bbox),
  } as Viewport);

  const [store, { setSelectedLocationsId }] = useStore();

  function getFeature(e: any) {
    const features = e.target.queryRenderedFeatures(e.point);
    const locationsId = features[0].properties.locations_id;
    setSelectedLocationsId(locationsId);
    return features[0].geometry.coordinates;
  }

  return (
    <MapGL
      class="list-map"
      mapLib={maplibre}
      options={{
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
        style: import.meta.env.VITE_MAP_STYLE,
        touchZoomRotate: false,
        dragRotate: false,
        minZoom: 1,
        maxZoom: 20,
      }}
      viewport={viewport()}
      onViewportChange={(e) => {
        return setViewport(e);
      }}
      onMouseOver={{
        locations: (e) => (e.target.getCanvas().style.cursor = 'pointer'),
      }}
      onMouseLeave={{
        locations: (e) => (e.target.getCanvas().style.cursor = ''),
      }}
    >
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
        }}
      >
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
            'source-layer': 'locations',
            paint: {
              'circle-color': [
                'case',
                [
                  'in',
                  ['get', 'locations_id'],
                  ['literal', props.list.sensorNodesIds],
                ],
                'transparent',
                '#A9B0BB',
              ],
              'circle-stroke-color': [
                'case',
                [
                  'in',
                  ['get', 'locations_id'],
                  ['literal', props.list.sensorNodesIds],
                ],
                'transparent',
                '#FFFFFF',
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
                14,
              ],
            },
          }}
        />
        <Layer
          id="listlocations"
          style={{
            type: 'circle',
            'source-layer': 'locations',
            paint: {
              'circle-color': [
                'case',
                [
                  'in',
                  ['get', 'locations_id'],
                  ['literal', props.list.sensorNodesIds],
                ],
                '#FEE172',
                'transparent',
              ],
              'circle-stroke-color': [
                'case',
                [
                  'in',
                  ['get', 'locations_id'],
                  ['literal', props.list.sensorNodesIds],
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
                14,
              ],
            },
          }}
        />
      </Source>
      <Control
        type="navigation"
        position="bottom-left"
        options={{ showCompass: false, showZoom: true }}
      />
    </MapGL>
  );
}
