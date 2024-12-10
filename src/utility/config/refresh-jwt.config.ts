import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRETE,
    expiresIn: process.env.REFRESH_JWT_EXPIRE_IN,
  }),
);
