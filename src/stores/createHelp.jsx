import { createStore } from 'solid-js/store';

export default function createHelp(client, actions) {
  const [help, setHelp] = createStore({ active: false, content: '' });
  Object.assign(actions, {
    toggleHelp: (active) => {
      if (active != help.active) {
        setHelp({ active: active });
      }
    },
    loadContent: (key) => {
      setHelp({ content: key });
    },
  });

  return help;
}
