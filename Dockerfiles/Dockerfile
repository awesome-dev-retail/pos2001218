FROM debian:stable-slim

RUN apt-get -y update && \
apt-get -q -y upgrade && \
apt-get install -y openssh-server && \
apt-get install -y nginx && \
mkdir -p /var/log/app_engine && \
rm -rf /var/lib/apt/lists/*

# Copy sshd config
COPY ./Dockerfiles/sshd_config /etc/ssh/

# Copy Nginx config
COPY ./Dockerfiles/nginx.conf /etc/nginx/nginx.conf

# Copy all static assets.
COPY ./build /usr/share/nginx/www/
COPY ./Dockerfiles/start.sh /home/start.sh

# Copy all static assets.
RUN rm -rf /home/sourcecode && \
mkdir /home/sourcecode && \
echo "STARTING COPY SOURCECODE..."

RUN chmod -R a+r /usr/share/nginx/www && \
echo "STARTING SET TIME ZOOM..."


# Change time zone
ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
echo $TZ > /etc/timezone && \
echo "FINISHED BUILDING IMAGE..."

EXPOSE 8080 2222
ENTRYPOINT ["sh", "/home/start.sh"]


