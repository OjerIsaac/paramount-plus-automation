import { PaginationResultDto } from '../queries/pagination.dto';

export class HttpResponse {
  static success(payload: { data?: any; message: string; statusCode: number }) {
    const response: any = {
      message: payload.message,
      statusCode: payload.statusCode,
    };

    if (payload.data instanceof PaginationResultDto) {
      response.data = payload.data.data;
      response.meta = payload.data.meta;
    } else if (payload.data !== undefined) {
      response.data = payload.data;
    }

    return response;
  }
}
