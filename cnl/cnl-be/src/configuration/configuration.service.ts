import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientConfig,
  GoogleAuthConfig,
  ServerConfig,
} from 'src/environments/environment';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  getClientConfig(): ClientConfig {
    return this.configService.getOrThrow<ClientConfig>('client');
  }

  getServerConfig(): ServerConfig {
    return this.configService.getOrThrow<ServerConfig>('server');
  }
  getGoogleConfig(): GoogleAuthConfig {
    return this.configService.getOrThrow<GoogleAuthConfig>('google');
  }

  getHost(): string {
    return this.getClientConfig().host;
  }

  getJwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  /*
  getAwsConfig(): AWSConfig {
    return this.configService.getOrThrow<AWSConfig>('aws');
  }
  */
}
