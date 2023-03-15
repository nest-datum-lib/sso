import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Injectable()
export class QueueService {
	protected tasklist = {};
	private maxWatch = 50;
	private times = 0;
	private taskIndex = 0;
	private taskLength = 0;

	getTaskList() {
		return this.tasklist;
	}

	getTaskListArr() {
		return Object.values(this.getTaskList());
	}

	getTask(taskName: string) {
		return this.tasklist[taskName];
	}

	setTask(taskModule, taskService) {
		const taskName = String(taskModule.name ?? taskModule.constructor.name);

		this.taskLength += 1;

		(async () => {
			const task = await NestFactory.create(taskModule);
			
			this.tasklist[taskName] = task.get(taskService);
			this.taskIndex += 1;
		})();

		return this;
	}

	start() {
		(async () => {
			if (this.taskLength === this.taskIndex) {
				const tasklistProcessed = await this.getTaskListArr();

				if (tasklistProcessed.length === 0) {
					throw new Error(`Task list is empty.`);
				}
				let i = 0;

				while (i < tasklistProcessed.length) {
					tasklistProcessed[i]['listen']();
					i++;
				}
				return;
			}
			else if (this.maxWatch > this.times) {
				await (new Promise((resolve, reject) => setTimeout(() => resolve(true), 200)));

				this.times += 1;
				this.start();
			}
		})();

		return this;
	}
}
