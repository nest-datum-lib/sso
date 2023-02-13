
export class Exception {
	public readonly cmd: string = 'err.create';
	public readonly errorCode: number = 500;
	
	constructor(public message: string, public exceptionCode?: string|number) {
		this.message = `${message} ${exceptionCode || ''}`;
	}

	public getCmd(): string {
		return this.cmd;
	}

	public getMessage(): string {
		return this.message;
	}

	public options(): any {
		return {
			projectId: process.env.PROJECT_ID,
			appId: process.env.APP_ID,
			appName: process.env.APP_NAME,
			appHost: process.env.APP_HOST,
			appPort: process.env.APP_PORT,
			content: this.getMessage(),
		};
	}
}
