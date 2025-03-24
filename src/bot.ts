import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

import { logoutCommand, startCommand } from "./commands";
import { authenticate } from "./commands/auth";

// Environmental Variables
const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, startCommand);
bot.onText(/\/logout/, logoutCommand);

// Handle callback queries
bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
	const action = callbackQuery.data;
	const msg = callbackQuery.message;

	switch (action) {
		case "authenticate":
			await authenticate(msg?.chat.id!);
			break;
		default:
			break;
		// case ""
	}
});

export default bot;
