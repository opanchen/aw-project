import { Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { MongooseModule } from '@nestjs/mongoose'
import { Connection, ConnectionStates } from 'mongoose'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('mongodbUri'),
        connectionFactory: (connection: Connection) => {
          const logger = new Logger('MongooseModule')

          if (connection.readyState === ConnectionStates.connected) {
            logger.log('🟢 MongoDB connected')
          }

          connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
          connection.on('reconnected', () => logger.log('MongoDB reconnected'))
          connection.on('error', error => logger.error('MongoDB error', error))
          return connection
        },
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
