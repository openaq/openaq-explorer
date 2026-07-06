import { createEffect, onCleanup, onMount } from 'solid-js';
import * as maplibre from 'maplibre-gl';
import { useStore } from '~/stores';
import * as MaplibreDiplomat from '@americana/diplomat';

interface DiplomatProps {
  map: maplibre.Map;
}

export function Diplomat(props: DiplomatProps) {
  const [store, { setLanguage }] = useStore();

  onMount(() => {
    const handleSystemLanguageChange = () => {
      if (typeof navigator !== 'undefined') {
        const primaryLang = navigator.language.split('-')[0];
        setLanguage(primaryLang);
      }
    };

    window.addEventListener('languagechange', handleSystemLanguageChange);
    onCleanup(() =>
      window.removeEventListener('languagechange', handleSystemLanguageChange)
    );
  });

  createEffect(() => {
    const map = props.map;
    if (!map) return;

    const targetLocales = store.language ? [store.language] : ['en'];
    const currentLang = store.language || 'en';

    const applyLocalization = () => {
      MaplibreDiplomat.localizeStyle(map, targetLocales);

      map.setLayoutProperty(
        'places_country',
        'text-field',
        `{name:${currentLang}}`
      );
    };

    if (map.isStyleLoaded()) {
      applyLocalization();
    } else {
      map.once('styledata', applyLocalization);
    }
  });

  return <></>;
}