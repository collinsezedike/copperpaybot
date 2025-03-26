import { Message } from "node-telegram-bot-api";

import bot from "../bot";
import { CopperAPI } from "../utils/CopperAPI";
import { POST_AUTH_MESSAGE } from "../utils/messages";
import { Session } from "../utils/Session";
import { getAccessToken } from "../utils/helpers";

export async function authenticate(chat_id: number) {
	try {
		bot.sendMessage(chat_id, "Enter your email address:");
		bot.on("message", requestEmailOTP);
	} catch (error: any) {
		console.log("Error in autheticate callback");
		bot.sendMessage(
			chat_id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

async function requestEmailOTP(msg: Message) {
	try {
		if (!msg.text) return;
		const email = msg.text;
		const sid = await new CopperAPI().requestOTP(email);
		await new Session().postSessionData(msg.chat.id, { email, sid });
		bot.sendMessage(
			msg.chat.id,
			"Enter the OTP sent to the email address you provided:"
		);
		bot.removeListener("message", requestEmailOTP);
		bot.on("message", authenticateEmailOTP);
	} catch (error: any) {
		console.log("Error in request email otp");
		bot.sendMessage(
			msg.chat.id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

async function authenticateEmailOTP(msg: Message) {
	try {
		if (!msg.text) return;
		const otp = msg.text;
		const session = new Session();
		const { email, sid } = await session.getSessionData(msg.chat.id);
		const accessToken = await new CopperAPI().verifyOTP(email, sid, otp);
		await session.updateSessionData(msg.chat.id, { accessToken });
		bot.removeListener("message", authenticateEmailOTP);
		bot.sendMessage(msg.chat.id, POST_AUTH_MESSAGE);
	} catch (error: any) {
		console.log("Error in autheticate email otp");
		bot.sendMessage(
			msg.chat.id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

export async function logoutCommand(msg: Message) {
	try {
		const { isAuthorized, accessToken, message } = await getAccessToken(
			msg.chat.id
		);
		if (!isAuthorized) {
			return bot.sendMessage(msg.chat.id, message.text, message.options);
		}
		await new CopperAPI().logout(accessToken);
		await new Session().deleteSessionData(msg.chat.id);
		const options = {
			reply_markup: {
				inline_keyboard: [
					[{ text: "Sign in", callback_data: "authenticate" }],
				],
			},
		};
		bot.sendMessage(msg.chat.id, "Thank you for using CopperPay!", options);
	} catch (error: any) {
		console.log("Error in logout command");
		bot.sendMessage(
			msg.chat.id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}
