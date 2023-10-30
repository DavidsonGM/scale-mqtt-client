class MeasurementsController < ApplicationController
  def index
    p Measurement.count
    measurements = Measurement.order(:created_at).pluck('value', 'created_at')
    p measurements
    render inertia: 'measurements/index', props: { measurements: }
  end
end
