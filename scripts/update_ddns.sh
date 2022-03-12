source .env
curl "https://dynamicdns.park-your-domain.com/update?host=$DDNS_HOST&domain=$DOMAIN&password=$DDNS_PASSWORD"