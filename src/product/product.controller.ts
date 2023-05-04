import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { GetAllProductDto } from 'src/dto/product/getAllProducts.dto';
import { ProductDto } from 'src/dto/product/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto);
  }

  @Get("similar/:id")
  async getSimilarProducts(@Param("id") id: string) {
    return this.productService.getSimilar(+id);
  }

  @Get("by-slug/:slug")
  async getBySlug(@Param("slug") slug: string) {
    return this.productService.getProductBySlug(slug);
  }
  
  @Get("by-category/:categorySlug")
  async getProductByCategory(@Param("categorySlug") categorySlug: string) {
    return this.productService.byCategory(categorySlug);
  }

  @Get(":id")
  @Auth()
  async getProduct(@Param("id") id: string) {
    return this.productService.getProduct(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createProduct(@Body() dto: ProductDto) {
    return this.productService.createProduct(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":id")
  async updateProduct(@Param("id") id: string, @Body() dto: ProductDto) {
    return this.productService.updateProduct(+id, dto);
  }


  @HttpCode(200)
  @Auth()
  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    return this.productService.removeProduct(+id);
  }
  
}
