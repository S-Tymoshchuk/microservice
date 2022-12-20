import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthName, AuthService, GetUsersByIdResponse } from 'clap-proto';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class AuthContService implements OnModuleInit {
  private svc: AuthService;

  @Inject(AuthName)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthService>('AuthService');
  }

  getUsersById(users: string[], metadata: Metadata): Observable<GetUsersByIdResponse> {
    return this.svc.getUsersById({ users }, metadata);
  }

  countUserSubscribe(userId: string, metadata) {
    return firstValueFrom(this.svc.getCountSubscribeById({ id: userId }, metadata));
  }
}
