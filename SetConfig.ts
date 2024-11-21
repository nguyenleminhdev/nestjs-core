import { ImportAllFromDir } from '@/core/ImportAllFromDir'
import { NotFoundError } from '@/error/NotFound'

/**lấy cấu hình môi trường hiện tại */
export interface ISetConfig {
  exec(): IEnv
}

/**lấy cấu hình môi trường hiện tại */
export class SetConfig {
  /**
   * @param SERVICE_IMPORT_ALL_FROM_DIR dịch vụ nhập toàn bộ dữ liệu trong 1 thư mục
   */
  constructor(
    private readonly SERVICE_IMPORT_ALL_FROM_DIR = new ImportAllFromDir<IEnv>(),
  ) {}

  exec(): IEnv {
    /**đuôi file */
    const FILE_EXT = '.env.js'

    /**các biến môi trường */
    const ENVS = new Map<string, IEnv>()

    // nạp tất cả các file môi trường
    this.SERVICE_IMPORT_ALL_FROM_DIR.exec('dist/config/env', FILE_EXT).forEach(
      ({ name, data }) => {
        /**tên môi trường */
        const ENV_NAME = name.replace(FILE_EXT, '')

        // nạp dữ liệu môi trường
        ENVS.set(ENV_NAME, data)
      },
    )

    /**thiết lập của môi trường hiện tại */
    const CURRENT_ENV = ENVS.get(process.env.NODE_ENV || 'development')

    // nếu không tìm thấy cấu hình môi trường thì báo lỗi hệ thống
    if (!CURRENT_ENV) throw new NotFoundError('ENV')

    // trả về cấu hình môi trường hiện tại
    return CURRENT_ENV
  }
}
