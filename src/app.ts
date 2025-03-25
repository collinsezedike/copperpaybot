import "dotenv/config";
import express from "express";

import bot from "./bot";

const port = process.env.PORT;

const app = express();

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot`, (req, res) => {
	bot.processUpdate(req.body);
	res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
	console.log(`Express server is listening on ${port}`);
});

// Just to ping!
bot.on("message", (msg) => {
	bot.sendMessage(msg.chat.id, "I am alive!");
});
