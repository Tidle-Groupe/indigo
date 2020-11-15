# Dockerfile
FROM php:7.4-apache

ENV COMPOSER_ALLOW_SUPERUSER=1

EXPOSE 80
WORKDIR /app

# PHP Extensions
RUN docker-php-ext-install -j$(nproc) opcache pdo_mysql
RUN mkdir -p /usr/src/php/ext/redis \ 
    && curl -fsSL https://github.com/phpredis/phpredis/archive/5.3.2.tar.gz | tar xvz -C /usr/src/php/ext/redis --strip 1 \
    && docker-php-ext-install redis \
    ## cleanup
    && docker-php-source delete
COPY php.ini /usr/local/etc/php/conf.d/app.ini

# Apache
COPY vhost.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite