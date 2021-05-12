FROM node:12.16-stretch

# install ssh
RUN apt-get -y update && \
apt-get -q -y upgrade && \
apt-get install -y openssh-server && \
rm -rf /var/lib/apt/lists/*

RUN echo "root:Docker!" | chpasswd

COPY ./Dockerfiles/sshd_config /etc/ssh/

# install nginx
RUN apt-get -y update && \
apt-get -q -y upgrade && \
apt-get install -y nginx && \
rm -rf /var/lib/apt/lists/* && \
mkdir -p /var/log/app_engine

COPY ./Dockerfiles/Test/nginx.conf /etc/nginx/nginx.conf

# Finally, all static assets.
RUN rm -rf /home/sourcecode && \
mkdir /home/sourcecode && \
echo "STARTING COPY SOURCECODE..."

COPY . /home/sourcecode

ENV REACT_APP_BE_URL "pos-topcatch-test-be.azurewebsites.net"

RUN cd /home/sourcecode && \
echo "NODE VERSION: " && \
node -v && \
echo "NPM VERSION: " && \
npm -v && \
echo "STARTING NPM INSTALL..." && \
npm install && \
echo "STARTING NPM RUN BUILD..." && \
npm run build && \
echo "STARTING COPY FILES..." && \
cp -r /home/sourcecode/build/ /usr/share/nginx/www/ && \
cp -r /home/sourcecode/Dockerfiles/start.sh /home/start.sh && \
echo "STARTING RM /SOURCECODE..." && \
chmod -R a+r /usr/share/nginx/www && \
rm -rf /home/sourcecode && \
echo "STARTING SET TIME ZOOM..."


# change time zone
ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
echo $TZ > /etc/timezone && \
echo "FINISHED BUILDING IMAGE..."


EXPOSE 8080 2222
ENTRYPOINT ["sh", "/home/start.sh"]

