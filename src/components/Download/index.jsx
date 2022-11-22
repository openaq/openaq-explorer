export default function DownloadCard() {
  return (
    <div style="position:relative;">
      <div
        className="bubble-lg"
        style="position:absolute; z-index:-1; bottom:-60px; left: -120px"
      ></div>
      <div
        className="bubble-sm"
        style="position:absolute; bottom:-139px; left: 60px"
      ></div>
      <article className="detail-card" id="download-card">
        <section className="detail-card__section">
          <div style="display:flex; justify-content: space-between;">
            <div style="display:flex; align-items: center; margin: 24px 0; gap:12px;">
              <h3 className="type-heading-1 text-sky-120">
                Download & API
              </h3>
              <span class="material-symbols-outlined green">
                help
              </span>
            </div>
          </div>
        </section>
        <section>
          <h3 className="type-subtitle-1 text-sky-120">
            Download Data (CSV)
          </h3>
        </section>
        <section>
          <h3 className="type-subtitle-1 text-sky-120">API</h3>
          <h5 className="type-subtitle-3">What is the OpenAQ API?</h5>
        </section>
      </article>
    </div>
  );
}
