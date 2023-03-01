/* eslint-disable solid/no-innerhtml */
export default function HelpPanelContent(props) {
  return <section innerHTML={props.html} class="help-panel" />;
}
