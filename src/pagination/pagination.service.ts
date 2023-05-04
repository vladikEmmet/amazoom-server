import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class PaginationService {
    getPagination(dto: PaginationDto, defaultLimit = 20) {
        const page = dto.page ? +dto.page : 1;
        const limit = dto.limit ? +dto.limit : defaultLimit;
        const offset = (page - 1) * limit;

        return { page, limit, offset };
    }
}
