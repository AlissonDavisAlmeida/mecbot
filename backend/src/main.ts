/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';

async function bootstrap() {

  const doubleCsrfOptions: DoubleCsrfConfigOptions = {
  getSecret: (req) => {
    // In a real application, you would want to store this secret in a secure location, such as a database or environment variable.
    // For this example, we'll just return a static secret. In production, you should use a unique secret for each user/session.
    return 'my-secret-key';
  },
  cookieName: 'XSRF-TOKEN', // The name of the cookie to store the CSRF token in. Defaults to 'XSRF-TOKEN'.
  cookieOptions: {
    httpOnly: true, // Whether the cookie should be HTTP-only. Defaults to true.
    secure: process.env.NODE_ENV === 'production', // Whether the cookie should be secure. Defaults to true in production.
    sameSite: 'strict', // The SameSite attribute for the cookie. Defaults to 'strict'.
  },
  getSessionIdentifier: (req) => {
    // This function should return a unique identifier for the user's session. This is used to associate the CSRF token with the user's session. In a real application, you would typically use the user's session ID or user ID for this purpose.
    // For this example, we'll just return a static identifier. In production, you should use a unique identifier for each user/session.
    return 'user-session-id';
  }
  }

  const {
  // invalidCsrfTokenError, // This is provided purely for convenience if you plan on creating your own middleware.
  // generateToken, // Use this in your routes to generate and provide a CSRF hash, along with a token cookie and token.
  // validateRequest, // Also a convenience if you plan on making your own middleware.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf(doubleCsrfOptions);

  const app = await NestFactory.create(AppModule);

  app.use(helmet())
  app.use(doubleCsrfProtection);
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
