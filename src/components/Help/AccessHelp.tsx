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
    <HelpIcon
      {...svgAttributes}
      fill="#000000"
      class={`${title} help-icon`}
      onClick={(e) => showHelp(e)}
    />
  );
};

export default AccessHelp;
