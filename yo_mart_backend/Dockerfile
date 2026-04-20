FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip libpq-dev $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_pgsql zip

# Install Redis extension properly
RUN pecl install redis \
    && docker-php-ext-enable redis

WORKDIR /var/www

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

CMD ["php-fpm"]
