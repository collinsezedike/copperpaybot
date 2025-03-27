import "dotenv/config";
import express from "express";

import bot from "./bot";

const url = process.env.SERVER_URL;
const port = process.env.PORT || 3000;

const app = express();

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot`);

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
