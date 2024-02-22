import MapGL, { Control, Layer, Marker, Source, Viewport } from 'solid-map-gl';
import * as maplibre from 'maplibre-gl';
import { createSignal } from 'solid-js';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './DetailMap.module.scss';
import destination from '@turf/destination';

interface MobileDetailMapDefinition {
  coordinates: number[];
}

function bounds(coordinates: number[]) {
  const sw = destination(coordinates, 10, -135,{units: 'kilometers'})
  const ne = destination(coordinates, 10, 45,{units: 'kilometers'})
  return [...sw.geometry.coordinates, ...ne.geometry.coordinates]
}


export default function MobileDetailMap(props: MobileDetailMapDefinition) {

  const [viewport, setViewport] = createSignal({
    center: props.coordinates,
    zoom: 14,
  } as Viewport);

  return (
    <div class={styles['map-container']}>
    <MapGL
      class={styles.map}
      mapLib={maplibre}
      options={{
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
        style: import.meta.env.VITE_MAP_STYLE,
        touchZoomRotate: true,
        dragRotate: true,
        maxZoom: 16,
      }}
      viewport={viewport()}
      onViewportChange={(e) => {
        return setViewport(e);
      }}

    >
      <Control type="scale" position="bottom-left" />
      <Control
        type="navigation"
        position="top-left"
        options={{ showCompass: false, showZoom: true }}
      />
      <Source
        source={{
          type: 'vector',
          url: '',
        }}
      >
        <Layer
          style={{
            type: 'circle',
            source: '',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    1,
                    2,
                    14,
                    13
                  ],
              'circle-color': '#6a5cd8',
            },
          }}
        />
    </Source>
    </MapGL>
    </div>
  );
}
