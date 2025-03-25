import { Message } from "node-telegram-bot-api";

import bot from "../bot";

import { CopperAPI } from "../utils/CopperAPI";
import {
	getAccessToken,
	getChainIDFromNetworkName,
	getNetworkNameFromChainID,
} from "../utils/helpers";

export async function walletCommand(msg: Message) {
	try {
		const { isAuthorized, accessToken, message } = await getAccessToken(
			msg.chat.id
		);
		if (!isAuthorized) {
			return bot.sendMessage(msg.chat.id, message.text, message.options);
		}
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
		const network = getNetworkNameFromChainID(defaultWallet.network);
		bot.sendMessage(
			msg.chat.id,
			`Your default wallet is ${defaultWallet.walletAddress} (Network: ${network})\n\nYour balance is ${balance?.balance} ${balance?.symbol}\n\nWould you like to:`,
			options
		);
	} catch (error: any) {
		console.log("Error in dashboard callback");
		bot.sendMessage(
			msg.chat.id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

export async function getAllWallets(chat_id: number) {
	try {
		const {
			isAuthorized,
			accessToken,
			message: msg,
		} = await getAccessToken(chat_id);
		if (!isAuthorized) {
			return bot.sendMessage(chat_id, msg.text, msg.options);
		}

		const wallets = await new CopperAPI().getAllWallets(accessToken);
		let message = "Here are your wallets:\n\n";
		for (const wallet of wallets) {
			const network = getNetworkNameFromChainID(wallet.network);
			message += `🔹${wallet.walletAddress} (Network: ${network})\n`;
		}
		bot.sendMessage(chat_id, message);
	} catch (error: any) {
		console.log("Error in get all wallets callback");
		bot.sendMessage(
			chat_id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

export async function setDefaultWallet(chat_id: number) {
	try {
		const { isAuthorized, accessToken, message } = await getAccessToken(
			chat_id
		);
		if (!isAuthorized) {
			return bot.sendMessage(chat_id, message.text, message.options);
		}
		const wallets = await new CopperAPI().getAllWallets(accessToken);
		const addresses: { text: string }[][] = [];
		for (const wallet of wallets) {
			const network = getNetworkNameFromChainID(wallet.network);
			addresses.push([
				{ text: `${wallet.walletAddress}\nNetwork: ${network}` },
			]);
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

			const [walletAddress, network] = msg.text.split("\nNetwork: ");
			const chainId = getChainIDFromNetworkName(network);
			const wallet = wallets.find(
				(w: any) =>
					w.walletAddress === walletAddress &&
					w.network === String(chainId)
			);
			if (!wallet) return bot.sendMessage(chat_id, "Wallet not found");

			await new CopperAPI().setDefaultWallet(accessToken, wallet.id);
			bot.removeListener("message", messageHandler);
			bot.sendMessage(
				chat_id,
				`New default wallet set.\n\nAddress: ${
					wallet.walletAddress
				}\nNetwork: ${getNetworkNameFromChainID(wallet.network)}`
			);
		};
		bot.on("message", messageHandler);
	} catch (error: any) {
		console.log("Error in get all wallets callback");
		bot.sendMessage(
			chat_id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}

export async function getTransationHistory(chat_id: number) {
	try {
		const { isAuthorized, accessToken, message } = await getAccessToken(
			chat_id
		);
		if (!isAuthorized) {
			return bot.sendMessage(chat_id, message.text, message.options);
		}
		const { data } = await new CopperAPI().getTransationHistory(
			accessToken
		);
		if (!data || data.length === 0) {
			bot.sendMessage(
				chat_id,
				"No transactions made so far. Use the /transfer command and get transacting..."
			);
			return;
		} else {
			let message = "Transaction history:\n";
			console.log(data);
			for (const txn of data) {
				const txnData = `${txn.createdAt}\nFrom: ${txn.sourceAccount.walletAddress}\nTo: ${txn.destinationAccount.walletAddress}\nAmount: \n${txn.amount}${txn.currency}\nType: ${txn.type}\nStatus: ${txn.status}`;
				message += txnData;
			}
			bot.sendMessage(chat_id, message);
		}
	} catch (error: any) {
		console.log("Error in get transaction history callback");
		bot.sendMessage(
			chat_id,
			`An error occured.\n\nCause: ${error.message}`
		);
	}
}
