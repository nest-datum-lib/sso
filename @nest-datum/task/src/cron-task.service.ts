import { Injectable } from '@nestjs/common';
import { TaskService } from './task.service';

@Injectable()
export class CronTaskService extends TaskService {
	private _notClose = false;
	protected type = 'cron';

	setNotClose(flag: boolean = true) {
		this._notClose = flag;

		return this;
	}

	protected async takeOver(name: string, data): Promise<any> {
		try {
			return await this.processWrapper(new Date());
		}
		catch (err) {
			console.log(`Cron task "${this.constructor.name} error. [${err.message}]"`);
		}
	}

	protected async onNextWrapper(timestamp: Date, options: object, output: any): Promise<any> {
		if (!this._notClose) {
			setTimeout(this.getModule().close, Number(process.env.CRON_CLOSE_TASK_TIMEOUT || 1000));
		}
		return await super.onNextWrapper(timestamp, options, output);
	}
}
