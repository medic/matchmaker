#!/usr/bin/env bash
#
# Had to use bash for this, openssl and sh didn't create couchdb
# compatible hashes.
#
# If you have openssl 1.0.0e or newer, the $SALT value includes a
# '(stdin)=' prefix. You should remove it and calculate password_sha with just
# the hex part.
#
#

if [ -z $1 ]; then
    echo "Usage: $0 <username>";
    exit 1
fi

USER="$1"
PASS=`openssl rand -base64 16| cut -c1-6`
SALT=`openssl rand 16| openssl md5`
PASS_SHA=`echo -n "$PASS$SALT" | openssl sha1`

# The password field is not necessary but since we are generating random
# passwords it is included for convenience. When you create the doc it will get
# overwritten with null.
cat <<EOT
{
    "_id": "org.couchdb.user:$USER",
    "name": "$USER",
    "type": "user",
    "password": "$PASS",
    "password": null,
    "password_sha": "$PASS_SHA",
    "salt": "$SALT",
    "roles": []
}
EOT
