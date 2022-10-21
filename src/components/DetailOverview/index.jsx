import style from './DetailOverview.module.css';
import dayjs from 'dayjs/esm/index.js';
import relativeTime from 'dayjs/plugin/relativeTime';
import Progress from '../Charts/Progress';
import { Link } from '@solidjs/router';
import img from '../../assets/demo.png';
import { useStore } from '../../stores';

dayjs.extend(relativeTime);

export default function DetailOverview() {
  const [store, { loadLocation, checkForUpdate }] = useStore();

  const firstUpdated = dayjs(store.location?.firstUpdated);
  const lastUpdated = dayjs(store.location?.lastUpdated);

  setInterval(() => checkForUpdate(), 1000 * 5);

  return (
    <div className={`${style.overview} ${style['section-card']}`}>
      <div className={style['overview__header']}>
        <div>
          <div class="location-breadcrumb">
            {store.location?.country}{' '}
            {store.location?.city ? '/' : ''} {store.location?.city}
          </div>
          <h2 className="location-detail-title">
            {store.location?.name}
          </h2>
        </div>
        <div style="display:flex; height:40px">
          <button class="btn btn-tertiary icon-btn">
            <span>Download webpage (PDF)</span>
            <span class="material-symbols-rounded">
              sim_card_download
            </span>
          </button>
          <Link href="/" class="btn btn-tertiary  icon-btn">
            <span>Download data </span>

            <span class="material-symbols-rounded">
              cloud_download
            </span>
          </Link>
          <button className="btn btn-tertiary icon-btn">
            <span>Add to Favorites</span>

            <span class="material-symbols-rounded">star</span>
          </button>
        </div>
      </div>
      <div className={style['overview__body']}>
        <section style="flex: 1;">
          <h4>CHARACTERISTICS</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; row-gap: 16px;">
            <div>Type</div>
            <div>
              {' '}
              <div>{store.location?.sensorType}</div>{' '}
              <div>
                {store.location?.isMobile ? 'Mobile' : 'Stationary'}
              </div>{' '}
            </div>
            <div>Owner</div>
            <div>{store.location?.entity}</div>
            <div>Parameters</div>
            <div>
              {store.location?.parameters
                .map((o) => `${o.displayName} (${o.unit})`)
                .join(', ')}
            </div>
            <div>Name</div>
            <div>{store.location?.name}</div>
            <div>Reporting</div>
            <div>
              {dayjs(lastUpdated).fromNow()}
              <div>
                {' '}
                Since : {firstUpdated.format('DD/MM/YYYY')}
              </div>{' '}
              <div></div>
            </div>
            <div>Source(s)</div>
            <div>
              <For each={store.location?.sources}>
                {(source, i) => {
                  return source.url ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={source.url}
                    >
                      {source.name}
                    </a>
                  ) : (
                    <span>{source.name}</span>
                  );
                }}
              </For>
            </div>
          </div>
        </section>
        <section style="flex: 1;">
          <h4>DATA COVERAGE</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; row-gap: 28px;">
            <span>Last 7 days</span>
            <Progress
              width={156}
              height={15}
              margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
              percent={0.15}
            />
            <span>Last 30 days</span>
            <Progress
              width={156}
              height={15}
              margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
              percent={0.65}
            />
            <span>Last 90 days</span>
            <Progress
              width={156}
              height={15}
              margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
              percent={0.42}
              legend={true}
            />
          </div>
        </section>
        <section style="flex: 1;">
          <div className="detail-map">
            <div className="detail-map-overlay">
              <div style="margin: 20px 16px;">
                <div className="detail-map-overlay__title">
                  <h5 className="subtitle3">LOCATION</h5>
                  <a
                    href={`https://openstreetmap.org?mlat=${store.location?.coordinates.latitude}&mlon=${store.location?.coordinates.longitude}&zoom=16`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span class="material-symbols-outlined green">
                      open_in_new
                    </span>
                  </a>
                </div>
                <div className="detail-map-overlay__coordinates">
                  <span>{store.location?.coordinates.latitude}</span>
                  <span>{store.location?.coordinates.longitude}</span>
                </div>
              </div>
            </div>
            <div className="detail-map__attribution">
              ©{' '}
              <a href="https://www.mapbox.com/about/maps/">Mapbox</a>{' '}
              ©{' '}
              <a href="http://www.openstreetmap.org/copyright">
                OpenStreetMap
              </a>{' '}
              <strong>
                <a
                  href="https://www.mapbox.com/map-feedback/"
                  target="_blank"
                >
                  Improve this map
                </a>
              </strong>
            </div>
            <img className="detail-map__image" src={img} alt="" />
          </div>
        </section>
      </div>
    </div>
  );
}
