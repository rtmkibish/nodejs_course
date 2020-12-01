## How to run the app
1. npm install
3. npm run start

## How to verify that jwt auth working

### Create token
curl --location --request POST 'http://localhost:3300/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "userId": "5fc3dd167059bb6065c64e55"
}'

### Check access
curl --location --request GET 'http://localhost:3300/auth/check' \
--header 'Authorization: Bearer acces_token here'

### Refresh access token
curl --location --request POST 'http://localhost:3300/auth/check' \
--header 'Content-Type: application/json' \
--data-raw '{
  "refresh_token": "refresh_token here"
}'

### Revoke refresh token
curl --location --request DELETE 'http://localhost:3300/auth/revoke' \
--header 'Content-Type: application/json' \
--data-raw '{
    "refresh_token": "your refresh token"
}'