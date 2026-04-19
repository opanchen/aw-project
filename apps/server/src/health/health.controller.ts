import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  // HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheck: HealthCheckService,
    private readonly mongooseCheck: MongooseHealthIndicator
    // TODO: Implement http connection check later
    // private readonly httpCheck: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheck.check([() => this.mongooseCheck.pingCheck('mongodb')])
  }
}
