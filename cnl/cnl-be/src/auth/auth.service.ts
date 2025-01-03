import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { MappedGoogleUser } from 'src/types/user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private scope = 'email profile';
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigurationService,
  ) {}

  clientRedirectUri(): string {
    const { host: clientHost = '' } = this.configService.getClientConfig();
    return `${clientHost}/profile`;
  }

  async generateJwt(user: MappedGoogleUser) {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.picture,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  // loginRedirectUri(): string {

  // todo
  async login(user: { email: string; userId: string }) {
    const payload = { username: user.email, sub: user.userId };

    // expire in..

    return {
      access_token: this.jwtService.sign(payload), // Generates JWT token
    };
  }
}
