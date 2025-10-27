import HelpIcon from '~/assets/imgs/help.svg';
import { useStore } from '~/stores';

interface AccessHelpDefinition {
  content: string;
  title: string;
}

const svgAttributes = {
  width: 24,
  height: 24,
};

const AccessHelp = ({ content, title }: AccessHelpDefinition) => {
  const [store, { toggleShowHelpCard, setHelpContent }] = useStore();

  const showHelp = (e: Event) => {
    toggleShowHelpCard(true);
    setHelpContent(content);
    e.stopPropagation();
  };
  return (
    <button 
      class="button-reset" 
      aria-label="Help"
      onClick={(e) => showHelp(e)}
      tabindex={`${store.showHelpCard ? '-1' : '0'}`}
    >
      <HelpIcon
        {...svgAttributes}
        fill="#000000"
        class={`${title} help-icon`}
      />
    </button>
  );
};

export default AccessHelp;
