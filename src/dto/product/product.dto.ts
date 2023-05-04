import { ArrayMinSize, IsNumber, IsOptional, IsString } from "class-validator";

export interface CharacteristicsDto {
    id: number;
    name: string;
    value: string;
}

export class ProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsString({each: true})
    @ArrayMinSize(1)
    images: string[];

    @IsOptional()
    characteristics: CharacteristicsDto[];

    categoryId: number | string;
}