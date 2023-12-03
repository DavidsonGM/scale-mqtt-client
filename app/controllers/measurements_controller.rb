class MeasurementsController < ApplicationController
  @@last_update = Time.zone.now

  def index
    @measurements = Rails.cache.fetch('measurements', expires_in: 12.hours) do
      @@last_update = Time.zone.now
      Measurement.order(:created_at).pluck('value', 'created_at')
    end
    if params[:time_interval].present? && @measurements.present?
      @measurements = measurements_by_time_interval(time_interval.minutes)
    end

    render inertia: 'measurements/index', props: {
      measurements: @measurements,
      statistics: { max:, growth:, fill_prevision:, average_growth: },
      lastUpdate: @@last_update
    }
  end

  def clear_cache
    Rails.cache.clear
    redirect_to root_path(time_interval: params[:time_interval])
  end

  private

  def time_interval
    params[:time_interval].present? ? params[:time_interval].to_i : 5
  end

  def measurements_by_time_interval(time_interval)
    filtered_measurements = []
    first_measurement_time = @measurements[0][1]
    value = 0
    count = 0
    (0..@measurements.size - 1).each do |idx|
      current_measurement_time = @measurements[idx][1]
      if current_measurement_time > first_measurement_time + time_interval
        filtered_measurements << [value / count.to_f, first_measurement_time + (time_interval / 2.0)]
        first_measurement_time = current_measurement_time
        value = @measurements[idx][0]
        count = 1
      else
        value += @measurements[idx][0]
        count += 1
      end
    end

    filtered_measurements << [value / count.to_f, [first_measurement_time + (time_interval / 2.0), Time.zone.now].min]
    filtered_measurements
  end

  def max
    @measurements.select { |m| m[1] > Time.zone.now - 1.week }.max_by(&:first)&.dig(0) || 0
  end

  def growth
    ((@measurements.last[0].to_f / @measurements.second_to_last[0]) - 1)
  end

  def average_growth
    last_measurements = @measurements.select { |m| m[1] > Time.zone.now - 1.week }
    variation = 0
    (1..last_measurements.size - 1).each do |idx|
      current_growth = last_measurements[idx][0] - last_measurements[idx - 1][0]
      variation += current_growth if current_growth > -1_000 # Ignore large negative variations (> 1kg)
    end
    variation /= last_measurements.size - 1

    variation * 60.0 / time_interval # Always get variation by hour
  end

  def fill_prevision
    # medida + crescimento_hora * n = max
    # n = (max - m)/crescimento_hora
    fill_prevision = if average_growth.negative? || max.zero?
                       'Indeterminado'
                     else
                       (max - @measurements.last[0]) / average_growth
                     end

    if fill_prevision.is_a?(Float)
      fill_prevision = if fill_prevision < 24
                         "#{fill_prevision.round(2)} horas"
                       else
                         "#{(fill_prevision / 24).round(2)} dias"
                       end
    end

    fill_prevision
  end
end
