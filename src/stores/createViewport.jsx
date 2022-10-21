export default function createViewport(
  client,
  actions,
  state,
  setState
) {
  //const [zoom, setZoom] = createSignal(2);
  //const [center, setCenter] = createSignal([0,20]);
  Object.assign(actions, {
    setViewport: (viewport) => setState({ viewport }),
    //setZoom: (zoom) => setState({ zoom }),
    //setCenter: (center) => setState({ center })
  });

  //return overlay;
}
