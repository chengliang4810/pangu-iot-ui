# Use the official nginx image
FROM registry.cn-hangzhou.aliyuncs.com/chengliang4810/nginx

ENV API_SERVER=http://10.0.0.34:8080/

# Copy the build output to the default nginx public folder
COPY ./dist/ /usr/share/nginx/html/
# Expose port 80
EXPOSE 80
