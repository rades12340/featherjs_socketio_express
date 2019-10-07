const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");

// Idea service
class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    // Just return all our messages
    return this.ideas;
  }

  async create(data) {
    // The new message is the data merged with a unique identifier
    // using the messages length since it changes whenever we add one
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    // Add new message to the list
    idea.time = moment().format("h:mm:ss a");

    this.ideas.push(idea);

    return idea;
  }
}

// Idea Service
const app = express(feathers());

// Parse JSON
app.use(express.json());
// Config socker.io realtime APIs
app.configure(socketio());
// Enable REST services
app.configure(express.rest());
// Register services
app.use("/ideas", new IdeaService());
// New connections connect to stream channel
app.on("connection", conn => app.channel("stream").join(conn));
// Publish events to stream
app.publish(data => app.channel("stream"));

const port = process.env.PORT || 5001;

app.listen(port).on("listening", () => {
  console.log(`Realtime server running on port ${port}`);
});
