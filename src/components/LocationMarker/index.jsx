import '~/assets/scss/components/location-marker.scss';

export function ReferenceGradeMarker() {
  return (
    <div class="reference-grade-marker">
      <div class="reference-grade-marker__border" />
      <div class="reference-grade-marker__fill" />
    </div>
  );
}

export function LowCostSensorMarker() {
  return (
    <div class="low-cost-sensor-marker">
      <div class="low-cost-sensor-marker__fill" />
    </div>
  );
}

export function NoRecentUpdateMarker() {
  return (
    <div class="no-recent-data-marker">
      <div class="no-recent-data-marker__border" />
      <div class="no-recent-data-marker__fill" />
      <div class="no-recent-data-marker__dot" />
    </div>
  );
}

export function PoorCoverageMarker() {
  return (
    <div class="poor-coverage-marker">
      <div class="poor-coverage-marker__border" />
      <div class="poor-coverage-marker__fill" />
      <div class="poor-coverage-marker__dot" />
    </div>
  );
}
