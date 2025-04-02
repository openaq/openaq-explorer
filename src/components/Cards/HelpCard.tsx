import { useStore } from '~/stores';
import RightArrowIcon from '~/assets/imgs/arrow_right.svg';
import CloseIcon from '~/assets/imgs/close.svg';
import '~/assets/scss/components/help-card.scss';

interface HelpCardDefinition {
  title: string;
  content: string;
}

const HelpCard = (props: HelpCardDefinition) => {
  const [store, { toggleShowHelpCard }] = useStore();

  return (
    <>
      <article
        class={`help-card ${store.showHelpCard ? 'help-card--translate' : ''}`}
      >
        <header class="help-card__header">
          <h3 class="type-subtitle-1">{props.title}</h3>
          <button class="close-btn" onClick={() => toggleShowHelpCard(false)}>
            <CloseIcon fill="#FFFFFF" />
          </button>
        </header>
        <section class="help-card__body help-items">
          <div class="help-content">
            <div class="help-content-container">
              <section class="help-items" innerHTML={props.content}></section>
            </div>
          </div>
        </section>
        <footer class="help-card__footer">
          <a
            class="btn btn-primary icon-btn help-card-btn"
            href="https://openaq.org/developers/help/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>More Help</span>
            <RightArrowIcon fill="#FFFFFF" width={20} height={20} />
          </a>
        </footer>
      </article>
    </>
  );
};

export default HelpCard;
