import ExpandableCard from "./ExpandableCard"


export default function FilterCard() {
    return(
        <ExpandableCard
            title={"Filter"}
            open={true}
        >
            <div style="margin: 16px 15px;">
                <div
                    style="width: 250px; display:grid; grid-template-columns: 1fr 4fr 1fr; grid-auto-rows: 1fr; row-gap: 8px; margin-bottom:12px;"
                >
                    <div style="background: #6A5CD8; height: 20px; width:20px; border-radius: 50%; margin:5px;"></div><label htmlFor="reference-grade">Reference grade locations</label>
                    <div><input type="checkbox" name="reference-grade" id="reference-grade" checked/></div> 
                    <div style="background: #6A5CD8; height: 12px; width:12px; border-radius: 50%; margin:5px;"></div>
                    <label htmlFor="low-cost-sensor"> Low-cost sensors locations</label>
                    <div><input type="checkbox" name="low-cost-sensor" id="low-cost-sensor" checked /></div> 
                    <div style="background: grey; height: 20px; width:20px; border-radius: 50%; margin:5px;"></div>
                    <label htmlFor="no-recent-updates">Show locations with no recent updates</label>
                    <div><input type="checkbox" name="no-recent-updates" id="no-recent-updates" checked /></div> 
                    <div style="background: #6A5CD8; height: 20px; width:20px; border-radius: 50%; margin:5px;"></div>
                    <label htmlFor="poor-data-coverage">Show locations with Poor data coverage</label>
                    <div> <input type="checkbox" name="poor-data-coverage" id="poor-data-coverage" checked/></div>
                   
                </div>
                <select name="" id="" className="select" onChange={(e) => loadOverlay(e.target.value)} >
                        <option value="1" selected>Show all data sources</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                        <option value="2">Clarity</option>
                        <option value="3">PurpleAir</option>
                </select>
                </div>

        </ExpandableCard>
    )
}