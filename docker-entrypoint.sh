#!/bin/sh
set -e

PORT="${PORT:-10000}"
echo "Configuring Apache to listen on port $PORT..."

# Replace any existing Listen port with the dynamic Render port
sed -i "s/Listen [0-9]*/Listen $PORT/" /etc/apache2/ports.conf

# Replace VirtualHost port in default site configuration
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost \*:$PORT>/" /etc/apache2/sites-available/000-default.conf

echo "Starting Apache..."
exec apache2-foreground
