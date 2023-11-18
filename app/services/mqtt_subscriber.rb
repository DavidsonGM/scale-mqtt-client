require 'mqtt'

class MqttSubscriber
  def run
    Thread.new do
      Thread.handle_interrupt(Timeout::Error => :never) do
        MQTT::Client.connect('test.mosquitto.org') do |c|
          c.get('DGM/scale') do |_topic, message|
            Measurement.create!(value: message.gsub(/.*?:/im, '').strip)
          rescue StandardError => e
            puts e
          end
        end
      end
    end
  end
end
