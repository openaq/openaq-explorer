import { AccessorWithLatest, useLocation } from '@solidjs/router';

import { createMemo, createSignal } from 'solid-js';

import { A } from '@solidjs/router';
import '~/assets/scss/components/header.scss';
import { SessionData } from '~/auth/session';
import { logout } from '~/auth/user';
import AccountIcon from '~/assets/imgs/account.svg';
import SettingsIcon from '~/assets/imgs/settings.svg';
import LogoutIcon from '~/assets/imgs/logout.svg';
import MenuIcon from '~/assets/imgs/menu.svg';
import OpenAQIcon from '~/assets/imgs/logo.svg';
import ListsIcon from '~/assets/imgs/lists.svg';

const svgHeightWidth = {
  width: 24,
  height: 24,
};

const svgColor = {
  fill: '#33a3a1',
};

function Account() {
  const [accountDropdownOpen, setAccountDropdownOpen] = createSignal(false);
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  const re = /\/lists[\/\d+]*|\/account/;
  const match = pathname().match(re);

  const toggleDropdown = (e: MouseEvent) => {
    e.preventDefault();
    setAccountDropdownOpen(!accountDropdownOpen());
  };

  return (
    <div class={`account-dropdown ${accountDropdownOpen() ? 'open' : ''}`}>
      <A href="/account" onClick={toggleDropdown}>
        <AccountIcon
          class="account-icon"
          width={28}
          height={28}
          {...svgColor}
        />
      </A>
      <ul
        class={`account-submenu ${accountDropdownOpen() ? 'show' : ''}`}
        aria-label="submenu"
      >
        <li class="submenu__item">
          <A href="/account" class={`type-body-3 text-smoke-120 settings-link`}>
            <SettingsIcon {...svgHeightWidth} {...svgColor} />
            Settings
          </A>
        </li>
        <li class="submenu__item">
          <form action={logout} method="post" class="logout-form">
            <LogoutIcon {...svgHeightWidth} {...svgColor} />
            <input
              type="hidden"
              name="redirect"
              value={match ? '/' : pathname()}
            />
            <button
              name="logout"
              type="submit"
              class="type-body-3 text-smoke-120 logout-btn"
            >
              Logout
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
}

interface Props {
  user?: AccessorWithLatest<SessionData | undefined | null>;
}

export function Header(props: Props) {
  const pageLocation = useLocation();

  const [open, setOpen] = createSignal();

  return (
    <header class="header">
      <div class="header-contents">
        <nav class="nav">
          <A
            href="https://openaq.org"
            class="header-logo"
            aria-label="openaq logo"
          >
            <OpenAQIcon height={40} width={72} />
          </A>
          <label class="menu-button-container" for="menu-toggle">
            <input id="menu-toggle" type="checkbox" />
            <button
              class="menu-button button-reset"
              onClick={() => {
                setOpen(!open());
              }}
            >
              <MenuIcon {...svgHeightWidth} {...svgColor} />
            </button>
          </label>
          <ul class={`${'nav-list'} ${open() ? 'nav-list--visible' : ''}`}>
            <li>
              <a class="nav__item nav__item--active explore-data-tab" href="/">
                Explore the data
              </a>
            </li>
            <li>
              <A
                href="https://openaq.org/why-air-quality"
                class="nav__item air-quality-tab"
              >
                Why air quality?
              </A>
            </li>
            <li>
              <A
                href="https://openaq.org/why-open-data"
                class="nav__item open-data-tab"
              >
                Why open data?
              </A>
            </li>
            <li>
              <A
                href="https://openaq.org/partners"
                class="nav__item partners-tab"
              >
                Partners
              </A>
            </li>
            <li class="dropdown">
              <A
                href="https://openaq.org/developers/platform-overview/"
                aria-haspopup="true"
                class="nav__item"
              >
                Developers
              </A>
              <ul class="submenu" aria-label="submenu">
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" api-overview-nav`}
                    href="https://openaq.org/developers/platform-overview/"
                  >
                    Platform Overview
                  </A>
                </li>
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" documentation-nav js-header-docs-link`}
                    href="https://docs.openaq.org"
                  >
                    Developer Documentation
                  </A>
                </li>
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" dev-use-case-nav`}
                    href="https://openaq.org/use-cases/developer/"
                  >
                    Developer Use Cases
                  </A>
                </li>
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" help-nav`}
                    href="https://openaq.org/developers/help/"
                  >
                    Help
                  </A>
                </li>
              </ul>
            </li>
            <li class="dropdown">
              <A
                href="https://openaq.org/about/"
                aria-haspopup="true"
                class="nav__item"
              >
                About
              </A>
              <ul class="submenu" aria-label="submenu">
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" about-nav`}
                    href="https://openaq.org/about/"
                  >
                    About Us
                  </A>
                </li>
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" initiatives-nav`}
                    href="https://openaq.org/about/initiatives/"
                  >
                    Initiatives
                  </A>
                </li>
                <li class="submenu__item">
                  <A
                    class={`$"nav__item"  people-nav`}
                    href="https://openaq.org/about/people/"
                  >
                    People
                  </A>
                </li>
                <li class="submenu__item">
                  <A class="nav__item" href="https://openaq.org/about/blog">
                    Blog
                  </A>
                </li>
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" use-cases-nav`}
                    href="https://openaq.org/use-cases/"
                  >
                    Use Cases
                  </A>
                </li>
                <li class="submenu__item">
                  <A
                    class={`$"nav__item" reporting-nav`}
                    href="https://openaq.org/about/legal/"
                  >
                    Legal & Policies
                  </A>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="account-nav">
          {props.user?.()?.usersId ? (
            ''
          ) : (
            <A
              href={`/register?redirect=${pageLocation.pathname}`}
              class="type-link-3 text-smoke-120"
            >
              Sign up
            </A>
          )}
          {props.user?.()?.usersId ? (
            ''
          ) : (
            <A
              href={`/login?redirect=${pageLocation.pathname}`}
              class="btn btn-secondary"
            >
              Login{' '}
            </A>
          )}
          {props.user?.()?.usersId ? (
            <A href="/lists" class="type-link-3 list-link">
              <ListsIcon
                {...svgHeightWidth}
                {...svgColor}
                fill="#0000ff"
                stroke="#ff0000"
                stroke-width={12}
              />
              <span>Lists</span>
            </A>
          ) : (
            ''
          )}
          {props.user?.()?.usersId ? <Account /> : ''}
          {props.user?.()?.usersId ? (
            <div class="mobile-account-actions">
              <A
                href="/account"
                class="type-body-3 text-smoke-120 settings-link"
              >
                <SettingsIcon {...svgHeightWidth} {...svgColor} />
                <span>Settings</span>
              </A>
              <form action={logout} method="post" class="logout-form">
                <LogoutIcon {...svgHeightWidth} {...svgColor} />
                <input
                  type="hidden"
                  name="redirect"
                  value={pageLocation.pathname}
                />
                <button
                  name="logout"
                  type="submit"
                  class="type-body-3 text-smoke-120 logout-btn"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            ''
          )}
          <A
            href="https://secure.givelively.org/donate/openaq-inc/"
            class={`btn btn-primary ${'donate-btn'}`}
          >
            Donate
          </A>
        </div>
      </div>
    </header>
  );
}
