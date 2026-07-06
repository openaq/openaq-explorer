import * as maplibre from 'maplibre-gl';
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import destination from '@turf/destination';
import 'maplibre-gl/dist/maplibre-gl.css';

import '~/assets/scss/components/detail-map.scss';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DetailMapDefinition {
  coordinates: Coordinates;
}

function bounds(coordinates: number[]) {
  const sw = destination(coordinates, 20, -135, { units: 'kilometers' });
  const ne = destination(coordinates, 20, 45, { units: 'kilometers' });
  return [
    ...sw.geometry.coordinates,
    ...ne.geometry.coordinates,
  ] as [number, number, number, number];
}

function DetailMap(props: DetailMapDefinition) {
  let containerRef: HTMLDivElement | undefined;
  let map: maplibre.Map | undefined;
  let marker: maplibre.Marker | undefined;

  const [mapReady, setMapReady] = createSignal(false);

  const hasValidCoords = () =>
    typeof props.coordinates?.longitude === 'number' &&
    typeof props.coordinates?.latitude === 'number' &&
    !Number.isNaN(props.coordinates.longitude) &&
    !Number.isNaN(props.coordinates.latitude);

  onMount(() => {
    if (!hasValidCoords() || !containerRef) return;

    const { longitude, latitude } = props.coordinates;

    map = new maplibre.Map({
      container: containerRef,
      style: import.meta.env.VITE_MAP_STYLE,
      center: [longitude, latitude],
      zoom: 14,
      maxZoom: 16,
      touchZoomRotate: true,
      dragRotate: true,
      maxBounds: bounds([longitude, latitude]),
    });

    map.addControl(new maplibre.ScaleControl(), 'bottom-left');
    map.addControl(
      new maplibre.NavigationControl({ showCompass: false, showZoom: true }),
      'top-left'
    );

    const markerEl = document.createElement('div');
    markerEl.innerHTML = `<p>Location</p>${latitude} N ${longitude} E`;

    marker = new maplibre.Marker({ color: '#656565', scale: 1.5 })
      .setLngLat([longitude, latitude])
      .setPopup(new maplibre.Popup().setDOMContent(markerEl))
      .addTo(map);

    map.on('load', () => setMapReady(true));
  });

  createEffect(() => {
    if (!map || !mapReady() || !hasValidCoords()) return;

    const { longitude, latitude } = props.coordinates;

    map.setMaxBounds(bounds([longitude, latitude]));
    map.jumpTo({ center: [longitude, latitude] });
    marker?.setLngLat([longitude, latitude]);
  });

  onCleanup(() => {
    marker?.remove();
    map?.remove();
  });

  return (
    <div class="detail-map-container">
      <Show when={hasValidCoords()}>
        <div ref={containerRef} class="detail-map" />
      </Show>
    </div>
  );
}

export default DetailMap;