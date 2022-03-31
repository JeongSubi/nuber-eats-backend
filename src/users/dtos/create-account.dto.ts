import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}
// mapTypes는 input타입만 가질수 있다.
// pickType은 class를 가지는데, 우리의 경우엔 User랑 우리가 가지고 싶은걸 고를수 있다.
// input type에서 몇가지 property를 선택해 새로운 class를 만들어준다.

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
