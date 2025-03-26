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
		if (!this.client.isOpen) this.client.connect();
		this.client.on("error", (err) =>
			console.log("Redis Client Error", err)
		);
	}

	async getSessionData(chat_id: number) {
		const sessionData = await this.client.hGetAll(chat_id.toString());
		return sessionData;
	}

	async postSessionData(chat_id: number, data: User) {
		if ("email" in data && "sid" in data) {
			const newUser: User = { email: data.email, sid: data.sid };
			await this.client.hSet(chat_id.toString(), newUser);
		} else throw Error("Invalid session data");
	}

	async updateSessionData(chat_id: number, partialData: Partial<User>) {
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
	}

	async deleteSessionData(chat_id: number) {
		// Delete session from the database
		await this.client.hDel(chat_id.toString(), "user");
	}
}
