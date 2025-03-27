import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

import { authenticate } from "./commands/auth";
import {
	helpCommand,
	kycCommand,
	logoutCommand,
	startCommand,
	transferCommand,
	walletCommand,
} from "./commands";
import {
	getAllWallets,
	setDefaultWallet,
	getTransationHistory,
} from "./commands/wallet";
import {
	performBulkTransfer,
	performEmailTransfer,
	performWalletTransfer,
} from "./commands/transfer";

// Environmental Variables
const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

// const bot = new TelegramBot(TOKEN, { polling: true }); // Development
const bot = new TelegramBot(TOKEN);

bot.onText(/\/help/, helpCommand);
bot.onText(/\/kyc/, kycCommand);
bot.onText(/\/start/, startCommand);
bot.onText(/\/wallet/, walletCommand);
bot.onText(/\/transfer/, transferCommand);
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
		case "perform-email-transfer":
			await performEmailTransfer(msg?.chat.id!);
			break;
		case "perform-wallet-transfer":
			await performWalletTransfer(msg?.chat.id!);
			break;
		case "perform-bulk-transfer":
			await performBulkTransfer(msg?.chat.id!);
			break;
		default:
			break;
	}
});

export default bot;
