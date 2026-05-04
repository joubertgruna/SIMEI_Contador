# Use nginx alpine for smaller image size
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.dev.conf /etc/nginx/nginx.conf

# Verify copy worked
RUN ls -la /etc/nginx/nginx.conf && wc -l /etc/nginx/nginx.conf

# Copy static files (will be mounted in production)
# COPY --from=frontend /app/build /usr/share/nginx/html

# Create log directory
RUN mkdir -p /var/log/nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]