class MeasurementsController < ApplicationController
  def index
    measurements = Measurement.order(:created_at).pluck('value', 'created_at')
    if params[:time_interval].present? && measurements.present?
      measurements = measurements_by_time_interval(measurements, params[:time_interval].to_i.minutes)
    end

    # get max value on last 7 days
    max = measurements.select { |m| m[1] > Time.zone.now - 1.week }.max_by(&:first)&.dig(0) || 0
    growth = ((measurements.last[0].to_f / measurements.second_to_last[0]) - 1)

    # m + m*p*t*x = max
    # m(1 + p*t*x)=max
    # max/m = 1 + p*t*x
    # (max/m - 1)/p*t = x
    fill_prevision = if growth.negative? || max.zero?
                       'Indeterminado'
                     else
                       (((max.to_f / measurements.last[0]) - 1) / (growth * (params[:time_interval].to_i || 5.minutes)))
                     end

    if fill_prevision.is_a?(Float)
      fill_prevision = fill_prevision > 1_440 ? "#{fill_prevision / 1_440} dias" : "#{fill_prevision / 60} horas"
    end

    render inertia: 'measurements/index', props: { measurements:, statistics: { max:, growth:, fill_prevision: } }
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

    filtered_measurements << [value / count.to_f, first_measurement_time + (time_interval / 2.0)]
    filtered_measurements
  end
end



