import { Message } from "node-telegram-bot-api";

import bot from "../bot";
import { CopperAPI } from "../utils/CopperAPI";
import { POST_AUTH_MESSAGE } from "../utils/messages";
import { Session } from "../utils/Session";

export async function authenticate(chat_id: number) {
	try {
		bot.sendMessage(chat_id, "Enter your email address:");
		bot.on("message", requestEmailOTP);
	} catch (error: any) {
		console.log("Error in autheticate callback");
		console.error(error.message);
		bot.sendMessage(chat_id, "An error occured. Let's try that again!");
	}
}

async function requestEmailOTP(msg: Message) {
	try {
		if (!msg.text) return;
		const email = msg.text;
		const sid = await new CopperAPI().requestOTP(email);

		const session = new Session();
		session.updateUserData(msg.chat.id, { email, sid });

		bot.sendMessage(
			msg.chat.id,
			"Enter the OTP sent to the email address you provided:"
		);
		bot.removeListener("message", requestEmailOTP);
		bot.on("message", authenticateEmailOTP);
	} catch (error: any) {
		console.log("Error in request email otp");
		console.error(error.message);
		bot.sendMessage(msg.chat.id, "An error occured. Let's try that again!");
	}
}

async function authenticateEmailOTP(msg: Message) {
	try {
		if (!msg.text) return;
		const otp = msg.text;
		const session = new Session();
		const { email, sid } = await session.getUserData(msg.chat.id);
		const accessToken = await new CopperAPI().verifyOTP(email, sid, otp);
		await session.updateUserData(msg.chat.id, { accessToken });

		bot.removeListener("message", authenticateEmailOTP);
		bot.sendMessage(msg.chat.id, POST_AUTH_MESSAGE);
	} catch (error: any) {
		console.log("Error in autheticate email otp");
		console.error(error.message);
		bot.sendMessage(msg.chat.id, "An error occured. Let's try that again!");
	}
}

export async function logoutCommand(msg: Message) {
	try {
		const session = new Session();
		const { accessToken } = await session.getUserData(msg.chat.id);
		if (accessToken) {
			await new CopperAPI().logout(accessToken);
			await session.deleteUserData(msg.chat.id);
		}
		const options = {
			reply_markup: {
				inline_keyboard: [
					[{ text: "Sign in", callback_data: "authenticate" }],
				],
			},
		};
		bot.sendMessage(msg.chat.id, "Logged out successfully.", options);
	} catch (error: any) {
		console.log("Error in loguot command");
		console.error(error.message);
		bot.sendMessage(msg.chat.id, "An error occured. Let's try that again!");
	}
}
