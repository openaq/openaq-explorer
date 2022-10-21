
export default function Progress({width, height, margin, percent, legend, style}) {
    return(
        <>
            <svg width={`${width + margin.right + margin.left}px`} height={`${height + margin.top + margin.bottom}px`} >
                <defs>
                    <linearGradient id="gradient">
                    <stop offset="-40%" stop-color="#198CFF" />
                    <stop offset="85%" stop-color="#004080" />
                    </linearGradient>
                </defs>
                <rect height={height} width={`${width}px`} x="10"  rx={height / 2} ry={height / 2} fill="#CCE5FF"/>
                <rect height={height} width={`${percent * width}px`} x={`${margin.left}`} rx={height / 2} ry={height / 2} fill="url(#gradient)" />
                <rect height={height} width='10px' x={`${percent * width - margin.left + 12}`} fill="#004080"/>
                {legend ? <><text x="10" y="40" >0%</text><text x={width - 20} y="40" >100%</text></> : ""}
                
            </svg>
        </>
    ) 
}