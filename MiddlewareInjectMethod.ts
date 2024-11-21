import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'
import { ImportAllFromDir } from './ImportAllFromDir'

// trang trí lớp ResponseMiddleware bằng @Injectable
@Injectable()
/**chỉnh sửa lại các phương thức response gốc của server */
export class MiddlewareInjectMethod implements NestMiddleware {
  /**
   * @param SERVICE_IMPORT_ALL_FROM_DIR dịch vụ nhập toàn bộ dữ liệu trong 1 thư mục
   */
  constructor(
    private readonly SERVICE_IMPORT_ALL_FROM_DIR: ImportAllFromDir<IInjectReqRes>,
  ) {}

  /**thao tác vào req, res, next */
  async use(req: IReq, res: IRes, next: NextFunction) {
    // tiêm các custom request vào req gốc
    this.SERVICE_IMPORT_ALL_FROM_DIR.exec('dist/api/request', '.req.js')
      .filter(({ data: req_fn }) => typeof req_fn === 'function')
      .forEach(({ data: req_fn }) => req_fn(req))

    // tiêm các custom response vào res gốc
    this.SERVICE_IMPORT_ALL_FROM_DIR.exec('dist/api/response', '.res.js')
      .filter(({ data: res_fn }) => typeof res_fn === 'function')
      .forEach(({ data: res_fn }) => res_fn(res))

    // tiếp tục chạy các middleware tiếp theo
    next()
  }
}
