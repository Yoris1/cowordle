mkdir -p certificates
openssl req -nodes -new -x509 -keyout ./certificates/privkey.pem -out ./certificates/fullchain.pem