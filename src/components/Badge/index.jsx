export default function Badge(props) {
  const badgeType = props.type;

  return (
    <div class={`badge ${badgeType ? `badge--${badgeType}` : ''}`}>
      {props.children}
    </div>
  );
}
