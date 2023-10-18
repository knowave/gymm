import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignInOutput } from './dto/sign-in.dto';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInOutput)
  async signIn(
    @Args('input') signInInput: SignInInput,
    @Context('res') res: Response,
  ) {
    const { ok, error, accessToken, refreshToken, user } =
      await this.authService.signIn(signInInput);

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      path: '/refresh',
      secure: true,
    });

    return { ok, error, accessToken, user };
  }
}
