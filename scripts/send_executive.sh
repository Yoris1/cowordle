source .env
curl -d "message=$1" -d "password=${EXECUTIVE_MESSAGE_PASSWORD}" -X POST https://${DOMAIN}${EXECUTIVE_MESSAGE_ENDPOINT}