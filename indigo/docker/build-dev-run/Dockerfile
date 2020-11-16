# Dockerfile
FROM php:7.4-apache

ENV COMPOSER_ALLOW_SUPERUSER=1

EXPOSE 80
WORKDIR /app

RUN apt-get update

# PHP Extensions
#Install pdo_mysql
RUN docker-php-ext-install -j$(nproc) pdo_mysql
#Install MongoDB
RUN apt-get install -y libicu-dev \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb
#Install opcache pdo pdo pgsql_pgsql
RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install opcache pdo pdo_pgsql pgsql
#Install phpredis
RUN mkdir -p /usr/src/php/ext/redis \ 
    && curl -fsSL https://github.com/phpredis/phpredis/archive/5.3.2.tar.gz | tar xvz -C /usr/src/php/ext/redis --strip 1 \
    && docker-php-ext-install redis \
    ## cleanup
    && docker-php-source delete
COPY php.ini /usr/local/etc/php/conf.d/app.ini
#Install memcache
RUN apt-get install -y libmemcached-dev zlib1g-dev \
    && mkdir -p /usr/src/php/ext/memcached \ 
    && curl -fsSL https://github.com/php-memcached-dev/php-memcached/archive/v3.1.5.tar.gz | tar xvz -C /usr/src/php/ext/memcached --strip 1 \
    && docker-php-ext-install memcached \
    ## cleanup
    && docker-php-source delete

# Apache
COPY vhost.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite