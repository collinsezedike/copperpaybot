import Pusher from "pusher-js";

import { CopperAPI } from "./CopperAPI";
import { getAccessToken } from "./helpers";

import bot from "../bot";

const VITE_PUSHER_CLUSTER = process.env.VITE_PUSHER_CLUSTER as string;
const VITE_PUSHER_KEY = process.env.VITE_PUSHER_KEY as string;

export async function initializePusher(chat_id: number) {
	const pusherClient = new Pusher(VITE_PUSHER_KEY, {
		cluster: VITE_PUSHER_CLUSTER,
		authorizer: (channel: { name: string }) => ({
			authorize: async (socketId, callback): Promise<void> => {
				try {
					const { isAuthorized, accessToken, message } =
						await getAccessToken(chat_id);
					if (!isAuthorized) {
						bot.sendMessage(chat_id, message.text, message.options);
						return;
					}
					const data = await new CopperAPI().authenticateNotification(
						accessToken,
						socketId,
						channel.name
					);

					if (data) {
						callback(null, data);
					} else {
						callback(
							new Error("Pusher authentication failed"),
							null
						);
					}
				} catch (error) {
					console.error("Pusher authorization error:", error);
					callback(error as Error, null);
				}
			},
		}),
	});

	// Subscribe to organization's private channel
	const { accessToken } = await getAccessToken(chat_id);
	const { organizationId } = await new CopperAPI().getAuthProfile(
		accessToken
	);
	const channel = pusherClient.subscribe(`private-org-${organizationId}`);

	channel.bind("pusher:subscription_succeeded", () => {
		console.log("Successfully subscribed to private channel");
	});

	channel.bind("pusher:subscription_error", (error: any) => {
		console.error("Subscription error:", error);
	});

	// Bind to the deposit event
	pusherClient.bind("deposit", (data: any) => {
		bot.sendMessage(
			chat_id,
			`💰 *New Deposit Received*\n\n` +
				`${data.amount} USDC deposited on Solana`
		);
	});
}
