type User = {
	email: string;
	sid: string;
	accessToken?: string;
};

export const user: User = { email: "", sid: "" };
export class Session {
	// private
	constructor() {}

	async connect() {}
	async disconnect() {}

	async getUserData(chat_id: number): Promise<User> {
		await this.connect();
		// Get the user from the database
		await this.disconnect();
		return user;
	}

	async postUserData(chat_id: number, data: { email: string; sid: string }) {
		await this.connect();
		// Create a new user in the database
		const newUser: User = { email: data.email, sid: data.sid };
		user.email = newUser.email;
		user.sid = newUser.sid;
		// Save the new user in the database
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
		// Save the new user data in the database
		await this.disconnect();
	}

	async deleteUserData(chat_id: number) {
		await this.connect();
		// Delete user from the database
		user.email = "";
		user.sid = "";
		user.accessToken = "";
		await this.disconnect();
	}
}
