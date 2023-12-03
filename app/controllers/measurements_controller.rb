class MeasurementsController < ApplicationController
  @@last_update = Time.zone.now

  def index
    measurements = Rails.cache.fetch('measurements', expires_in: 12.hours) do
      @@last_update = Time.zone.now
      Measurement.order(:created_at).pluck('value', 'created_at')
    end
    if params[:time_interval].present? && measurements.present?
      measurements = measurements_by_time_interval(measurements, params[:time_interval].to_i.minutes)
    end

    # get max value on last 7 days
    max = measurements.select { |m| m[1] > Time.zone.now - 1.week }.max_by(&:first)&.dig(0) || 0
    growth = ((measurements.last[0].to_f / measurements.second_to_last[0]) - 1)

    average_growth = Rails.cache.fetch('growth', expires_in: 12.hours) do
      last_measurements = measurements.select { |m| m[1] > Time.zone.now - 1.week }
      variation = 0
      (1..last_measurements.size - 1).step(2).each do |idx|
        next if (last_measurements[idx - 1][0]).zero?

        current_growth = ((last_measurements[idx][0].to_f / last_measurements[idx - 1][0]) - 1)
        variation += current_growth if current_growth > -0.1 # Ignore large negative variations
      end
      variation
    end

    # m + m*p*t*x = max
    # m(1 + p*t*x)=max
    # max/m = 1 + p*t*x
    # (max/m - 1)/p*t = x
    fill_prevision = if average_growth.negative? || max.zero?
                       'Indeterminado'
                     else
                       (((max.to_f / measurements.last[0]) - 1) /
                         (average_growth * (params[:time_interval].present? ? params[:time_interval].to_i : 5)))
                     end

    if fill_prevision.is_a?(Float)
      fill_prevision = fill_prevision > 1_440 ? "#{(fill_prevision / 1_440).round(2)} dias" : "#{(fill_prevision / 60).round(2)} horas"
    end

    render inertia: 'measurements/index', props: {
      measurements:,
      statistics: { max:, growth:, fill_prevision:, average_growth: },
      lastUpdate: @@last_update
    }
  end

  def clear_cache
    Rails.cache.clear
    redirect_to root_path
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

    filtered_measurements << [value / count.to_f, [first_measurement_time + (time_interval / 2.0), Time.zone.now].min]
    filtered_measurements
  end
end
