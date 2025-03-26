import TelegramBot, { Message } from "node-telegram-bot-api";
import { ethers } from "ethers";

import bot from "../bot";
import { Session } from "./Session";
import { CopperAPI } from "./CopperAPI";

export async function getAccessToken(chat_id: number) {
	const { accessToken } = await new Session().getSessionData(chat_id);
	if (!accessToken) {
		const options = {
			reply_markup: {
				inline_keyboard: [
					[{ text: "Sign in", callback_data: "authenticate" }],
				],
			},
		};
		return {
			isAuthorized: false,
			accessToken: "",
			message: {
				text: "You aren't authorized. Please sign in.",
				options,
			},
		};
	} else
		return {
			isAuthorized: true,
			accessToken,
			message: { text: "", options: {} },
		};
}

export async function getKYCStatus(chat_id: number) {
	const { accessToken, email } = await new Session().getSessionData(chat_id);
	const { data } = await new CopperAPI().getKYCStatus(accessToken!, email);
	console.log({ data });
	if (data.statusCode === 400)
		return {
			isVerified: false,
			message:
				"🔒 To access this feature, please complete your KYC verification. This ensures the security of your transactions and compliance with regulations.\n\nUse the /kyc command to begin.",
		};
	else {
		return { isVerified: true, message: "" };
	}
}

export function getNetworkNameFromChainID(network: string) {
	const chainId = Number(network);
	if (isNaN(chainId)) return network; // The network is acutally a string and not a number
	return ethers.Network.from(chainId).name;
}

export function getChainIDFromNetworkName(networkName: string) {
	const network = ethers.Network.from(networkName);
	return network ? Number(network.chainId) : null;
}

export function waitForReply(chat_id: number): Promise<string> {
	return new Promise((resolve) => {
		const replyHandler = async (msg: Message) => {
			if (!msg.text) return;
			const reply = msg.text;
			bot.removeListener("message", replyHandler);
			resolve(reply);
		};
		bot.on("message", replyHandler);
	});
}
