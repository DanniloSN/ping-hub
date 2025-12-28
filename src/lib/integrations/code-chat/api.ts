import axios, { type AxiosInstance } from 'axios';
import type {
	CodeChatOptions,
	ConnectionStateResponse,
	CreateInstanceResponse,
	InstanceConnectResponse,
	SendTextOptions,
	SendTextResponse
} from './types';

export class CodeChat {
	#axios: AxiosInstance;
	#instanceName: string;

	constructor(options: CodeChatOptions) {
		this.#axios = axios.create({
			baseURL: process.env.WHATSAPP_API_URL || 'http://localhost:8084',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				apiKey: process.env.WHATSAPP_API_KEY || ''
			}
		});

		this.#instanceName = options.instanceName;
		if (options.instanceToken) this.setInstanceToken(options.instanceToken);
	}

	setInstanceToken(instanceToken: string) {
		this.#axios.defaults.headers.Authorization = `Bearer ${instanceToken}`;
	}

	async createInstance() {
		return this.#axios.post<CreateInstanceResponse>('/instance/create', {
			instanceName: this.#instanceName
		});
	}

	async connectionStatus() {
		return this.#axios.get<ConnectionStateResponse>(
			`/instance/connectionState/${this.#instanceName}`
		);
	}

	async instanceConnect() {
		return this.#axios.get<InstanceConnectResponse>(`/instance/connect/${this.#instanceName}`);
	}

	async sendText(options: SendTextOptions) {
		return this.#axios.post<SendTextResponse>(`/message/sendText/${this.#instanceName}`, options);
	}
}
