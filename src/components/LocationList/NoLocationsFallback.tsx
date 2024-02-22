import style from "./NoLocationsFallback.module.scss"

import { A } from "@solidjs/router";

export function NoLocationsFallback() {
    return(
      <div class={style["no-locations-fallback"]}>
        <p class="type-subtitle-1 text-smoke-120">Lists allow you to collect and save a set of monitoring locations for easy access.</p>
        <p class="type-subtitle-2 text-smoke-120">To start adding monitoring locations to your list, first find locations in the <A href="/">Explore</A> map, and then click on "Add to list".</p>
      </div>
    )
  }
  