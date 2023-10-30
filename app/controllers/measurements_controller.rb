class MeasurementsController < ApplicationController
  def index
    render inertia: 'measurements/index', props: { measurements: Measurement.pluck("value", "created_at") }
  end
end
