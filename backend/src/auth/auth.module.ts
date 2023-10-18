import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { GqlAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_ACCESS_TOKEN_SECRET')}`,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    { provide: APP_GUARD, useClass: GqlAuthGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
