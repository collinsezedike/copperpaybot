import { Message } from "node-telegram-bot-api";

import bot from "../bot";

import { logoutCommand } from "./auth";
import { walletCommand } from "./wallet";

import { START_MESSAGE } from "../utils/messages";

async function startCommand(msg: Message) {
	const options = {
		reply_markup: {
			inline_keyboard: [
				[{ text: "Sign in", callback_data: "authenticate" }],
			],
		},
	};
	bot.sendMessage(msg.chat.id, START_MESSAGE, options);
}

export { logoutCommand, startCommand, walletCommand };
