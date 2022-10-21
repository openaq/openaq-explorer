

export default function Badge(props) {

    const badgeType = props.type;

    return(
        <div className={`badge ${badgeType ? `badge--${badgeType}` : ""}`}>
            {props.children}
        </div>
    ) 
}