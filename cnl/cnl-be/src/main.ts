import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

import { AppModule } from './app.module';
import { ConfigurationService } from './configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // Set global prefix for all routes

  const configService = app.get(ConfigurationService);

  const { host } = configService.getClientConfig(); // FE
  const { port } = configService.getServerConfig();

  app.use(passport.initialize());

  app.use(cookieParser());
  app.enableCors({
    //! replace this with an env varialbe
    origin: host,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Enable credentials (cookies)
    allowedHeaders: 'Content-Type, Authorization, X-PubDash-ID, Set-Cookie',
    optionsSuccessStatus: 200, // For legacy browsers support

    preflightContinue: false,
  });

  await app.listen(port || 4000, '0.0.0.0');
}
bootstrap();
