export interface CodeChatOptions {
	instanceName: string;
	instanceToken?: string;
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

export type ConnectionStateResponse =
	| {
			state: 'close';
			statusReason: 400;
	  }
	| {
			state: 'refused';
			statusReason: 428;
	  }
	| {
			state: 'open';
			statusReason: 200;
	  };

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
