import { Body, Controller, Get, HttpCode, Param, Patch,  Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put("profile")
  async updateProfile(@CurrentUser("id") id: number, @Body() dto: UserDto) {
    return this.userService.updateProfile(id, dto);
  }

  @Auth()
  @Get("profile")
  async getProfile(@CurrentUser('id') userId: number) {
    return this.userService.getUser(userId);
  }

  @HttpCode(200)
  @Auth()
  @Patch("profile/favorites/:productId")
  async toggleFavorite(@Param("productId") productId: string, @CurrentUser("id") id: number) {
    return this.userService.toggleFavorite(id, +productId);
  }
}
