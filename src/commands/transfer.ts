import { Message } from "node-telegram-bot-api";

import bot from "../bot";

import { CopperAPI } from "../utils/CopperAPI";
import { getAccessToken, getKYCStatus, waitForReply } from "../utils/helpers";

export async function transferCommand(msg: Message) {
	try {
		const { isAuthorized, message } = await getAccessToken(msg.chat.id);
		if (!isAuthorized) {
			return bot.sendMessage(msg.chat.id, message.text, message.options);
		} else {
			const { isVerified, message } = await getKYCStatus(msg.chat.id);
			if (!isVerified) {
				return bot.sendMessage(msg.chat.id, message);
			}
		}
		const options = {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "Email transfer",
							callback_data: "perform-email-transfer",
						},
						{
							text: "Wallet transfer",
							callback_data: "perform-wallet-transfer",
						},
					],
					[
						{
							text: "Bulk Transfer",
							callback_data: "perform-bulk-transfer",
						},
					],
				],
			},
		};
		bot.sendMessage(
			msg.chat.id,
			"Ready to make a transfer?\n\nSelect what type of transfer you wish to make from the options listed below:",
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

export async function performEmailTransfer(chat_id: number) {
	try {
		const { isAuthorized, accessToken, message } = await getAccessToken(
			chat_id
		);
		if (!isAuthorized) {
			return bot.sendMessage(chat_id, message.text, message.options);
		} else {
			const { isVerified, message } = await getKYCStatus(chat_id);
			if (!isVerified) {
				return bot.sendMessage(chat_id, message);
			}
		}
		bot.sendMessage(chat_id, "Provide the recipient email address:");
		const email = await waitForReply(chat_id);
		bot.sendMessage(chat_id, "How much would you like to transfer");
		const amount = await waitForReply(chat_id);
		await new CopperAPI().performEmailTransfer(accessToken, {
			email,
			amount,
			currency: "USD",
			purposeCode: "self",
		});
	} catch (error: any) {
		console.log("Error in get perform email transfer callback");
		bot.sendMessage(
			chat_id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

export async function performWalletTransfer(chat_id: number) {
	try {
		const { isAuthorized, accessToken, message } = await getAccessToken(
			chat_id
		);
		if (!isAuthorized) {
			return bot.sendMessage(chat_id, message.text, message.options);
		} else {
			const { isVerified, message } = await getKYCStatus(chat_id);
			if (!isVerified) {
				return bot.sendMessage(chat_id, message);
			}
		}
		bot.sendMessage(chat_id, "Provide the recipient email address:");
		const walletAddress = await waitForReply(chat_id);
		bot.sendMessage(chat_id, "How much would you like to transfer");
		const amount = await waitForReply(chat_id);
		await new CopperAPI().performWalletTransfer(accessToken, {
			amount,
			walletAddress,
			currency: "USD",
			purposeCode: "self",
		});
	} catch (error: any) {
		console.log("Error in get perform email transfer callback");
		bot.sendMessage(
			chat_id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

export async function performBulkTransfer(chat_id: number) {
	try {
		const { isAuthorized, accessToken, message } = await getAccessToken(
			chat_id
		);
		if (!isAuthorized) {
			return bot.sendMessage(chat_id, message.text, message.options);
		} else {
			const { isVerified, message } = await getKYCStatus(chat_id);
			if (!isVerified) {
				return bot.sendMessage(chat_id, message);
			}
		}
		bot.sendMessage(
			chat_id,
			"Provide the recipient email addresses, separated by a comma:"
		);
		const walletAddresses = await waitForReply(chat_id);
		bot.sendMessage(chat_id, "How much would you like to transfer");
		const amount = await waitForReply(chat_id);

		const walletAddressArray = walletAddresses
			.split(",")
			.map((address) => address.trim());

		const transferData = walletAddressArray.map((walletAddress, index) => ({
			requestId: (index + 1).toString(), // Use the index as the requestId
			request: {
				amount,
				walletAddress,
				currency: "USD",
				purposeCode: "self",
			},
		}));
		await new CopperAPI().performBulkTransfer(accessToken, transferData);
	} catch (error: any) {
		console.log("Error in get perform email transfer callback");
		bot.sendMessage(
			chat_id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}
