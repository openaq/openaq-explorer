import { Meta } from '@solidjs/meta';

interface LocationDetailOpenGraphDefinition {
  locationName: string;
  locationsId: number;
}

export function LocationDetailOpenGraph(
  props: LocationDetailOpenGraphDefinition
) {
  const title = `OpenAQ Location ID ${props.locationsId}`;
  const description = `Details about monitoring location, OpenAQ ID ${props.locationsId}. Browse the measurements data and download when logged in.`;
  const url = `https://explore.openaq.org/locations/${props.locationsId}`;

  return (
    <>
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:url" content={url} />
      <Meta property="og:locale" content="en_US" />
      <Meta property="og:site_name" content="OpenAQ Explorer" />
    </>
  );
}
