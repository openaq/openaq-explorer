import { Map } from '~/components/Map';
import { LocationDetailCard } from '~/components/Cards/LocationDetailCard';
import { FlipCard } from '~/components/Cards/FlipCard';
import { clientOnly } from '@solidjs/start';
import '~/assets/scss/routes/index.scss';
import { useLocation, useNavigate } from '@solidjs/router';
import { useStore } from '~/stores';
import { createEffect, createMemo, onMount, Show } from 'solid-js';
import content from '~/content/notification.md?raw';
import MD5 from 'crypto-js/md5';
import { parseNotificationMarkdown } from '~/components/Cards/utils';
import { getGroupLocations } from '~/client';

export default function Home() {
  const showNotification = JSON.parse(
    import.meta.env.VITE_SHOW_NOTIFICATION || false
  );
  const [store, actions] = useStore();
  const NotificationCard = clientOnly(
    () => import('~/components/Cards/NotificationCard')
  );
  const HelpCard = clientOnly(() => import('~/components/Cards/HelpCard'));
  const hashedContent = MD5(content).toString();
  const dismissedKey = `${hashedContent}-notificationDismissed`;

  const parsedContent = parseNotificationMarkdown(content);
  const notificationType = parsedContent.notificationType;
  const notificationTitle = parsedContent.notificationTitle;
  const notificationContent = parsedContent.notificationContent;

  createEffect(() => {
    const isDismissed = localStorage.getItem(dismissedKey) === 'true';

    if (showNotification && !isDismissed) {
      actions.toggleShowNotificationCard(true);
    }

    if (isDismissed || !showNotification) {
      actions.toggleShowNotificationCard(false);
    }
  });

  const setSelectedLocationsId = actions.setSelectedLocationsId;
  const setSelectedMapParameter = actions.setSelectedMapParameter;
  const setProviders = actions.setProviders;
  const toggleMapIsActive = actions.toggleMapIsActive;
  const toggleMonitor = actions.toggleMonitor;
  const toggleAirSensor = actions.toggleAirSensor;
  const setGroupLocationsIds = actions.setGroupLocationsIds;
  const setGroups = actions.setGroups;

  const location = useLocation();
  const navigate = useNavigate();

  onMount(() => {
    if (location.query.location) {
      setSelectedLocationsId(Number(location.query.location));
    }

    if (location.query?.parameter) {
      if (
        Array.isArray(location.query.parameter) &&
        location.query.parameter.length === 0
      ) {
        setSelectedMapParameter(location.query.parameter[0]);
      } else if (typeof location.query.parameter == 'string') {
        setSelectedMapParameter(location.query.parameter);
      }
    }

    if (location.query?.active) {
      const activeStateFromQuery = location.query.active === 'true';
      if (store.showOnlyActiveLocations !== activeStateFromQuery) {
        toggleMapIsActive();
      }
    }

    if (location.query?.sensors) {
      const activeStateFromQuery = location.query.sensors === 'true';
      if (store.showAirSensors !== activeStateFromQuery) {
        toggleAirSensor();
      }
    }

    if (location.query?.monitors) {
      const activeStateFromQuery = location.query.monitors === 'true';
      if (store.showMonitors !== activeStateFromQuery) {
        toggleMonitor();
      }
    }

    if (location.query?.provider) {
      const params = new URLSearchParams(location.search);
      const providersArray = params
        .get('provider')
        ?.split(',')
        .map((providerId) => Number(providerId));
      providersArray && setProviders(providersArray);
    }

    if (location.query?.groupsId) {
      const params = new URLSearchParams(location.search);
      const groupsArray = params
        .get('groupsId')
        ?.split(',')
        .map((groupsId) => Number(groupsId));
      groupsArray && setGroups(groupsArray);
    }
  });

  createEffect(async () => {
    const getProviders = createMemo(() => store.providers);
    const providers = getProviders();
    const getGroups = createMemo(() => store.groups);
    const groups = getGroups();
    if (groups.length > 0) {
      let locationIds = new Set<number>([]);

      for (const groupsId of groups) {
        try {
          const locationsIds = await getGroupLocations(groupsId);
          console.log('group locations', locationsIds);
          locationIds.add(locationsIds[0].sensorNodesIds);
        } catch (error) {
          console.error(`Failed to fetch group ${groupsId}:`, error);
        }
      }
      setGroupLocationsIds(...locationIds);
    }

    const searchParams = new URLSearchParams();

    if (store.locationsId !== undefined) {
      searchParams.append('location', store.locationsId.toString());
    }

    if (store.mapParameter !== 'all') {
      searchParams.append('parameter', store.mapParameter.toString());
    }

    if (providers.length > 0) {
      searchParams.append('provider', store.providers.join(','));
    }

    if (groups.length > 0) {
      searchParams.append('groupsId', store.groups.join(','));
    }

    if (store.showOnlyActiveLocations == false) {
      searchParams.append('active', store.showOnlyActiveLocations.toString());
    }

    if (store.showMonitors == false) {
      searchParams.append('monitors', store.showMonitors.toString());
    }

    if (store.showAirSensors == false) {
      searchParams.append('sensors', store.showAirSensors.toString());
    }

    const queryString = searchParams.toString();
    const path = queryString
      ? `${location.pathname}?${queryString}${location.hash}`
      : `${location.pathname}${location.hash}`;

    navigate(path);
  });

  return (
    <>
      <main>
        {
          <Show when={showNotification && store.showNotificationCard}>
            <NotificationCard
              notificationType={notificationType}
              notificationTitle={notificationTitle}
              notificationContent={notificationContent}
              dismissedKey={dismissedKey}
            />
          </Show>
        }
        <HelpCard content={store.helpContent} title="Help" />
        <Map />
        <FlipCard />
        <LocationDetailCard />
      </main>
    </>
  );
}
