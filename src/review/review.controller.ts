import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { ReviewDto } from 'src/dto/review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes()
  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @UsePipes()
  @HttpCode(200)
  @Post("send/:productId")
  @Auth()
  async sendReview(@CurrentUser("id") id: number, @Body() dto: ReviewDto, @Param("productId") productId: string) {
    return this.reviewService.createReview(id, dto, +productId);
  }

  @Get("average-by-product/:productId")
  async getAverageByProduct(@Param("productId") productId: string) {
    return this.reviewService.getAverrageProductRating(+productId);
  }

  @Delete(":reviewId")
  @HttpCode(200)
  @Auth()
  async deleteReview(@CurrentUser("id") userId: number, @Param("reviewId") reviewId: string) {
    return this.reviewService.deleteReview(+reviewId, userId);
  }
}
