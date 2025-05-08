import '~/assets/scss/components/getting-started.scss';
import WarningIcon from '~/assets/imgs/svgs/warning.svg';
import Arrow from '~/assets/imgs/arrow.svg';

export default function AirQualityGuide() {
  return (
    <>
      <main class="container">
        <h1 class="type-heading-1 text-sky-100">
          Accessing Air Quality Data in OpenAQ Explorer
        </h1>

        <section class="guide-step">
          <div class="guide-container">
            <ol class="step-list">
              <li>
                Go to{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://explore.openaq.org"
                  class="link"
                >
                  https://explore.openaq.org
                </a>
              </li>
              <li>
                On the Search panel on the upper left side, type{' '}
                <strong>[location name]</strong> and choose the location from
                the dropdown menu.
              </li>
              <li>
                If there is open air quality data at that location, you will see
                one or more purple dots. Click on a dot to see basic information
                about the air monitor or sensor on the righthand sidebar.
              </li>
              <li>
                Within the sidebar, click on <strong>“Show Details”</strong>,
                which will bring you to a page that includes{' '}
                <strong>Latest Readings</strong> and <strong>Patterns</strong>{' '}
                graphs.
              </li>
              <li>
                If you want to explore other monitoring locations elsewhere, go
                back to the map and pan out. Or start over (see #2), typing in a
                new location name.
                <ul>
                  <div class="admonition warning">
                    <div class="icon-wrapper">
                      <WarningIcon
                        class="warning-icon"
                        role="img"
                        aria-label="Warning"
                      />
                    </div>
                    <div class="content">
                      If you start over, make sure to click both{' '}
                      <strong>“Reference monitor locations”</strong> and{' '}
                      <strong>“Air sensor locations”</strong> in the sidebar.
                    </div>
                  </div>

                  <div class="admonition warning">
                    <div class="icon-wrapper">
                      <WarningIcon
                        class="warning-icon"
                        role="img"
                        aria-label="Warning"
                      />
                    </div>
                    <div class="content">
                      You can also choose{' '}
                      <strong>“Show locations with no recent updates”</strong>.
                    </div>
                  </div>
                </ul>
              </li>
              <li>
                If you want to access data about a specific pollutant across
                many locations, choose a pollutant on the sidebar and click{' '}
                <strong>“Choose data providers.”</strong> This will take you to
                a list of data providers.
              </li>
              <li>
                Either <strong>“Select All”</strong> or choose one or more data
                providers by clicking <strong>“Select None”</strong> and then
                choosing the provider(s) you are interested in. The map will
                then show you locations where data on that pollutant is being
                collected by the provider(s) you selected.
                <ul>
                  <div class="admonition warning">
                    <div class="icon-wrapper">
                      <WarningIcon
                        class="warning-icon"
                        role="img"
                        aria-label="Warning"
                      />
                    </div>
                    <div class="content">
                      You will need an <strong>Explorer account</strong> and{' '}
                      <strong>API Key</strong> (see instructions under
                      ‘Additional OpenAQ Resources’) to download data.
                    </div>
                  </div>
                </ul>
              </li>
            </ol>
            <div class="image-container">
              <img
                src="src/assets/imgs/explorer-map.png"
                alt="OpenAQ explorer map"
                width="400"
                loading="lazy"
              />
              <img
                src="src/assets/imgs/explorer-search.png"
                alt="OpenAQ explorer map search"
                loading="lazy"
                width="400"
              />
              <div class="arrow-container">
                <Arrow />
              </div>
              <img
                class="button-img"
                src="src/assets/imgs/button.png"
                alt="Button"
                loading="lazy"
                width="150"
              />
            </div>
          </div>
        </section>

        <section class="guide-step instrument-section">
          <h2 class="type-heading-1 text-sky-100">
            Understanding the Instruments
          </h2>
          <div class="instrument-wrapper">
            <div class="instruments-container">
              <div class="paragraph-dot">
                <p>
                  Reference grade monitors are represented by larger dots with
                  white circles around; they are the{' '}
                  <strong>“gold standard”</strong> for measuring pollution
                  concentrations and are typically operated by government
                  agencies and used for regulatory purposes.
                </p>
                <img
                  class="dot-border-svg"
                  src="src/assets/imgs/dot-border.png"
                  alt=""
                />
              </div>
              <div class="paragraph-dot">
                <p>
                  Air sensors are represented by smaller dots; they are less
                  sophisticated instruments, but-- because of their small size,
                  portability and affordability--are more easily deployed by
                  institutions and individuals to fill in gaps in air quality
                  knowledge.
                </p>
                <img class="dot-svg" src="src/assets/imgs/dot.png" alt="" />
              </div>
              <ul>
                <div class="admonition warning smaller">
                  <div class="icon-wrapper">
                    <WarningIcon
                      class="warning-icon"
                      role="img"
                      aria-label="Warning"
                    />
                  </div>
                  <div class="content">
                    Learn more about regulatory data & air sensor data at the
                    U.S. EPA’s Air Sensor Toolbox site (resources in English and
                    Español):{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.epa.gov/air-sensor-toolbox"
                    >
                      https://www.epa.gov/air-sensor-toolbox
                    </a>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </section>

        <section class="guide-step">
          <h2 class="type-heading-1 text-sky-100">Interpreting the Data</h2>
          <p>
            OpenAQ shares pollutant measurements as recorded by each instrument.
            These are “raw” data, in other words, not rolled into an Air Quality
            Index.
          </p>
          <p>
            Air quality standards (the concentration level at which a pollutant
            is considered safe) are set by governments, and they vary across the
            world. The World Health Organization has set guidelines that are
            more protective than any county’s standards. For example, the WHO’s
            guideline for a safe level of fine particulate matter (PM ) over a
            24-hour period is 15 µg/m (micrograms per cubic meter); whereas the
            strictest 24-hour national standard for PM2.5 is 25 µg/m .
          </p>
          <ul>
            <div class="admonition warning smaller">
              <div class="icon-wrapper">
                <WarningIcon
                  class="warning-icon"
                  role="img"
                  aria-label="Warning"
                />
              </div>
              <div class="content">
                Check out{' '}
                <strong>
                  WHO national air quality standards interactive tool
                </strong>{' '}
                for national air quality standards across the world:{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://worldhealthorg.shinyapps.io/AirQualityStandards"
                >
                  https://worldhealthorg.shinyapps.io/AirQualityStandards
                </a>
              </div>
            </div>

            <div class="admonition warning smaller">
              <div class="icon-wrapper">
                <WarningIcon
                  class="warning-icon"
                  role="img"
                  aria-label="Warning"
                />
              </div>
              <div class="content">
                Learn more about{' '}
                <strong>WHO’s global air quality guidelines</strong>:{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.who.int/publications/i/item/9789240034228"
                >
                  https://www.who.int/publications/i/item/9789240034228
                </a>
              </div>
            </div>
          </ul>
          <p>
            The <strong>“Latest Readings”</strong> graph tells you how
            measurements have changed over time.
          </p>
          <p>
            The <strong>“Patterns”</strong> graph tells you the diurnal (daily)
            trends for your chosen pollutant. Hover your cursor over a single
            vertical bar for a detailed statistical summary.
          </p>
        </section>

        <section class="guide-step">
          <h2 class="type-heading-1 text-sky-100">
            Additional OpenAQ Resources
          </h2>
          <p>
            To create lists of your favorite locations in OpenAQ Explorer,{' '}
            <strong>sign up for a user account</strong>. See the link under{' '}
            <strong>“Lists”</strong> on the opened sidebar, or register here:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://explore.openaq.org/register"
            >
              https://explore.openaq.org/register
            </a>
          </p>
          <p>
            To download larger volumes of data, use our API. See OpenAQ API
            Docs:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.openaq.org"
            >
              https://docs.openaq.org
            </a>
          </p>
          <p>
            To understand Air Quality Indexes across the world, visit OpenAQ’s
            AQI Hub:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://aqihub.info"
            >
              https://aqihub.info
            </a>
          </p>
          <p>
            Find out more about OpenAQ’s mission, initiatives and impact on our
            homepage:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://openaq.org"
            >
              https://openaq.org
            </a>
          </p>
        </section>
      </main>
    </>
  );
}
