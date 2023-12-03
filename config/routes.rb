Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root 'measurements#index'
  get "ping", to: "application#ping"
  delete 'clear_cache', to: "measurements#clear_cache"
end
