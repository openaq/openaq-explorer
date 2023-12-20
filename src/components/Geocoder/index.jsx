import { useMapContext } from 'solid-map-gl';
import { onMount } from 'solid-js';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const Geocoder = () => {
  const [ctx] = useMapContext();

  onMount(() => {
    const accessToken = ctx.map._requestManager._customAccessToken;
    const geocoder = new MapboxGeocoder({
      accessToken: accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      types:
        'country,region,postcode,district,place,locality,neighborhood',
    });
    ctx.map.addControl(geocoder, 'top-left');
  });

  return <></>;
};

export default Geocoder;
