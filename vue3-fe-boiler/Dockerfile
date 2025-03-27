FROM node:14.17.2 as builder
ENV APP_ROOT /src
RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}
# RUN rm -rf node_modules package-lock.json
# RUN npm cache clean --force
RUN npm install
RUN npm run build
ENV HOST 0.0.0.0
EXPOSE 14442

FROM nginx:alpine as production-build
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder src/dist /usr/share/nginx/html

EXPOSE 9998
ENTRYPOINT ["nginx", "-g", "daemon off;"]