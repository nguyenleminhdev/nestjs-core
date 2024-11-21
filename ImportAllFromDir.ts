import { Injectable } from '@nestjs/common'
import { readdirSync } from 'fs'
import { join } from 'path'

/**dữ liệu của file */
type IFileData<T> = {
  /**tên file */
  name: string
  /**dữ liệu của file */
  data: T
}

@Injectable()
/**tiêm toàn bộ các phương thức trong thư mục vào đối tượng */
export class ImportAllFromDir<T> {
  /**
   * thực thi
   * @param dir_path đường dẫn tới thư mục chứa các phương thức
   * @param postfix hậu tố của file chứa phương thức
   */
  exec(dir_path: string, postfix: string): IFileData<T>[] {
    /**đường dẫn tới thư mục chứa các phương thức */
    const DIR_FULL_PATH = join(process.cwd(), dir_path)

    // trả về dữ liệu
    return (
      // duyệt qua các file trong thư mục
      readdirSync(DIR_FULL_PATH)
        // nhập từng file
        .map(file => {
          // chỉ xử lý các file khớp với hậu tố
          if (!file.endsWith(postfix)) return

          /**đường dẫn tới file */
          const FULL_PATH = join(DIR_FULL_PATH, file)

          // trả về dữ liệu của default
          return {
            name: file,
            data: require(FULL_PATH).default,
          }
        })
        .filter(Boolean) as IFileData<T>[]
    )
  }
}
