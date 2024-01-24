class ErrorClass extends Error {
  private errorCode: number;
  private errorMsg: string;

  constructor(errorCode: number, errorMsg: string) {
    super(errorMsg);
    this.errorCode = errorCode;
    this.errorMsg = errorMsg;
  }

  private static __ErrorMap(error: ErrorClass): number {
    return {
      [ErrorClass.InvalidParameters]: 2000,
      [ErrorClass.VerifyFailure]: 2001,
      [ErrorClass.InvalidFormatData]: 2002,
    }[error];
  }

  /**
   * @function isTypeOf
   * @param {*} error
   * @param {*} ErrorType
   */
  static isTypeOf(error: ErrorClass, ErrorType: ErrorClass): boolean {
    if (!error) return false;
    return error.errorCode === ErrorClass.__ErrorMap(ErrorType);
  }

  /**
   * 非法参数
   */
  static InvalidParameters(errorMsg?: string): ErrorClass {
    return new ErrorClass(2000, errorMsg || "invalid parameters");
  }

  /**
   * 验证失败
   */
  static VerifyFailure(errorMsg?: string): ErrorClass {
    return new ErrorClass(2001, errorMsg || "verify failure");
  }

  /**
   * 数据格式不正确
   */
  static InvalidFormatData(errorMsg?: string): ErrorClass {
    return new ErrorClass(2002, errorMsg || "invalid format data");
  }
}

export default ErrorClass;
