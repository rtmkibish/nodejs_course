const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { EVENTSDTOPATH } = require(path.join(__dirname, 'config.js'));
const { log } = require(path.join(__dirname, 'logger.js'));

const events = [
  {
    id: uuid(),
    title: "js event 1",
    location: "kyiv",
    date: "20/11/2020",
    hour: "13:00"
  },
  {
    id: uuid(),
    title: "js event 2",
    location: "lviv",
    date: "21/11/2020",
    hour: "11:00"
  },
  {
    id: uuid(),
    title: "js event 3",
    location: "odesa",
    date: "22/11/2020",
    hour: "14:00"
  },
  {
    id: uuid(),
    title: "js event 4",
    location: "kherson",
    date: "23/11/2020",
    hour: "16:00"
  }
];

function eventsToCsv(events) {
  const headers = "id,title,location,date,hour";
  const rawEvents = events.map(e => `${e.id},${e.title},${e.location},${e.date},${e.hour}`);
  return `${headers}\n${rawEvents.join('\n')}\n`;
}

fs.writeFile(EVENTSDTOPATH, eventsToCsv(events), () => log('The eventsDTO.csv is created'));
