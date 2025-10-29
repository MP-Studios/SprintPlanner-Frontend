import ical from "node-ical";

async function parse() {
    const data = await ical.async.parseFile("calendar.ics");
    try {
        const events = await ical.async.parseFile('calendar.ics');
       // Process events
    }   catch (error) {
        console.error('Failed to parse calendar:', error);
    }

}