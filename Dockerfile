# Travel Journey Planner - Backend Dockerfile for Render
FROM php:8.2-apache

# Install PDO MySQL and required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Enable Apache rewrite and headers modules
RUN a2enmod rewrite headers

# Working directory
WORKDIR /var/www/html

# Copy backend files to Apache DocumentRoot
COPY backend/ /var/www/html/

# Create /backend alias so both /destinations.php and /backend/destinations.php work seamlessly
RUN ln -s /var/www/html /var/www/html/backend

# Copy image assets so static images are also served by the backend if requested
COPY frontend/public/images/ /var/www/html/images/

# Configure ServerName to suppress Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Add dynamic PORT entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Default port for Render
EXPOSE 10000

ENTRYPOINT ["docker-entrypoint.sh"]
