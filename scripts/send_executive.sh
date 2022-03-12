source .env
curl -d "message=server reboot in 30 mins" -d "password=${EXECUTIVE_MESSAGE_PASSWORD}" -X POST http://localhost:8080/post_exec_message_miles