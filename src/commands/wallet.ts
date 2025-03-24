import { Message } from "node-telegram-bot-api";

import bot from "../bot";

import { CopperAPI } from "../utils/CopperAPI";
import { Session } from "../utils/Session";

export async function walletCommand(msg: Message) {
	try {
		const { accessToken } = await new Session().getUserData(msg.chat.id);
		const balance = await new CopperAPI().getBalance(accessToken);
		const defaultWallet = await new CopperAPI().getDefaultWallet(
			accessToken
		);
		const options = {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "See All Wallets",
							callback_data: "get-all-wallets",
						},
						{
							text: "Change default wallet",
							callback_data: "set-default-wallet",
						},
					],
					[
						{
							text: "Transaction History",
							callback_data: "get-transaction-history",
						},
					],
				],
			},
		};
		bot.sendMessage(
			msg.chat.id,
			`Your default wallet is ${defaultWallet.walletAddress}(${defaultWallet.network}).\nYour balance is ${balance}\n\nWould you like to:`,
			options
		);
	} catch (error: any) {
		console.log("Error in dashboard callback");
		console.error(error.message);
		bot.sendMessage(msg.chat.id, "An error occured. Let's try that again!");
	}
}

export async function getAllWallets(chat_id: number) {
	try {
		const { accessToken } = await new Session().getUserData(chat_id);
		const wallets = await new CopperAPI().getAllWallets(accessToken);
		let message = "Here are your wallets:\n";
		for (const wallet of wallets) {
			message += `${wallet.walletAddress}\n${wallet.network}\n`;
		}
		bot.sendMessage(chat_id, message);
	} catch (error: any) {
		console.log("Error in get all wallets callback");
		console.error(error.message);
		bot.sendMessage(chat_id, "An error occured. Let's try that again!");
	}
}
export async function setDefaultWallet(chat_id: number) {
	try {
		const { accessToken } = await new Session().getUserData(chat_id);
		const wallets = await new CopperAPI().getAllWallets(accessToken);
		const addresses: { text: string }[][] = [];
		for (const wallet of wallets) {
			addresses.push([{ text: wallet.walletAddress }]);
		}
		const options = {
			reply_markup: {
				keyboard: addresses,
				one_time_keyboard: true,
			},
		};
		bot.sendMessage(chat_id, "Please select a wallet:", options);
		const messageHandler = async (msg: Message) => {
			if (!msg.text) return;
			const wallet = msg.text;
			await new CopperAPI().setDefaultWallet(accessToken, wallet);
			bot.removeListener("message", messageHandler);
		};
		bot.on("message", messageHandler);
	} catch (error: any) {
		console.log("Error in get all wallets callback");
		console.error(error.message);
		bot.sendMessage(chat_id, "An error occured. Let's try that again!");
	}
}
export async function getTransationHistory(chat_id: number) {
	try {
		const { accessToken } = await new Session().getUserData(chat_id);
		const { data } = await new CopperAPI().getTransationHistory(
			accessToken
		);
		if (!data) {
			bot.sendMessage(
				chat_id,
				"No transactions made so far. Use the /transfer command and get transacting..."
			);
			return;
		} else {
			let message = "Transaction history:\n";
			for (const txn of data) {
				const txnData = `${txn.createdAt}\nFrom: ${txn.sourceAccount.walletAddress}\nTo: ${txn.destinationAccount.walletAddress}\nAmount: \n${txn.amount}${txn.currency}\nType: ${txn.type}\nStatus: ${txn.status}`;
				message += txnData;
			}
		}
	} catch (error: any) {
		console.log("Error in get transaction history callback");
		console.error(error.message);
		bot.sendMessage(chat_id, "An error occured. Let's try that again!");
	}
}
