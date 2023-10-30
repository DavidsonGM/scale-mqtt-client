class MeasurementsController < ApplicationController
  def index
    measurements = Measurement.order(:created_at).pluck('value', 'created_at')
    render inertia: 'measurements/index', props: { measurements: }
  end
end
