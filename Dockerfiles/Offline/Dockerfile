FROM node:12.16-stretch

ENV REACT_APP_ENV: offline

# install nginx
RUN apt-get -y update && \
apt-get -q -y upgrade && \
apt-get install -y nginx && \
rm -rf /var/lib/apt/lists/* && \
mkdir -p /var/log/app_engine

COPY ./Dockerfiles/Offline/nginx.conf /etc/nginx/nginx.conf

# Finally, all static assets.
RUN rm -rf /home/sourcecode && \
mkdir /home/sourcecode

COPY . /home/sourcecode

EXPOSE 8080 2222
ENTRYPOINT ["sh", "/home/sourcecode/Dockerfiles/Offline/start.sh"]

