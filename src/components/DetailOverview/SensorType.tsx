import {
  LowCostSensorMarker,
  ReferenceGradeMarker,
} from '~/components/LocationMarker';
import { SensorTypeDefintion } from './types';

export function SensorType(props: SensorTypeDefintion) {
  return (
    <div class="location-type">
      <span class="type-body-3">
        {props.isMonitor ? 'Reference grade' : 'Air sensor'}
      </span>
      {props.isMonitor ? <ReferenceGradeMarker /> : <LowCostSensorMarker />}
    </div>
  );
}
