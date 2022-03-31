import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { Verification } from './users/verification.entity';
import { JwtMiddleware } from './jwt/jwt.middleware';

import * as Joi from 'joi';
// javaScript 로 만들어진 모듈일때 혹은 NestJS로 되어있지 않은 패키지를 import 할때
// import Joi from 'joi'; 로 import 할 시, 이는 export된 멤버가 아니기 때문이다.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 어플리케이션 어디서나 config 모듈에 접근할 수 있다.
      // global 모듈은 import해주지 않아도 된다.
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.env.dev'
          : process.env.NODE_ENV === 'test'
          ? '.env.test'
          : '.env.prod',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      // NODE_ENV 가 prod 일 때는 환경변수 파일들을 무시한다는 설정이다.
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
        //
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        // token은 유저의 개인정보를 넣는것이 좋지않다.
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      // 기본적으로 .env에서 읽어오는 변수는 모두 string 이기 때문에 number로 변화하기 위해서는 '+'를 붙여준다.
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // localhost의 경우 password는 안물어보게 되어있다.
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      // synchronize: true 는 TypeORM이 데이터베이스에 연결할 때, 데이터베이스를 자신의 모듈의 현재 상태로 마이그레이션 한다는 뜻
      logging: process.env.NODE_ENV !== 'prod',
      // true; 데이터베이스에서 무슨 일이 일어나는지 콘솔에 표시하는것
      entities: [User, Verification],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // driver 옵션은 ApolloDriver를 사용한다는 것이고, autoSchemaFile 옵션은 자동으로 생성된 스키마를 어떤 경로에 저장할 것인지 설정할 수 있다.
      // 또한 true 옵션을 주게 되면 스키마 파일을 생성하지 않고 메모리 상에서 스키마를 가지고 있게 설정한다.
      // 메모리 상에서 스키마를 가지고 있는다는 뜻은 gql 파일이 코드로 나타나지 않고, 파일로는 생성되지 않는다는 것을 의미한다.
      context: ({ req }) => ({}),
      // context가 함수로 정의되면, 매 request 마다 호출된다.
      // 이것은 req property를 포함한 object를 express로부터 받는다.
    }),
    UsersModule,

    // static module
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),

    // dynamic module 어떤 설정이 필요하다. // 또 다른 모듈을 반환해준다.
    // gql모듈에서 사용할 하위의 모듈을 import 한다.
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 미들웨어 컨슈머는 미들웨어를 라우트에 적용하는 방법을 정의해주는 인터페이스다.
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      // '/graphql'의 모든 라우트에 적용
      method: RequestMethod.POST,
      // path: '*',
      // method: RequestMethod.ALL,
    });
    // consumer.apply(JwtMiddleware).exclude({}) 특정경로 제외
  }
}
// 모든 app에서 미들웨어 사용하기 위함
// 특정 경로를 지정할수 있음(미들웨어)
