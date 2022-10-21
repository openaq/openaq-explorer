import { useStore } from '../stores';
import Map from '../components/Map';
import MapLegend from '../components/MapLegend';
import HelpCard from '../components/Help';
import LocationDetailCard from '../components/MapCards/LocationDetailCard';
import FilterOverlayCard from '../components/MapCards/ExpandableCard';
import SourcesCard from '../components/MapCards/SourcesCard';

export default function Explore() {
  return (
    <>
      <Map />
      <MapLegend />
      <FilterOverlayCard />
      <LocationDetailCard />
      <HelpCard />
      <SourcesCard />
    </>
  );
}
