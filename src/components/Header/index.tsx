import { getUser, logoutAction } from '~/db';

import { createAsync, useLocation } from '@solidjs/router';

import { createMemo, createSignal } from 'solid-js';

import { A } from '@solidjs/router';

import style from './Header.module.scss';

function Account() {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  const invalidRedirectPath = ['/lists', '/account']

  
  const re = /\/lists[\/\d+]*|\/account/;
  const match = pathname().match(re);


  return (
    <div class={style["dropdown"]}>
      <A href="/account">
        <img
          width="24px"
          height="24px"
          src="/svgs/account.svg"
          alt="account icon"
        />
      </A>
      <ul class={style["submenu"]} aria-label="submenu">
        <li class={style["submenu__item"]}>
          <A href="/account" class={`type-body-3 text-smoke-120 ${style["settings-link"]}`}>
            <img
              width="24px"
              height="24px"
              src="/svgs/settings.svg"
              alt="settings icon"
            />
            Settings
          </A>
        </li>
        <li class={style["submenu__item"]}>
          <form action={logoutAction} method="post" class={style['logout-form']}>
            <img src="/svgs/logout.svg" alt="logout icon" />
            <input
            type="hidden"
            name="redirect"
            value={match ? '/' : pathname()}
          />
            <button name="logout" type="submit" class={`type-body-3 text-smoke-120 ${style["logout-btn"]}`}>
              Logout
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
}




export function Header() {
  const pageLocation = useLocation();


  const [open, setOpen] = createSignal();

  const user = createAsync(() => getUser(), { deferStream: true });


  return (
    <header class={style["header"]}>
      <div class={style["header-contents"]}>
        <nav class={style["nav"]}>
          <A
            href="https://openaq.org"
            class={style["header-logo"]}
            aria-label="openaq logo"
          >
            <img src="/svgs/logo.svg" alt="openaq logo" />
          </A>
          <label class={style["menu-button-container"]} for="menu-toggle">
            <input id="menu-toggle" type="checkbox" />
            <button
              class="menu-button button-reset"
              onClick={() => {
                setOpen(!open());
              }}
            >
              <img src="/svgs/menu_ocean120.svg" alt="menu icon" />
            </button>
          </label>
          <ul class={`${style['nav-list']} ${open() ? style['nav-list--visible'] : ''}`}>
            <li>
              <a
                class={`${style["nav__item"]} ${style["nav__item--active"]} explore-data-tab`}
                href="/"
              >
                Explore the data
              </a>
            </li>
            <li>
              <A
                href="https://openaq.org/why-air-quality"
                class={`${style["nav__item"]} air-quality-tab`}
              >
                Why air quality?
              </A>
            </li>
            <li>
              <A
                href="https://openaq.org/why-open-data"
                class={`${style["nav__item"]} open-data-tab`}
              >
                Why open data?
              </A>
            </li>
            <li>
              <A
                href="https://openaq.org/partners"
                class={`${style["nav__item"]} partners-tab`}
              >
                Partners
              </A>
            </li>
            <li class={style["dropdown"]}>
              <A
                href="https://openaq.org/developers/platform-overview/"
                aria-haspopup="true"
                class={style["nav__item"]}
              >
                Developers
              </A>
              <ul class={style["submenu"]} aria-label="submenu">
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} api-overview-nav`}
                    href="https://openaq.org/developers/platform-overview/"
                  >
                    Platform Overview
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} documentation-nav js-header-docs-link`}
                    href="https://docs.openaq.org"
                  >
                    Developer Documentation
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} dev-use-case-nav`}
                    href="https://openaq.org/use-cases/developer/"
                  >
                    Developer Use Cases
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} help-nav`}
                    href="https://openaq.org/developers/help/"
                  >
                    Help
                  </A>
                </li>
              </ul>
            </li>
            <li class={style["dropdown"]}>
              <A
                href="https://openaq.org/about/"
                aria-haspopup="true"
                class={style["nav__item"]}
              >
                About
              </A>
              <ul class={style["submenu"]} aria-label="submenu">
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} about-nav`}
                    href="https://openaq.org/about/"
                  >
                    About Us
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} initiatives-nav`}
                    href="https://openaq.org/about/initiatives/"
                  >
                    Initiatives
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]}  people-nav`}
                    href="https://openaq.org/about/people/"
                  >
                    People
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={style["nav__item"]}
                    href="https://openaq.org/about/blog"
                  >
                    Blog
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} use-cases-nav`}
                    href="https://openaq.org/use-cases/"
                  >
                    Use Cases
                  </A>
                </li>
                <li class={style["submenu__item"]}>
                  <A
                    class={`${style["nav__item"]} reporting-nav`}
                    href="https://openaq.org/about/legal/"
                  >
                    Legal & Policies
                  </A>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class={style["account-nav"]}>
          {user() ? (
            ''
          ) : (
            <A href={`/register?redirect=${pageLocation.pathname}`} class="type-link-3 text-smoke-120">
              Sign up
            </A>
          )}
          {user() ? (
            ''
          ) : (
            <A href={`/login?redirect=${pageLocation.pathname}`} class="btn btn-secondary">
              Login{' '}
            </A>
          )}
          {user() ? (
            <A href="/lists" class={`type-link-3 ${style['list-link']}`}>
              <img
                width="24px"
                height="24px"
                src="/svgs/lists.svg"
                alt="lists icon"
              />{' '}
              Lists
            </A>
          ) : (
            ''
          )}
          {user() ? <Account /> : ''}

          <A
            href="https://secure.givelively.org/donate/openaq-inc/"
            class={`btn btn-primary ${style["donate-btn"]}`}
          >
            Donate
          </A>
        </div>
      </div>
    </header>
  );
}
