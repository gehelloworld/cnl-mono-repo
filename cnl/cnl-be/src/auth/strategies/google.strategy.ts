import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(configService: ConfigurationService) {
    super({
      clientID: configService.getGoogleConfig().clientId,
      clientSecret: configService.getGoogleConfig().clientSecret,
      // need to be added to Authorized redirect URIs in Google Cloud Console
      // APIs & Services > Crendentials > Web client 1 > Authorized redirect URIs
      callbackURL: configService.getGoogleConfig().callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: responseProfile,
    done: (error: unknown, user?: unknown) => void,
  ) {
    const { name, emails, photos } = profile;
    //Logger.log('profile***', JSON.stringify(profile));
    const user = {
      email: emails[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos[0]?.value,
      accessToken,
    };
    done(null, user); // Ensure the user is passed to `done`
  }
}

//temp
export type responseProfile = {
  emails: { value: string; verified: boolean }[];
  name: { familyName: string; givenName: string };
  photos: { value: string }[];
};
