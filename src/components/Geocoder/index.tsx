import { onMount } from 'solid-js';
import * as maplibre from 'maplibre-gl';

import MaplibreGeocoder, {
  type MaplibreGeocoderApi,
  type MaplibreGeocoderFeatureResults,
} from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';

async function sendRequest(text: string) {
  const url = new URL(import.meta.env.VITE_GEOCODE_URL);
  url.search = `?api_key=${
    import.meta.env.VITE_GEOCODE_API_KEY
  }&layers=coarse&text=${text}`;
  const res = await fetch(url.href);
  const data = await res.json();
  return data;
}

interface GeocoderProps {
  map: maplibre.Map;
}



export const Geocoder = (props: GeocoderProps) => {
  onMount(() => {
    const GeoApi: MaplibreGeocoderApi = {
      forwardGeocode: async (
        config
      ): Promise<MaplibreGeocoderFeatureResults> => {
        try {
          const geojson = await sendRequest(config.query);
          const features = geojson.features.map((o) => {
            return {
              type: 'Feature' as const,
              geometry: {
                type: 'Point' as const,
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
            features,
          };
        } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
          return {
            type: 'FeatureCollection',
            query: [config.query],
            features: [],
          };
        }
      },
    };

    const geocoder = new MaplibreGeocoder(GeoApi, {
      marker: false,
      showResultsWhileTyping: true,
      zoom: 10,
      debounceSearch: 300,
    });
    props.map.addControl(geocoder, 'top-left');
  });

  return <></>;
};
