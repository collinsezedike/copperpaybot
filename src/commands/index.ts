import { Message } from "node-telegram-bot-api";

import bot from "../bot";

import { kycCommand } from "./kyc";
import { logoutCommand } from "./auth";
import { transferCommand } from "./transfer";
import { walletCommand } from "./wallet";

import { START_MESSAGE, HELP_MESSAGE } from "../utils/messages";

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

export function helpCommand(msg: Message) {
	bot.sendMessage(msg.chat.id, HELP_MESSAGE);
}

export {
	kycCommand,
	logoutCommand,
	startCommand,
	transferCommand,
	walletCommand,
};
