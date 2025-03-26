import "dotenv/config";
import { createClient, RedisClientType } from "redis";

import { User } from "./types";

export class Session {
	private client: RedisClientType;

	constructor() {
		this.client = createClient({
			username: process.env.REDIS_USERNAME,
			password: process.env.REDIS_PASSWORD,
			socket: {
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT),
			},
		});
	}

	async getSessionData(chat_id: number) {
		await this.client.connect();
		const sessionData = await this.client.hGetAll(chat_id.toString());
		await this.client.disconnect();
		return sessionData;
	}

	async postSessionData(chat_id: number, data: User) {
		await this.client.connect();
		if ("email" in data && "sid" in data) {
			const newUser: User = { email: data.email, sid: data.sid };
			await this.client.hSet(chat_id.toString(), newUser);
		} else throw Error("Invalid session data");
		await this.client.disconnect();
	}

	async updateSessionData(chat_id: number, partialData: Partial<User>) {
		await this.client.connect();
		const sessionKey = chat_id.toString();

		const sessionData = await this.getSessionData(chat_id);
		const updatedData = { ...sessionData, ...partialData };
		console.log({ sessionData, partialData, updatedData });

		// Update the user object
		if ("accessToken" in updatedData && updatedData.accessToken) {
			await this.client.hSet(sessionKey, {
				accessToken: updatedData.accessToken,
			});
		}
		await this.client.disconnect();
	}

	async deleteSessionData(chat_id: number) {
		await this.client.connect();
		// Delete session from the database
		await this.client.hDel(chat_id.toString(), "user");
		await this.client.disconnect();
	}
}
