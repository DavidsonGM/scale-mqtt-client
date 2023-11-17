class ApplicationController < ActionController::Base
  def ping
    render json: { success: true }, status: :ok
  end
end
