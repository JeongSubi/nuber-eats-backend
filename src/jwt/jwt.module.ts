import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Module({
  providers: [JwtService],
})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    // 또 다른 module을 반환해주는 module이다.
    return {
      module: JwtModule,
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, JwtService],
      // [Jwtervice]
      // [{ provide: 'Jwtervice', useValue: Jwtervice }]
      exports: [JwtService],
    };
  }
}
