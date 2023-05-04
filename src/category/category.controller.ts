import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CategoryDto } from 'src/dto/category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":id")
  async updateCategory(@Param("id") id: string, @Body() dto: CategoryDto) {
    return this.categoryService.updateCategory(+id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Post()
  async createCategory(@Body() dto: CategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAll();
  }
  
  @Get("by-slug/:slug")
  async getBySlug(@Param("slug") slug: string) {
    return this.categoryService.getBySlug(slug);
  }

  @HttpCode(200)
  @Auth()
  @Delete(":id")
  async removeCategory(@Param("id") categoryId: string) {
    return this.categoryService.removeCategory(+categoryId);
  }
}
