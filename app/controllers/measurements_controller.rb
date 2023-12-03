class MeasurementsController < ApplicationController
  def index
    measurements = Measurement.order(:created_at).pluck('value', 'created_at')
    if params[:time_interval].present? && measurements.present?
      measurements = measurements_by_time_interval(measurements, params[:time_interval].to_i.minutes)
    end
    render inertia: 'measurements/index', props: { measurements: }
  end

  private

  def measurements_by_time_interval(measurements, time_interval)
    filtered_measurements = []
    first_measurement_time = measurements[0][1]
    value = 0
    count = 0
    (0..measurements.size - 1).each do |idx|
      current_measurement_time = measurements[idx][1]
      if current_measurement_time > first_measurement_time + time_interval
        filtered_measurements << [value / count.to_f, first_measurement_time + (time_interval / 2.0)]
        first_measurement_time = current_measurement_time
        value = measurements[idx][0]
        count = 1
      else
        value += measurements[idx][0]
        count += 1
      end
    end

    filtered_measurements
  end
end



