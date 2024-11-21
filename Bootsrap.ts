import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app/app.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

/**khởi động ứng dụng */
export interface IBootsrap {}

/**khởi động ứng dụng */
export class Bootsrap {
  async exec() {
    /**máy chủ được tạo */
    const APP = await NestFactory.create(
      // nạp module gốc của ứng dụng
      AppModule,
      // cấu hình ngăn chặn máy chủ thoát khi có lỗi
      { abortOnError: false },
    )

    /**dịch vụ cấu hình */
    const SERVICE_CONFIG = APP.get(ConfigService)

    /**cổng */
    const PORT = SERVICE_CONFIG.get<number>('app.port') || 1355
    /**địa chỉ */
    const HOST = SERVICE_CONFIG.get<string>('app.host') || '0.0.0.0'
    /**tiền tố của các route */
    const API_PREFIX = SERVICE_CONFIG.get<string>('app.prefix')

    // nếu có tiền tố thì sử dụng tiền tố
    if (API_PREFIX) APP.setGlobalPrefix(API_PREFIX)

    // khởi động máy chủ lắng nghe request
    await APP.listen(PORT, HOST)

    // Sử dụng Logger để in ra lời chào mừng
    Logger.log(
      `Application is running on: http://${HOST}:${PORT}/${API_PREFIX || ''}`,
      'Bootstrap',
    )
    Logger.log('Welcome to the NestJS application!', 'Bootstrap')
  }
}

/**lớp factory tạo ra Bootsrap */
export class FactoryBootsrap {
  /**tạo Bootsrap */
  static create() {
    // trả về Bootsrap
    return new Bootsrap()
  }
}
