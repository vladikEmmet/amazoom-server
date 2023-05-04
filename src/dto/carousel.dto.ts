import { ArrayMinSize, IsOptional, IsString } from "class-validator";

export class CarouselItemDto{
    @IsString()
    image: string;

    @IsString()
    title: string;
}

export class CarouselDto {
    @IsString()
    name: string;
    
    items: CarouselItemDto[];
}