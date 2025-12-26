export interface CodeChatOptions {
	instanceName?: string;
	instanceToken?: string;
}

export interface CreateInstanceOptions {
	instanceName: string;
	description?: string;
}

export interface CreateInstanceResponse {
	id: number;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	Auth: {
		id: number;
		token: string;
	};
}

export interface FetchInstanceResponse {
	id: number;
	name: string;
	description: string | null;
	connectionStatus: unknown;
	ownerJid: string;
	profilePicUrl: string;
	createdAt: string;
	updatedAt: string;
	Webhook: unknown;
	Whatsapp: {
		connection: {
			state: unknown;
			statusReason: 200;
		};
	};
}

export interface InstanceConnectResponse {
	count: number;
	base64: string;
	code: string;
}

export interface SendTextOptions {
	number: string;
	options?: {
		externalAttributes?: string;
		delay?: number;
		presence?: unknown;
	};
	textMessage: {
		text: string;
	};
}

export interface SendTextResponse {
	id: number;
	keyId: string;
	keyFromMe: boolean;
	keyRemoteJid: string;
	keyParticipant: string;
	pushName: string;
	messageType: '';
	content: {
		text: string;
		contextInfo?: unknown;
	};
	messageTimestamp: number;
	instanceId: number;
	device: string;
}
