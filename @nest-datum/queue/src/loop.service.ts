import { func as utilsCheckFunc } from '@nest-datum-utils/check';

const _timeouts = {
	example: {
		loop: (async () => {}),
		task: [],
		exists: false,
	},
};

export class LoopService {
	private _eventHandlers = {};

	eventHandlers(data) {
		return (this._eventHandlers = data);
	}

	async set(loopName: string, delay: number = 0, callback): Promise<any> {
		if (!_timeouts[loopName]) {
			_timeouts[loopName] = {
				loop: (async () => {}),
				task: [],
				exists: false,
			};
		}
		_timeouts[loopName].task.push(callback);

		if (!_timeouts[loopName].exists) {
			_timeouts[loopName].exists = true;
			_timeouts[loopName]['loop'] = await this.processTimeout(loopName, delay);

			utilsCheckFunc(_timeouts[loopName]['loop'])
				&& (await _timeouts[loopName]['loop']());
		}
		return true;
	}

	private async processTimeout(loopName: string, delay: number = 0): Promise<any> {
		return async () => {
			let i = 0;

			while (i < _timeouts[loopName]['task'].length) {
				const taskProcess = _timeouts[loopName]['task'][i];

				await taskProcess(new Date);
				i++;
			}
			await (new Promise((resolve, reject) => setTimeout(() => resolve(true), delay)));
			await _timeouts[loopName]['loop']();
		};
	}
}
