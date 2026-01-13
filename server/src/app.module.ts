import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Cargamos el módulo de configuración globalmente
    ConfigModule.forRoot({
      isGlobal: true, // Para que funcione en todos los módulos sin volver a importar
    }),

    // 2. 'TypeOrmModule.forRootAsync' para poder inyectar la configuración
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'), //  .env
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ Solo para desarrollo, desactivar en producción
      }),
      inject: [ConfigService],
    }),

    // 3. Módulos de recursos
    UsersModule,
    RoomsModule,
    ReservationsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }