import MapGL, { Control, Marker, Viewport } from 'solid-map-gl';
import * as maplibre from 'maplibre-gl';
import { createSignal } from 'solid-js';
import destination from '@turf/destination';

import '~/assets/scss/components/detail-map.scss';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DetailMapDefinition {
  coordinates: Coordinates;
}

function bounds(coordinates: number[]) {
  const sw = destination(coordinates, 20, -135, {
    units: 'kilometers',
  });
  const ne = destination(coordinates, 20, 45, {
    units: 'kilometers',
  });
  return [...sw.geometry.coordinates, ...ne.geometry.coordinates];
}

export function DetailMap(props: DetailMapDefinition) {
  const [viewport, setViewport] = createSignal({
    center: [
      props.coordinates?.longitude,
      props.coordinates?.latitude,
    ],
    zoom: 14,
  } as Viewport);

  return (
    <div class='detail-map-container'>
      <MapGL
        class='detail-map'
        mapLib={maplibre}
        options={{
          accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
          style: import.meta.env.VITE_MAP_STYLE,
          touchZoomRotate: true,
          dragRotate: true,
          maxZoom: 16,
          maxBounds: bounds([
            props.coordinates?.longitude,
            props.coordinates?.latitude,
          ]),
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
        <Marker
          lngLat={[
            props.coordinates?.longitude,
            props.coordinates?.latitude,
          ]}
          options={{ color: '#1E64AB', scale: 1.5 }}
        >
          {`<p>Location</p>${props.coordinates?.latitude} N ${props.coordinates?.longitude} E`}
        </Marker>
      </MapGL>
    </div>
  );
}
