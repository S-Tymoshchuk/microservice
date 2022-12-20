import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { JwtService } from './service/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@database/entities/user.entity';
import { Role } from '@database/entities/role.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtConfig } from '@config/configuration';
import { PassportModule } from '@nestjs/passport';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { UserFollowerEntity } from '@database/entities/user-folower.entity';
import { AdminService } from './service/admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role, UserFollowerEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configurationService: ConfigService) => {
        const config = configurationService.get<JwtConfig>('jwt');
        return {
          privateKey: config.accessTokenPrivateKey,
          publicKey: config.accessTokenPublicKey,
          signOptions: {
            expiresIn: config.accessTokenExpiresIn,
            algorithm: 'RS256',
          },
        };
      },
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configurationService: ConfigService) => ({
        ...configurationService.get<MailerOptions>('email'),
      }),
    }),
  ],
  controllers: [AuthController, AdminController],
  providers: [AuthService, JwtService, JwtStrategy, AdminService],
})
export class AuthModule {}
