import { A } from '@solidjs/router';
import '~/assets/scss/components/breadcrumbs.scss';
import ChevronRightIcon from '~/assets/imgs/chevreon_right.svg';

interface BreadcrumbsDefinition {
  pageName: string;
}

export function Breadcrumbs(props: BreadcrumbsDefinition) {
  const svgAttributes = {
    width: 24,
    height: 24,
    fill: '#5a6672',
  };
  return (
    <div class="breadcrumbs">
      <A href="https://openaq.org">
        <img src="/svgs/home_ocean_120.svg" alt="home" />
      </A>
      <ChevronRightIcon {...svgAttributes} />
      <A href="/">Explore the data</A>
      <ChevronRightIcon {...svgAttributes} />
      <span class="" data-testid="page-name">
        {props.pageName}
      </span>
    </div>
  );
}
