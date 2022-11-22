import { useParams } from '@solidjs/router';
import { createComputed } from 'solid-js';
import Breadcrumb from '../components/Breadcrumb';
import DetailCharts from '../components/DetailCharts';
import DetailOverview from '../components/DetailOverview';
import DownloadCard from '../components/Download';
import { useStore } from '../stores';

function Detail() {
  const params = useParams();
  const [store, { loadLocation }] = useStore();
  if (!store.location) {
    createComputed(() => loadLocation(params.id));
  }

  return (
    <>
      <Breadcrumb />
      <DetailOverview />
      <DetailCharts />
      <DownloadCard />
    </>
  );
}

export default Detail;
