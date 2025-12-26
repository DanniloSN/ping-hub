import type {
	CodeChatOptions,
	CreateInstanceOptions,
	CreateInstanceResponse,
	FetchInstanceResponse,
	InstanceConnectResponse,
	SendTextOptions,
	SendTextResponse
} from './types';

export class CodeChat {
	#instanceName: string;
	#instanceToken: string;

	constructor(options: CodeChatOptions) {
		this.#instanceName = options.instanceName || '';
		this.#instanceToken = options.instanceToken || '';
	}

	static async createInstance(options: CreateInstanceOptions) {
		const response = await fetch('instance/create', {
			method: 'POST',
			body: JSON.stringify(options)
		});
		if (!response.ok) {
			throw new Error(`Failed to create instance: ${response.statusText}`);
		}
		return response.json() as Promise<CreateInstanceResponse>;
	}

	async fetchInstance() {
		const response = await fetch(`instance/fetchInstance/${this.#instanceName}`, { method: 'GET' });
		if (!response.ok) {
			throw new Error(`Failed to fetch instance: ${response.statusText}`);
		}
		return response.json() as Promise<FetchInstanceResponse>;
	}

	async instanceConnect() {
		const response = await fetch(`instance/connect/${this.#instanceName}`);
		if (!response.ok) {
			throw new Error(`Failed to connect to instance: ${response.statusText}`);
		}
		return response.json() as Promise<InstanceConnectResponse>;
	}

	async sendText(options: SendTextOptions) {
		const response = await fetch(`message/sendText/${this.#instanceName}`, {
			method: 'POST',
			body: JSON.stringify(options)
		});
		if (!response.ok) {
			throw new Error(`Failed to send text message: ${response.statusText}`);
		}
		return response.json() as Promise<SendTextResponse>;
	}
}
