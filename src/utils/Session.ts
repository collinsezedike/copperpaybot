import { TransferData, User } from "./types";

const user: User = { email: "", sid: "" };
const transferData = { amount: "", purposeCode: "self" };
export class Session {
	private user: User;
	private transferData: TransferData;

	constructor() {
		this.user = user;
		this.transferData = transferData;
	}

	async connect() {}
	async disconnect() {}

	async getSessionData(chat_id: number) {
		await this.connect();
		// Get the session from the database
		await this.disconnect();
		return { user, transferData };
	}

	async postSessionData(chat_id: number, data: User | TransferData) {
		await this.connect();
		// Create a new session in the database
		if ("email" in data && "sid" in data) {
			const newUser: User = { email: data.email, sid: data.sid };
			user.email = newUser.email;
			user.sid = newUser.sid;
			// } else if ( )
		} else throw Error("Invalid session data");
		// Save the new session in the database
		await this.disconnect();
	}

	async updateSessionData(
		chat_id: number,
		partialData: Partial<User> | Partial<TransferData>
	) {
		await this.connect();
		const sessionData = await this.getSessionData(chat_id);
		const updatedData = { ...sessionData, ...partialData };

		// Update the user object
		if ("accessToken" in updatedData) {
			user.accessToken = updatedData.accessToken as string;
		}
		if ("amount" in updatedData && "purposeCode" in updatedData) {
			transferData.amount = updatedData.amount!;
			transferData.purposeCode = updatedData.purposeCode!;
		}
		// Save the new session data in the database
		await this.disconnect();
	}

	async deleteSessionData(chat_id: number) {
		await this.connect();
		// Delete session from the database
		user.email = "";
		user.sid = "";
		user.accessToken = "";
		await this.disconnect();
	}
}
