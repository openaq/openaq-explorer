import { useParams } from '@solidjs/router';
import { createComputed } from 'solid-js';
import DetailCharts from '../components/DetailCharts';
import DetailOverview from '../components/DetailOverview';
import { useStore } from '../stores';

function Detail() {
  const params = useParams();
  const [store, { loadLocation }] = useStore();
  if (!store.location) {
    createComputed(() => loadLocation(params.id));
  }

  return (
    <>
      <DetailOverview />
      <DetailCharts />
    </>
  );
}

export default Detail;
