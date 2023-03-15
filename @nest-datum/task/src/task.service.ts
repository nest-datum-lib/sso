import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { 
	obj as utilsCheckObj,
	objFilled as utilsCheckObjFilled,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName,
	func as utilsCheckFunc,
} from '@nest-datum-utils/check';

@Injectable()
export class TaskService {
	private _onNextList = {};
	private _onErrorList = {};
	private _taskModule;
	protected type = 'task';
	protected replicaService;
	protected id;
	protected name;
	protected createdAt;
	protected payload;

	setModule(taskModule) {
		this._taskModule = taskModule;

		return this;
	}

	getModule() {
		return this._taskModule;
	}

	setOptions(options: object, inLoop = false) {
		this.id = options['id'] || uuidv4();
		this.name = options['name'] || this.getName();
		this.payload = options['payload'] || this.payload;
		this.createdAt = options['createdAt'] || (new Date());
		this._onNextList = utilsCheckObjFilled(options['onNextList']) 
			? options['onNextList']
			: this._onNextList;
		this._onErrorList = utilsCheckObjFilled(options['onErrorList']) 
			? options['onErrorList']
			: this._onErrorList;
		
		return this.getOptions();
	}

	getOptions() {
		return {
			id: this.id,
			name: this.name,
			payload: this.payload,
			createdAt: this.createdAt,
			onNextList: this.getOnNext(),
			onErrorList: this.getOnError(),
		};
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name || this.constructor.name || this['name'];
	}

	getPayload() {
		return this.payload;
	}

	setOnNext(taskService, options) {
		this._onNextList[String(taskService.name ?? taskService.constructor.name)] = options;

		return this;
	}

	setOnError(taskService, options) {
		this._onErrorList[String(taskService.name ?? taskService.constructor.name)] = options;

		return this;
	}

	getOnNext(key?: string) {
		return key
			? this._onNextList[key]
			: this._onNextList;
	}

	getOnError(key?: string) {
		return key
			? this._onErrorList[key]
			: this._onErrorList;
	}

	start(...properties) {
		const propertiesProcessed = [ ...properties ];
		let name = this.getName(),
			options = propertiesProcessed[0];

		if (utilsCheckStrName(propertiesProcessed[0])
			&& utilsCheckObj(propertiesProcessed[1])) {
			name = propertiesProcessed[0];
			options = { ...propertiesProcessed[1] };
		}
		if (utilsCheckStrName(options['name'])) {
			name = options['name'];
		}
		const taskName = this.replicaService.prefix(`${this.type}|${name}`);

		(async () => {
			const data = JSON.stringify({ 
				...this.setOptions(options),
				...utilsCheckStrName(propertiesProcessed[0])
					? { name }
					: {},
			});

			return await this.takeOver(taskName, data);
		})();

		return this;
	}

	protected async takeOver(name: string, data): Promise<any> {
		return this;
	}

	protected async processWrapper(timestamp: Date) {
		const optionsProcessed = this.getOptions();

		try {
			const output = await this.process(timestamp, optionsProcessed['payload']);

			return await this.onNextWrapper(timestamp, optionsProcessed, output);
		}
		catch (err) {
			console.log('Task process error: ', err);

			await this.onErrorWrapper(err, timestamp, optionsProcessed);
		}
	}

	protected async onNextWrapper(timestamp: Date, options: object, output: any): Promise<any> {
		const onNextList = options['onNextList'] || {};
		const onNextListKeys = Object.keys(onNextList);
		let i = 0;

		while (i < onNextListKeys.length) {
			if (utilsCheckObj(onNextList[onNextListKeys[i]])) {
				delete onNextList[onNextListKeys[i]]['id'];

				if (utilsCheckObj(output)) {
					if (onNextList[onNextListKeys[i]]['mergeWithPrevResult'] === true
						&& utilsCheckObj(onNextList[onNextListKeys[i]]['payload'])) {
						onNextList[onNextListKeys[i]]['payload'] = {
							...output,
							...onNextList[onNextListKeys[i]]['payload'],
						};
					}
					else {
						onNextList[onNextListKeys[i]]['payload'][`PREV_OUTPUT`] = {
							task: this.constructor.name,
							data: output,
						};
					}
				}
				this.start(onNextListKeys[i], onNextList[onNextListKeys[i]]);
			}
			i++;
		}
		return await this.onNext(timestamp, await this.validateOutput(output));
	}

	protected async onErrorWrapper(err, timestamp: Date, options: object): Promise<any> {
		return await this.onError(err, timestamp, options['payload']);
	}

	protected async validateInputWrapper(options) {
		if (!utilsCheckObj(options)) {
			throw new Error(`Options is invalid format.`);
		}
		if (options['id'] && !utilsCheckStrId(options['id'])) {
			throw new Error(`Property id "${options['id']}" is not valid.`);
		}
		if (options['name'] && !utilsCheckStrName(options['name'])) {
			throw new Error(`Property name "${options['name']}" is not valid.`);
		}
		return {
			...options,
			payload: await this.validateInput(options['payload']),
		};
	}

	async process(timestamp: Date, payload: object): Promise<any> {
		return timestamp;
	}

	async onNext(timestamp: Date, data: any): Promise<any> {
	}

	async onError(err, timestamp: Date, data: any): Promise<any> {
	}

	async validateInput(data) {
		return data;
	}

	async validateOutput(data: any) {
		return data;
	}
}
