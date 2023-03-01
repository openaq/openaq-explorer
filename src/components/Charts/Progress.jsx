export default function Progress(props) {
  return (
    <>
      <svg
        width={`${
          props.width + props.margin.right + props.margin.left
        }px`}
        height={`${
          props.height + props.margin.top + props.margin.bottom
        }px`}
      >
        <defs>
          <linearGradient id="gradient">
            <stop offset="-40%" stop-color="#198CFF" />
            <stop offset="85%" stop-color="#004080" />
          </linearGradient>
        </defs>
        <rect
          height={props.height}
          width={`${props.width}px`}
          x="10"
          rx={props.height / 2}
          ry={props.height / 2}
          fill="#CCE5FF"
        />
        <rect
          height={props.height}
          width={`${props.percent * props.width}px`}
          x={`${props.margin.left}`}
          rx={props.height / 2}
          ry={props.height / 2}
          fill="url(#gradient)"
        />
        <rect
          height={props.height}
          width="10px"
          x={`${
            props.percent * props.width - props.margin.left + 12
          }`}
          fill="#004080"
        />
        {props.legend ? (
          <>
            <text x="10" y="40">
              0%
            </text>
            <text x={props.width - 20} y="40">
              100%
            </text>
          </>
        ) : (
          ''
        )}
      </svg>
    </>
  );
}
