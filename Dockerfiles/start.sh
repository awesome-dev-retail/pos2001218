# /bin/bash
# step 1. start sshd for azure

service ssh start;

# step 2. start go bin file
nginx -g 'daemon off;';
