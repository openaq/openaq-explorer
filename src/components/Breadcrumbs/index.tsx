import { A } from '@solidjs/router';
import '~/assets/scss/components/breadcrumbs.scss';
import ChevronRightIcon from '~/assets/imgs/chevron_right.svg';
import HomeIcon from '~/assets/imgs/home.svg';

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
    <nav class="breadcrumbs" aria-label="breadcrumbs">
      <A href="https://openaq.org">
        <HomeIcon 
          {...svgAttributes} 
          fill="#33a3a1" 
          role="img"
          aria-label="home"
        />
      </A>
      <ChevronRightIcon {...svgAttributes} aria-hidden="true" />
      <A href="/">Explore the data</A>
      <ChevronRightIcon {...svgAttributes} aria-hidden="true" />
      <span class="" data-testid="page-name">
        {props.pageName}
      </span>
    </nav>
  );
}
