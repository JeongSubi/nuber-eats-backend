import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
    private readonly ConfigService: ConfigService, // global 모듈이기 때문에 다른 모듈에서 불러올수 있다.
  ) {}

  sign(userId: number): string {
    // return jwt.sign(userId, this.options.privateKey); 아래와 같음 , 대신 private 해줘야함
    return jwt.sign({ id: userId }, this.ConfigService.get('PRIVATE_KEY'));
  }
  //    return jwt.sign(String( id: userId ), this.ConfigService.get('PRIVATE_KEY'));

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
    // verify 는 string이나 object 를 return함
  }
}
