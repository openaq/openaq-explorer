import { createStore } from 'solid-js/store';

export default function createMapThreshold(
  client,
  actions,
  state,
  setState
) {
  const [thresholdValues, setThresholdValues] = createStore({
    active: false,
    parameter_id: 2,
    threshold: 5,
    period: 1,
  });
  Object.assign(actions, {
    setMapThreshold: (value) => {
      setThresholdValues({
        active: value.active,
        parameter_id: value.parameter_id,
        threshold: value.threshold,
        period: value.period,
      });
    },
    setMapThresholdActive: (value) => {
      setThresholdValues({ active: value });
    },
    setThresholdsParameter: (value) => {
      setThresholdValues({ parameter_id: value });
    },
    setThresholdsAction: (value) => {
      setThresholdValues({ active: value });
    },
    setThresholdsPeriod: (value) => {
      setThresholdValues({ period: value });
    },
  });

  return thresholdValues;
}
