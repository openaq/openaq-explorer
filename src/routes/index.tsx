import { Map } from "~/components/Map";
import { getUserId } from "~/db";
import { LocationDetailCard } from "~/components/Cards/LocationDetailCard";
import { FlipCard } from "~/components/Cards/FlipCard";
import { Header } from "~/components/Header";

import "~/assets/scss/routes/index.scss";
import { useLocation, useNavigate } from "@solidjs/router";
import { useStore } from "~/stores";
import { createEffect, createMemo, onMount } from "solid-js";


export const route = {
  load: () => getUserId(),
};

export default function Home() {
  const [store, actions] = useStore();

  const setSelectedLocationsId = actions.setSelectedLocationsId;
  const setSelectedMapParameter = actions.setSelectedMapParameter;
  const setProviders = actions.setProviders;

  const location = useLocation();
  const navigate = useNavigate();

  onMount(() => {
    if (location.query.location) {
      setSelectedLocationsId(Number(location.query.location));
    }

    if (location.query?.parameter) {
      setSelectedMapParameter(Number(location.query.parameter));
    }

    if (location.query?.provider) {
      const params = new URLSearchParams(location.search);
      const providersArray = params.get("provider")?.split(",").map(providerId => Number(providerId));  
      providersArray && setProviders(providersArray);
    }
  });

  createEffect(() => {
    const getProviders = createMemo(() => store.providers);
    const providers = getProviders();
    
    console.log("store providers in the index route", store.providers);

    const searchParams = new URLSearchParams();

    if (store.locationsId !== undefined) {
      searchParams.append("location", store.locationsId.toString());
    }

    if (store.mapParameter !== "all") {
      searchParams.append("parameter", store.mapParameter);
    }

    if (providers.length > 0) {
      console.log("providers in the index route", providers);
      searchParams.append("provider", store.providers.join(","));
    }

    const queryString = searchParams.toString();
    const path = queryString
      ? `${location.pathname}?${queryString}${location.hash}`
      : `${location.pathname}${location.hash}`;

    navigate(path);
  });

  return (
    <>
      <Header />
      <main>
        <Map />
        <FlipCard />
        <LocationDetailCard />
      </main>
    </>
  );
}
