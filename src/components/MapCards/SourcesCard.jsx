import { For } from 'solid-js';
import { createSignal } from 'solid-js';

export default function SourcesCard() {
  const [sources, setSources] = createSignal([
    { name: 'PurpleAir', id: 42 },
  ]);

  return (
    <article className="dismissable-card map-card dismissable-card--translate">
      <header className="map-card__header">
        <div style="display:flex;">
          <button className="close-btn" onClick={() => ''}>
            <span class="material-symbols-outlined white">
              arrow_back
            </span>
          </button>
          <h3 className="map-card-title">Data Sources</h3>
        </div>
      </header>
      <div className="map-card__body">
        <section className="map-card-section">
          <span>Show all {sources().length} data sources</span>
          <input
            type="checkbox"
            name="show-all-data-sources"
            id="show-all-data-source"
            checked
          />
        </section>
        <section className="map-card-section">
          <div className="search-input-wrapper">
            <input type="text" className="search-input" />
            <span class="material-symbols-outlined search-icon">
              search
            </span>
          </div>

          <ul className="sources-list">
            <For each={sources()}>
              {(source, i) => (
                <li className="sources-list__item">
                  <span>{source.name}</span>
                  <input
                    type="checkbox"
                    name={`source-${source.id}`}
                    id={`source-${source.id}`}
                    checked
                  />
                </li>
              )}
            </For>
          </ul>
        </section>
        <section className="map-card-section">
          <button className="btn btn-primary">Update</button>
        </section>
      </div>
    </article>
  );
}
