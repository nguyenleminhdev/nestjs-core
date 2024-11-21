/**lớp cha để tạo ra các lớp lỗi dựa theo tên của lớp */
export class CustomError extends Error {
  constructor(message: string) {
    // gọi hàm khởi tạo của lớp cha
    super(message)

    // thiết lập tên của lỗi bằng tên của lớp
    this.name = this.constructor.name
  }
}
