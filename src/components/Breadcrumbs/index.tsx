import { A } from "@solidjs/router";
import styles from './Breadcrumbs.module.scss';

interface BreadcrumbsDefinition {
    pageName: string;
}


export function Breadcrumbs(props: BreadcrumbsDefinition) {
    return (
        <div class={styles.breadcrumbs}>
            <A href="https://openaq.org"><img src="/svgs/home_ocean_120.svg" alt="home" /></A>
            <img src="/svgs/chevron_right_smoke_100.svg" alt="chevron right" />
            <A href="/">Explore the data</A>
            <img src="/svgs/chevron_right_smoke_100.svg" alt="chevron right" />
            <span class="">{props.pageName}</span>
        </div>
    )
}