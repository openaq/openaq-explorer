import { useMap } from 'solid-map-gl';
import { onMount } from 'solid-js';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const Geocoder = () => {
  const map = useMap();

  onMount(() => {
    const accessToken = map()._requestManager._customAccessToken;
    const geocoder = new MapboxGeocoder({
      accessToken: accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      types:
        'country,region,postcode,district,place,locality,neighborhood',
    });
    map().addControl(geocoder, 'top-left');
  });

  return <></>;
};

export default Geocoder;
