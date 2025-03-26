import "dotenv/config";
import axios, { AxiosError } from "axios";
import { TransferData } from "./types";

// Environmental Variables
const API_URL = process.env.COPPERX_API_ENDPOINT!;

export class CopperAPI {
	private url: string;
	private authKey: string;

	constructor() {
		this.url = API_URL;
		this.authKey = "bearer";
	}

	createAuthHeader(accessToken: string) {
		return { Authorization: `${this.authKey} ${accessToken}` };
	}

	catchError(error: AxiosError) {
		// If 422
		switch (error.status) {
			case 422:
				throw Error(
					"Your response appears to be either invalid or incomplete. Kindly check and try again."
				);
			case 401:
				throw Error(
					"Oops! It looks like you're not logged in. Please log in to continue."
				);
			case 500:
				throw Error(
					"An unexpected error occurred on our end. Please try again."
				);
			default:
				throw error;
		}
	}

	// ** AUTHENTICATION AND ACCOUNT MANAGEMENT ** //

	async requestOTP(email: string) {
		try {
			const response = await axios.post(
				`${this.url}/auth/email-otp/request`,
				{ email }
			);
			const { sid } = response.data;
			return sid;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async verifyOTP(email: string, sid: string, otp: string) {
		try {
			const response = await axios.post(
				`${this.url}/auth/email-otp/authenticate`,
				{ email, sid, otp }
			);
			const { accessToken } = response.data;
			return accessToken;
		} catch (error: any) {
			console.log({ error });
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async logout(accessToken: string) {
		try {
			await axios.post(`${this.url}/auth/logout`, null, {
				headers: this.createAuthHeader(accessToken),
			});
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	// ** WALLET INTERACTIONS ** //

	async getDefaultWallet(accessToken: string) {
		try {
			// Get the auth token
			const response = await axios.get(`${this.url}/wallets/default`, {
				headers: this.createAuthHeader(accessToken),
			});
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async getBalance(accessToken: string) {
		try {
			// Get the auth token
			const response = await axios.get(`${this.url}/wallets/balance`, {
				headers: this.createAuthHeader(accessToken),
			});
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async getAllWallets(accessToken: string) {
		try {
			// Get the auth token
			const response = await axios.get(`${this.url}/wallets`, {
				headers: this.createAuthHeader(accessToken),
			});
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async setDefaultWallet(accessToken: string, walletId: string) {
		try {
			// Get the auth token
			const response = await axios.post(
				`${this.url}/wallets/default`,
				{ walletId },
				{ headers: this.createAuthHeader(accessToken) }
			);
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async getTransationHistory(accessToken: string, page_number: number = 1) {
		try {
			// Get the auth token
			const response = await axios.get(`${this.url}/transfers`, {
				data: { page_number },
				headers: this.createAuthHeader(accessToken),
			});
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	// ** TRANSFER INTERACTIONS ** //

	async performEmailTransfer(
		accessToken: string,
		transferData: TransferData
	) {
		try {
			const response = await axios.post(
				`${this.url}/transfers/send`,
				transferData,
				{ headers: this.createAuthHeader(accessToken) }
			);
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async performWalletTransfer(
		accessToken: string,
		transferData: TransferData
	) {
		try {
			const response = await axios.post(
				`${this.url}/transfers/wallet-withdraw`,
				transferData,
				{ headers: this.createAuthHeader(accessToken) }
			);
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async performBulkTransfer(
		accessToken: string,
		transferData: {
			requestId: string;
			request: TransferData;
		}[]
	) {
		try {
			const response = await axios.post(
				`${this.url}/transfers/send-batch`,
				{ requests: transferData },
				{ headers: this.createAuthHeader(accessToken) }
			);
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async performBankWithdrawal(
		accessToken: string,
		transferData: TransferData
	) {
		try {
			const response = await axios.post(
				`${this.url}/transfers/send-batch`,
				transferData,
				{ headers: this.createAuthHeader(accessToken) }
			);
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async getKYCStatus(accessToken: string, email: string) {
		try {
			const response = await axios.get(
				`${this.url}/kycs/status/${email}`,
				{ data: null, headers: this.createAuthHeader(accessToken) }
			);
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) {
				if (error.status === 400) return error.response;
				this.catchError(error);
			} else throw error;
		}
	}

	async getAuthProfile(accessToken: string) {
		try {
			const response = await axios.get(`${this.url}/auth/me`, {
				data: null,
				headers: this.createAuthHeader(accessToken),
			});
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async authenticateNotification(
		accessToken: string,
		socketId: string,
		channel_name: string
	) {
		try {
			const response = await axios.post(
				`${this.url}/notifications/auth`,
				{ socketId, channel_name },
				{ headers: this.createAuthHeader(accessToken) }
			);
			return response.data;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}
}
