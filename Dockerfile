FROM nginx:1.15.12

COPY nginx /etc/nginx
COPY dist /usr/share/nginx/html