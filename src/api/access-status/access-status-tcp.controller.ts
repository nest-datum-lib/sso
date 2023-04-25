import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AccessStatusTcpController as AccessStatusTcpControllerBase } from '@nest-datum/access';
import { AccessStatusService } from './access-status.service';

@Controller()
export class AccessStatusTcpController extends AccessStatusTcpControllerBase {
	constructor(
		protected service: AccessStatusService,
	) {
		super();
	}
}
