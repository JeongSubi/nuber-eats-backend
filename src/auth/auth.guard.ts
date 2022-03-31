import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// guard는 함수인데 request를 다름 단계로 진행할지 말지를 결정해준다.
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    // gql context로 바꿔주기 위함
    // context가 http로 되어있기 때문에 변환해 주어야 함
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
