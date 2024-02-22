import { useMapContext } from 'solid-map-gl';
import { onMount } from 'solid-js';

import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';

async function sendRequest(text: string) {
  const url = new URL(import.meta.env.VITE_GEOCODE_URL);
  url.search = `?api_key=${
    import.meta.env.VITE_GEOCDE_API_KEY
  }&layers=coarse&text=${text}`;
  const res = await fetch(url.href);
  const data = await res.json();
  return data;
}

export const Geocoder = () => {
  const [ctx] = useMapContext();

  onMount(() => {
    const GeoApi = {
      forwardGeocode: async (config) => {
        try {
          const geojson = await sendRequest(config.query);
          const features = geojson.features.map((o) => {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: o.geometry.coordinates,
              },
              id: `${o.properties.source}.${o.properties.id}`,
              place_name: o.properties.label,
              place_type: ['place'],
              text: o.properties.name,
              center: o.geometry.coordinates,
            };
          });
          return {
            type: 'FeatureCollection',
            query: [config.query],
            features: features,
          };
        } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
        }
      },
    };
    const geocoder = new MaplibreGeocoder(GeoApi, {
      marker: false,
      showResultsWhileTyping: true,
      zoom: 10,
      debounceSearch: 300,
    });
    ctx.map.addControl(geocoder, 'top-left');
  });

  return <></>;
};
