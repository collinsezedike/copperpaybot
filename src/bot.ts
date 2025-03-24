import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

import { authenticate } from "./commands/auth";
import {
	helpCommand,
	logoutCommand,
	startCommand,
	walletCommand,
} from "./commands";
import {
	getAllWallets,
	setDefaultWallet,
	getTransationHistory,
} from "./commands/wallet";

// Environmental Variables
const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/help/, helpCommand);
bot.onText(/\/start/, startCommand);
bot.onText(/\/wallet/, walletCommand);
bot.onText(/\/logout/, logoutCommand);

// Handle callback queries
bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
	const action = callbackQuery.data;
	const msg = callbackQuery.message;

	switch (action) {
		case "authenticate":
			await authenticate(msg?.chat.id!);
			break;
		case "get-all-wallets":
			await getAllWallets(msg?.chat.id!);
			break;
		case "set-default-wallet":
			await setDefaultWallet(msg?.chat.id!);
			break;
		case "get-transaction-history":
			await getTransationHistory(msg?.chat.id!);
			break;
		default:
			break;
	}
});

export default bot;
