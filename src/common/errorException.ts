import { HttpException, HttpStatus } from '@nestjs/common';
import { NOT_FOUND_MESSAGE } from '../consts/consts';

class ErrorException {
  notFoundException(entity: string) {
    throw new HttpException(
      `${entity} ${NOT_FOUND_MESSAGE}`,
      HttpStatus.NOT_FOUND,
    );
  }

  unprocessableException(entity: string) {
    throw new HttpException(
      `${entity} ${NOT_FOUND_MESSAGE}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  forbiddenException(message: string) {
    throw new HttpException(message, HttpStatus.FORBIDDEN);
  }

  conflictException(message: string) {
    throw new HttpException(message, HttpStatus.CONFLICT);
  }
}

const errorException = new ErrorException();
export default errorException;
