import { createEffect, onCleanup, onMount } from 'solid-js';
import { useMapContext } from 'solid-map-gl';
import { useStore } from '~/stores';
import * as MaplibreDiplomat from '@americana/diplomat';

export function Diplomat() {
  const [ctx] = useMapContext();
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
    const mapInstance = ctx.map;
    if (!mapInstance) return;

    const targetLocales = store.language ? [store.language] : ['en'];
    const currentLang = store.language || 'en';

    const applyLocalization = () => {
      MaplibreDiplomat.localizeStyle(mapInstance, targetLocales);

      mapInstance.setLayoutProperty(
        'places_country',
        'text-field',
        `{name:${currentLang}}`
      );
    };

    if (mapInstance.isStyleLoaded()) {
      applyLocalization();
    } else {
      mapInstance.once('styledata', applyLocalization);
    }
  });

  return <></>;
}
