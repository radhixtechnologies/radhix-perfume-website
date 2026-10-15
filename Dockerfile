FROM php:8.2-apache

# Install PDO MySQL extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache Rewrite & Headers
RUN a2enmod rewrite headers

# Copy backend files to Apache web root
COPY backend/ /var/www/html/

# Apache Directory Configuration
RUN echo '<Directory /var/www/html/>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/bossnbuzz.conf \
    && a2enconf bossnbuzz

# Create and set permissions for uploads directory
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 775 /var/www/html/uploads

EXPOSE 80
CMD ["apache2-foreground"]
