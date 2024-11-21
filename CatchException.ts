import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

// bắt lỗi 404
@Catch(NotFoundException)
/**lớp custom lỗi 404 */
export class Catch404Exception implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    /**lấy response và request từ host */
    const CTX = host.switchToHttp()
    /**lấy response */
    const RES = CTX.getResponse<IRes>()
    /**lấy request */
    const REQ = CTX.getRequest<IReq>()

    // trả về lỗi 404
    RES.notFound(REQ.url)
  }
}

// bắt lỗi 500
@Catch()
/**lớp custom lỗi 500 */
export class Catch500Exception implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    /**lấy response và request từ host */
    const CTX = host.switchToHttp()
    /**lấy response */
    const RES = CTX.getResponse<IRes>()

    // in ra lỗi
    Logger.error(exception?.stack || exception?.message || exception, '500')

    // trả về lỗi 500
    RES.serverError(exception.message || exception)
  }
}

/**lớp factory tạo ra provider bắt lỗi */
export class FactoryCatchException {
  /**lấy provider */
  static getProvider() {
    return [
      { provide: APP_FILTER, useClass: Catch404Exception },
      { provide: APP_FILTER, useClass: Catch500Exception },
    ]
  }
}
