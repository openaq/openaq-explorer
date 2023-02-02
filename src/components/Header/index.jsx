import imgSvg from '../../assets/logo.svg';

export default function Header() {
  return (
    <header class="header">
      <div class="header-contents">
        <a href="/" class="header-logo" aria-label="openaq logo">
          <img src={imgSvg} alt="openaq logo" />
        </a>
        <div class="spacer"></div>
        <nav class="nav">
          <input id="menu-toggle" type="checkbox" />
          <label class="menu-button-container" for="menu-toggle">
            <div class="menu-button">
              <span class="material-symbols-outlined">menu</span>
            </div>
          </label>
          <ul class="nav-list">
            <li>
              <a
                class="nav__item nav__item--active explore-data-tab"
                href="https://explore.openaq.org"
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
        <a
          href="https://secure.givelively.org/donate/openaq-inc/"
          class="btn btn-primary donate-btn js-header-donate-btn"
        >
          Donate
        </a>
      </div>
    </header>
  );
}
