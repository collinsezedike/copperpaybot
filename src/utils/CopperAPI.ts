import "dotenv/config";
import axios, { AxiosError } from "axios";

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
		// If 401
		// If 500
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
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async logout(accessToken: string) {
		try {
			await axios.post(`${this.url}/wallets/default`, null, {
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
			const defaultWallet = response.data;
			return defaultWallet;
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
			const { balance } = response.data;
			return balance;
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
			const allWallets = response.data;
			return allWallets;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}

	async setDefaultWallet(accessToken: string, wallet: string) {
		try {
			// Get the auth token
			const response = await axios.post(
				`${this.url}/wallets/default`,
				{ wallet },
				{ headers: this.createAuthHeader(accessToken) }
			);
			const newDefaultWallet = response.data;
			return newDefaultWallet;
		} catch (error: any) {
			if (error instanceof AxiosError) this.catchError(error);
			else throw error;
		}
	}
	async getTransationHistory(accessToken: string, page_number: number = 1) {
		// Get the auth token
		const response = await axios.get(`${this.url}/transfers`, {
			data: { page_number },
			headers: this.createAuthHeader(accessToken),
		});
		const newDefaultWallet = response.data;
		return newDefaultWallet;
	}
	catch(error: any) {
		if (error instanceof AxiosError) this.catchError(error);
		else throw error;
	}
}
