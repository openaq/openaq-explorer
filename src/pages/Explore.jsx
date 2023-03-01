import { Map } from '../components/Map';
import MapLegend from '../components/Map/MapLegend';
import HelpCard from '../components/Help';
import LocationDetailCard from '../components/MapCards/LocationDetailCard';
import MapCards from '../components/MapCards';

export default function Explore() {
  return (
    <>
      <Map />
      <MapLegend />
      <MapCards />
      <LocationDetailCard />
      <HelpCard />
    </>
  );
}
