import { Message } from "node-telegram-bot-api";

import bot from "../bot";

import { getAccessToken } from "../utils/helpers";

export async function kycCommand(msg: Message) {
	try {
		const { isAuthorized, message } = await getAccessToken(msg.chat.id);
		if (!isAuthorized) {
			return bot.sendMessage(msg.chat.id, message.text, message.options);
		}
		const options = {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "Begin Verification",
							url: "https://payout.copperx.io/app/kyc",
						},
					],
				],
			},
		};
		bot.sendMessage(
			msg.chat.id,
			"👋 Welcome to the KYC Verification Process!\n\nCompleting your KYC ensures secure transactions and compliance with regulations.\n\nClick the button below to get started.",
			options
		);
	} catch (error: any) {
		console.log("Error in transfer command");
		bot.sendMessage(
			msg.chat.id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}
