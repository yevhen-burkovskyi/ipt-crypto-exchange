import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseNames } from 'src/core/enums/db.enum';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';
import migrations from 'src/core/migrations/migrations.list';
import configuration from 'src/core/lib/config/init';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: <DatabaseNames.postgres>configService.get('database.type'),
        host: configService.get('database.host'),
        port: Number.parseInt(configService.get('database.port')),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: <string>configService.get('database.database'),
        autoLoadEntities: <boolean>(
          configService.get('database.autoLoadEntities')
        ),
        synchronize: <boolean>configService.get('database.synchronize'),
        migrationsRun: configService.get('database.migrationsRun'),
        migrations,
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
  ],
})
export class AppModule {}
