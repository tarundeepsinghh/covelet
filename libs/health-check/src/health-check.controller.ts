import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {
  @Get()
  async healthCheck() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const uptime = process.uptime();
    const metrics = {
      memory: memUsage,
      cpu: cpuUsage,
      uptime,
    };
    return metrics;
  }
}
