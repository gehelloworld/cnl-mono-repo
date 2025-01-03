import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ConfigurationService } from '../configuration/configuration.service'; // Import ConfigurationService
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigurationService,
    private readonly authService: AuthService,
  ) {} // Inject ConfigurationService
  /*
    // Start Google OAuth flow
  @Get('google')  // Route will be /api/auth/google
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This redirects the user to Google's OAuth page
  }
     */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates the Google OAuth login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const token = await this.authService.generateJwt(req.user);

    const { env } = this.configService.getServerConfig();

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: env === 'production',
      sameSite: env === 'production' ? 'none' : 'lax',
      maxAge: 3600000, // 1 hour
    });

    const { host } = this.configService.getClientConfig();

    res.redirect(`${host}/profile`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    if (req.user) {
      return { profile: req.user };
    } else {
      throw new HttpException(
        'error: User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
