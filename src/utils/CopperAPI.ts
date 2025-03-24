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
			const { scheme, accessToken } = response.data;
			return { scheme, accessToken };
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
}
