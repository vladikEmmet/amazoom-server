import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../pagination.dto";

export enum ProductSort {
    HIGH_PRICE = "hight-price",
    LOW_PRICE = "low-price",
    NEWEST = "newest",
    OLDEST = "oldest",
}

export class GetAllProductDto extends PaginationDto {
    @IsOptional()
    @IsString()
    sort?: ProductSort;

    @IsOptional()
    @IsString()
    searchTerm?: string;
}