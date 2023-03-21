# 使用官方的nginx镜像
FROM registry.cn-hangzhou.aliyuncs.com/chengliang4810/nginx
# 设置环境变量
ENV API_SERVER=http://10.0.0.34:8080/
# 复制资源到镜像
COPY ./dist/ /usr/share/nginx/html/
# Expose port 80
EXPOSE 80
