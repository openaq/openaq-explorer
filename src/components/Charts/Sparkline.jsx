import * as d3 from 'd3';

function transform(data) {
    return data.map(o => {
        return {
            value: parseFloat(o.value),
            date: d3.isoParse(o.date.local),
        }
    })
}

export default function Sparkline({series, width, height, margin, style = {fill:"none", strokeColor:"black"}}) {
    const data = transform(series);
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    x.domain(d3.extent(data, d => d.date ));
    y.domain([d3.min(data, d => d.value ), d3.max(data, d => d.value )]);

    const generateLine = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

    return (
        <svg width={`${width + margin.left + margin.right}px`} height={`${height + margin.top + margin.bottom}px`}>
        <g
        transform={`translate(${margin.left} ${margin.top})`}>
        <path style={`fill:${style.fill}; stroke:${style.strokeColor}; stroke-width:${style.stokeWidth}`} d={generateLine(data)} />
        </g>
    </svg>
    )
}