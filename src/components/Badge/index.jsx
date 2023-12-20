export default function Badge(props) {
  return (
    <div class={`badge ${props.type ? `badge--${props.type}` : ''}`}>
      {props.children}
    </div>
  );
}
