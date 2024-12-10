import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRETE,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRE_IN,
    },
  }),
);
