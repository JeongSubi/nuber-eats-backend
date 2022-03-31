import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { number } from 'joi';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver((of) => Restaurant) // @Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  // restaurant resolver에 restaurant service를 주입한다. resolver에서 service에 있는 메서드를 호출할 수 있게 됐다.

  @Query((returns) => Boolean)
  //   @Query(() => Boolean)
  isPizzaGood(): boolean {
    return true;
  }

  @Query((returns) => Restaurant)
  myRestaurant() {
    return true;
  }

  // @Query((returns) => [Restaurant])
  // restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
  //   return [];
  // }

  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  // @Mutation((returns) => Boolean)
  // createRestaurant(
  //   @Args('name') name: string,
  //   @Args('isVegan') isVegan: boolean,
  //   @Args('address') address: string,
  //   @Args('ownerName') ownerName: string,
  // ): boolean {
  //   return true;
  // }

  @Mutation((returns) => Boolean)
  async createRestaurant(
    // @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantDto,
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation((returns) => Boolean)
  async updateRestaurnt(
    // @Args('id') id: number,
    // @Args('data') data: UpdateRestaurantDto,
    @Args() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (e) {
      return false;
    }
  }
}
