import { createServerData$ } from 'solid-start/server';
import { logout, getUser, createServerAction$ } from '~/db/session';

import listsSvg from '~/assets/imgs/lists.svg';
import imgSvg from '~/assets/imgs/logo.svg';
import accountSvg from '~/assets/imgs/account.svg';
import settingsSvg from '~/assets/imgs/settings.svg';
import logoutSvg from '~/assets/imgs/logout.svg';

import { createSignal } from 'solid-js';

function Account() {
  const [, { Form }] = createServerAction$((formData, { request }) =>
    logout(request)
  );

  return (
    <div class="dropdown">
      <a href="/account">
        <img
          width="24px"
          height="24px"
          src={accountSvg}
          alt="account icon"
        />
      </a>
      <ul class="submenu" aria-label="submenu">
        <li class="submenu__item">
          <a href="/account">
            <img
              width="24px"
              height="24px"
              src={settingsSvg}
              alt="settings icon"
            />
            Settings
          </a>
        </li>
        <li class="submenu__item">
          <Form>
            <img src={logoutSvg} alt="logout icon" />
            <button name="logout" type="submit">
              Logout
            </button>
          </Form>
        </li>
      </ul>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = createSignal();

  const user = createServerData$(async (_, { request }) => {
    const user = await getUser(request);
    return user;
  });

  return (
    <header class="header">
      <div class="header-contents">
        <nav class="nav">
          <a
            href="https://openaq.org"
            class="header-logo"
            aria-label="openaq logo"
          >
            <img src={imgSvg} alt="openaq logo" />
          </a>
          <label class="menu-button-container" for="menu-toggle">
            <input id="menu-toggle" type="checkbox" />
            <button
              class="menu-button button-reset"
              onClick={() => {
                setOpen(!open());
              }}
            >
              <span class="material-symbols-outlined">menu</span>
            </button>
          </label>
          <ul class={`nav-list ${open() ? 'nav-list--visible' : ''}`}>
            <li>
              <a
                class="nav__item nav__item--active explore-data-tab"
                href="/"
              >
                Explore the data (Beta)
              </a>
            </li>
            <li>
              <a
                href="https://openaq.org/why-air-quality"
                class="nav__item air-quality-tab"
              >
                Why air quality?
              </a>
            </li>
            <li>
              <a
                href="https://openaq.org/why-open-data"
                class="nav__item open-data-tab"
              >
                Why open data?
              </a>
            </li>
            <li>
              <a
                href="https://openaq.org/partners"
                class="nav__item partners-tab"
              >
                Partners
              </a>
            </li>
            <li class="dropdown">
              <a
                href="https://openaq.org/developers/platform-overview/"
                aria-haspopup="true"
                class="nav__item"
              >
                Developers
              </a>
              <ul class="submenu" aria-label="submenu">
                <li class="submenu__item">
                  <a
                    class="nav__item api-overview-nav"
                    href="https://openaq.org/developers/platform-overview/"
                  >
                    Platform Overview
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item documentation-nav js-header-docs-link"
                    href="https://docs.openaq.org"
                  >
                    Developer Documentation
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item dev-use-case-nav"
                    href="https://openaq.org/use-cases/developer/"
                  >
                    Developer Use Cases
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item help-nav"
                    href="https://openaq.org/developers/help/"
                  >
                    Help
                  </a>
                </li>
              </ul>
            </li>
            <li class="dropdown">
              <a
                href="https://openaq.org/about/"
                aria-haspopup="true"
                class="nav__item"
              >
                About
              </a>
              <ul class="submenu" aria-label="submenu">
                <li class="submenu__item">
                  <a
                    class="nav__item about-nav"
                    href="https://openaq.org/about/"
                  >
                    About Us
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item initiatives-nav"
                    href="https://openaq.org/about/initiatives/"
                  >
                    Initiatives
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item people-nav"
                    href="https://openaq.org/about/people/"
                  >
                    People
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item"
                    href="https://openaq.org/about/blog"
                  >
                    Blog
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item use-cases-nav"
                    href="https://openaq.org/use-cases/"
                  >
                    Use Cases
                  </a>
                </li>
                <li class="submenu__item">
                  <a
                    class="nav__item reporting-nav"
                    href="https://openaq.org/about/legal/"
                  >
                    Legal & Policies
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="account-nav">
          {user() ? (
            ''
          ) : (
            <a href="/register" class="type-link-3 text-smoke-120">
              Sign up
            </a>
          )}
          {user() ? (
            ''
          ) : (
            <a href="/login" class="btn btn-secondary">
              Login{' '}
            </a>
          )}
          {user() ? (
            <a href="/lists" class="type-link-3">
              <img
                width="24px"
                height="24px"
                src={listsSvg}
                alt="account icon"
              />{' '}
              Lists
            </a>
          ) : (
            ''
          )}
          {user() ? <Account /> : ''}

          <a
            href="https://secure.givelively.org/donate/openaq-inc/"
            class="btn btn-primary donate-btn js-header-donate-btn"
          >
            Donate
          </a>
        </div>
      </div>
    </header>
  );
}
