export function ReferenceGradeMarker() {
  return (
    <div className="reference-grade-marker">
      <div className="reference-grade-marker__border"></div>
      <div className="reference-grade-marker__fill"></div>
    </div>
  );
}

export function LowCostSensorMarker() {
  return (
    <div className="low-cost-sensor-marker">
      <div className="low-cost-sensor-marker__fill"></div>
    </div>
  );
}

export function NoRecentUpdateMarker() {
  return (
    <div className="no-recent-data-marker">
      <div className="no-recent-data-marker__border"></div>
      <div className="no-recent-data-marker__fill"></div>
      <div className="no-recent-data-marker__dot"></div>
    </div>
  );
}

export function PoorCoverageMarker() {
  return (
    <div className="poor-coverage-marker">
      <div className="poor-coverage-marker__border"></div>
      <div className="poor-coverage-marker__fill"></div>
      <div className="poor-coverage-marker__dot"></div>
    </div>
  );
}
