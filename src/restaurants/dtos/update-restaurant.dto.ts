import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { type } from 'os';
import { CreateRestaurantDto } from './create-restaurant.dto';

// 기본적으로 하나의 object로 본다. argument로써 graphql에 전달하기 위한 용도, 이때는 object를 전달해야한다.
@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

@ArgsType()
export class UpdateRestaurantDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
// Restaurant이 아니라 CreateRestaurantDto를 PartialType으로 하는 이유는
// UpdateRestauranDto에 id가 꼭 필요하기 때문이다.
// (만약 Restaurant을 PartialType으로 만들지않으면 id도 옵션사항이 된다.)

// Partial Type => base class를 가져다가 export하고 이 모든 field가 required가 아닌 class를 만들어준다.
