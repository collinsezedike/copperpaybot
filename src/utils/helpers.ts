import { ethers } from "ethers";

import { Session } from "./Session";

export async function getAccessToken(chat_id: number) {
	const { accessToken } = await new Session().getUserData(chat_id);
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

export function getNetworkNameFromChainID(network: string) {
	const chainId = Number(network);
	if (isNaN(chainId)) return network; // The network is acutally a string and not a number
	return ethers.Network.from(chainId).name;
}

export function getChainIDFromNetworkName(networkName: string) {
	const network = ethers.Network.from(networkName);
	return network ? Number(network.chainId) : null;
}
