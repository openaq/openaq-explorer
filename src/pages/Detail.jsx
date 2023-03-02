import { useParams } from '@solidjs/router';
import { createComputed } from 'solid-js';
import Breadcrumb from '../components/Breadcrumb';
import DetailCharts from '../components/DetailCharts';
import DetailOverview from '../components/DetailOverview';
import DownloadCard from '../components/Download';
import HelpCard from '../components/Help';
import { useStore } from '../stores';

function Detail() {
  const params = useParams();
  const [store, { loadLocation }] = useStore();
  if (!store.location) {
    createComputed(() => loadLocation(params.id));
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Breadcrumb />
        <DetailOverview />
        <DetailCharts />
        <DownloadCard />
        <HelpCard />
      </div>
    </>
  );
}

export default Detail;
