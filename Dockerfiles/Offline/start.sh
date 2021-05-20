# /bin/bash
# step 1. build static files from source code
cd /home/sourcecode
echo 'STARTING NPM INSTALL...'
npm install
echo 'STARTING NPM BUILD...'
npm run build
echo 'STARTING COPE FILE TO /usr/share/nginx/www/...'
cp -r /home/sourcecode/build/ /usr/share/nginx/www/
echo 'STARTING CHMOD /www...'
chmod -R a+r /usr/share/nginx/www
# echo 'STARTING REMOVE /sourcecode'
# rm -rf /home/sourcecode

# change time zone
export TZ=Pacific/Auckland
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

echo 'STARTING NGINX...'
# step 2. start go bin file
nginx -g 'daemon off;';
echo 'FINISHED EVERYTHING...'

