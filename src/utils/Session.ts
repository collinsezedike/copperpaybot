type User = {
	email: string;
	sid: string;
	accessToken: string;
};

export class Session {
	// private
	constructor() {}

	async connect() {}
	async disconnect() {}

	async getUserData(chat_id: number): Promise<User> {
		await this.connect();
		const user: User = { email: "", sid: "", accessToken: "" };
		await this.disconnect();
		return user;
	}

	async postUserData(chat_id: number, data: { email: string; sid: string }) {
		await this.connect();
		await this.disconnect();
	}

	async updateUserData(
		chat_id: number,
		data: { email?: string; sid?: string; accessToken?: string }
	) {
		await this.connect();
		const user: User = await this.getUserData(chat_id);
		if (data.email) user.email = data.email;
		if (data.sid) user.sid = data.sid;
		if (data.accessToken) user.accessToken = data.accessToken;
		await this.disconnect();
	}

	async deleteUserData(chat_id: number) {
		await this.connect();
		await this.disconnect();
	}
}
