import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export const AlreadyRegisteredException = new ConflictException(
  'email is already registered',
);

export const InternalServiceException = new InternalServerErrorException(
  'something went wrong. please try again after some time.',
);
