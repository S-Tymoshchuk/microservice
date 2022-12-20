import { Injectable } from '@nestjs/common';
import { JwtService as Jwt, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { User } from '@database/entities/user.entity';
import { RoleEnum } from '../common/types/role.enum';
import { JwtConfig } from '@config/configuration';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JwtService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  private jwtConfig: JwtConfig;

  constructor(private readonly jwt: Jwt, private readonly configService: ConfigService) {
    this.jwtConfig = configService.get<JwtConfig>('jwt');
  }

  public async generateToken(user: User): Promise<string> {
    const authInfo: AuthInfo = { sub: user.id, email: user.email, role: user.role };
    return this.createToken(authInfo, this.jwtConfig.accessTokenPrivateKey, this.jwtConfig.accessTokenExpiresIn);
  }

  // add separated private and public keys and expire time to .env
  public async generateRefreshToken(user: User): Promise<string> {
    return this.createToken({ sub: user.id }, this.jwtConfig.refreshTokenPrivateKey, this.jwtConfig.refreshTokenExpiresIn);
  }

  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public verify(token: string, publicKey: string) {
    try {
      return this.jwt.verify(token, { publicKey });
    } catch (err) {
      throw new RpcException('JWT is not valid.');
    }
  }

  verifyAccessToken(token: string): AuthInfo {
    return this.verify(token, this.jwtConfig.accessTokenPublicKey);
  }

  verifyRefreshToken(token: string): AuthRefreshInfo {
    return this.verify(token, this.jwtConfig.refreshTokenPublicKey);
  }

  createToken(payload, privateKey, expiresIn): string {
    const options = {
      algorithm: 'RS256',
      expiresIn,
      privateKey,
    } as JwtSignOptions;
    return this.jwt.sign(payload, options);
  }
}

export interface AuthInfo {
  sub: string;
  email: string;
  role: RoleEnum;
}

export interface AuthRefreshInfo {
  sub: string;
}
