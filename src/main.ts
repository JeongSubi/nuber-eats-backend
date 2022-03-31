import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 비동기 함수가 포함되어 있어 응용 프로그램을 bootstrap( Load )한다.
  // NestFactory가 사용되는데
  // 가장 기본적인 Class이며 애플리케이션 인스턴스를 생성 할 수 있는 몇 가지 정적 메서드를 제공해준다.

  https: app.useGlobalPipes(new ValidationPipe());
  // app.use(jwtMiddleware);
  // 어플리케이션 전체에서 사용 가능 혹은,,
  // repository 혹은 class, dependenct injection을 사용해야 할때 app.use에 middleware 넣을수 없음
  // app.use()는 functional middleware 만 사용 가능하다.
  await app.listen(3000);
}
bootstrap();
