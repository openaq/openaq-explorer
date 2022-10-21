export default function BarChart({data}) {


    const [tooltipValue, setTooltipValue] = createSignal()

    const x = d3.scaleTime().range([0, props.width]);
    x.domain(d3.extent(props.data, d => new Date(d.date.local)));
   
    const y = d3.scaleLinear().range([props.height, 0]);
    y.domain([d3.min(props.data, d => d.value ), d3.max(props.data, d => d.value )]);
    

    const points = props.data.map(o => {
        return {
            value: o.value,
            cx: x(new Date(o.date.local)),
            cy: y(o.value),
            color: '#B3AAF0'
        }
    })

    createEffect(() => {
        d3.select('.x-axis').call(d3.axisBottom(x))
        d3.select('.y-axis').call(d3.axisLeft(y))
    });

    return (
        <>  
            <div>
            <div style={`position:relative; width: 110px; left:${tooltipValue()?.x - 70}px; top:${tooltipValue()?.y + 12}px; height: 40px; background: #8576EC; border-radius: 16px 16px 0px 16px;`}>{tooltipValue()?.value}</div>
            <svg width={`${props.width + props.margin}px`} height={`${props.height  + props.margin}px`}>
                <g
                transform={`translate(${props.margin} ${props.margin/2})`}>
                <For each={points}>
                    {(item) => <circle cx={item.cx} cy={item.cy} r={3} fill={item.color} onMouseEnter={(e) => setTooltipValue({x: item.cx, y: item.cy, value:item.value})}/>}
                </For>
                </g>
                <g 
                    class="y-axis"
                    transform={`translate(${props.margin/2} 0)`}
                ></g>
                <g 
                    class="x-axis"
                    transform={`translate(0 ${props.height + props.margin/2})`}
                ></g>
            </svg>
            </div>
        </>
    )
}