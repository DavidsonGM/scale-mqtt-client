FROM ruby:3.2.2-alpine as builder
ARG RAILS_ENV='production'
ARG GH_PACKAGE_TOKEN

RUN apk add --update build-base \
                     linux-headers \
                     git \
                     postgresql-dev \
                     nodejs \
                     yarn \
                     tzdata \
                     shared-mime-info \
                     bash


# Configuring main directory
WORKDIR /app

# Setting env up
ENV RAILS_ENV=$RAILS_ENV
ENV RAKE_ENV=$RAILS_ENV

COPY Gemfile* ./

RUN bundle config set without 'development test'
RUN bundle install --jobs 20 --retry 5

COPY . ./

RUN bundle exec rails assets:precompile

FROM ruby:3.2.2-alpine as production
ARG RAILS_ENV='production'

ENV RAILS_ENV=$RAILS_ENV
ENV RAKE_ENV=$RAILS_ENV

RUN apk add --update linux-headers \
                     git \
                     postgresql-dev \
                     nodejs \
                     yarn \
                     tzdata \
                     shared-mime-info

WORKDIR /app

COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY --from=builder /app/ /app/

RUN chmod +x ./start.sh

CMD ["./start.sh"]