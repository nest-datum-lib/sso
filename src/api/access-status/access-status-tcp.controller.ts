import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { AccessStatusTcpController as AccessStatusTcpControllerBase } from '@nest-datum/access';
import { AccessStatusService } from './access-status.service';

@Controller()
export class AccessStatusTcpController extends AccessStatusTcpControllerBase {
	constructor(
		protected transportService: TransportService,
		protected entityService: AccessStatusService,
	) {
		super();
	}
}
