import { PaginationDto } from '../queries/page-options.dto';

export interface PageMetaDtoParameters {
  pageOptionsDto: PaginationDto;
  itemCount: number;
}
