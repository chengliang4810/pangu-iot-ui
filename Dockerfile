# Use the official nginx image
FROM nginx
# Copy the nginx config file to the default nginx config folder
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
# Copy the build output to the default nginx public folder
COPY ./dist/ /usr/share/nginx/html/
# Expose port 80
EXPOSE 80
