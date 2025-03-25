export type User = {
	email: string;
	sid: string;
	accessToken?: string;
};

export type TransferData = {
	walletAddress?: string;
	email?: string;
	payeeId?: string;
	amount: string;
	purposeCode: string;
	currency?: string;
};
