## How to run the app
1. npm run initStorage
    >creates a .csv file with events
2. npm run start

## How to verify it's working

### Batch request
curl --location --request GET 'http://localhost:3300/events/batch'

### Events by parameters
curl --location --request GET 'http://localhost:3300/events/?location=odesa&date=22/11/2020'

curl --location --request GET 'http://localhost:3300/events/?hour=11:00'

### Create en event
curl --location --request POST 'http://localhost:3300/events/' \
--header 'Content-Type: application/json' \
--data-raw '{"title": "node js event", "location":"dnipro", "date": "25/11/2020", "hour": "12:00"}'

### Get created event
curl --location --request GET 'http://localhost:3300/events/1604952832163'

### Update created event
curl --location --request PUT 'http://localhost:3300/events/1604952832163' \
--header 'Content-Type: application/json' \
--data-raw '{"title": "node js event updated", "location":"kharkiv", "date": "26/11/2020", "hour": "13:00"}'

### Delete created event
curl --location --request DELETE 'http://localhost:3300/events/1604952832163'