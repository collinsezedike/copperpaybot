import { Message } from "node-telegram-bot-api";

import bot from "../bot";
import { CopperAPI } from "../utils/CopperAPI";
import { POST_AUTH_MESSAGE } from "../utils/messages";

const user = { email: "", sid: "", session: { scheme: "", accessToken: "" } };

export async function authenticate(chat_id: number) {
	try {
		bot.sendMessage(chat_id, "Enter your email address:");
		bot.on("message", requestEmailOTP);
	} catch (error: any) {
		console.log("Error in autheticate callback");
		console.error(error.message);
	}
}

async function requestEmailOTP(msg: Message) {
	try {
		if (!msg.text) return;
		const email = msg.text;
		const sid = await new CopperAPI().requestOTP(email);

		// Save value to database
		user.sid = sid;
		user.email = email;

		bot.sendMessage(
			msg.chat.id,
			"Enter the OTP sent to the email address you provided:"
		);
		bot.removeListener("message", requestEmailOTP);
		bot.on("message", authenticateEmailOTP);
	} catch (error: any) {
		console.log("Error in request email otp");
		console.error(error.message);
	}
}

async function authenticateEmailOTP(msg: Message) {
	try {
		if (!msg.text) return;
		const otp = msg.text;
		const { email, sid } = user;
		const data = await new CopperAPI().verifyOTP(email, sid, otp);
		if (data) {
			const { scheme, accessToken } = data;

			// Add auth to user session
			user.session.accessToken = accessToken;
			user.session.scheme = scheme;
		}
		bot.removeListener("message", authenticateEmailOTP);
		bot.sendMessage(msg.chat.id, POST_AUTH_MESSAGE);
	} catch (error: any) {
		console.log("Error in autheticate email otp");
		console.error(error.message);
	}
}

export async function logoutCommand(msg: Message) {
	try {
		// Fetch user session using chat id
		const { accessToken } = user.session;
		await new CopperAPI().logout(accessToken);
		// If valid, log them out.
		// If missing or invalid reply that they have already been logged out
	} catch (error: any) {
		console.log("Error in loguot command");
		console.error(error.message);
	}
}
