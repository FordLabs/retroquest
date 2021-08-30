export class AuthService {
  static tokenKey = 'token';
  static tokenDuration = 1000 * 60 * 60 * 24 * 2;

  static setToken(token): void {
    const expiresDate = new Date(Date.now() + AuthService.tokenDuration);
    const expires = expiresDate.toUTCString();
    document.cookie = `${AuthService.tokenKey}=${token};expires=${expires};`;
  }

  static getToken() {
    let token = null;
    const cookie = document.cookie;
    const keyIndex = cookie.indexOf(`${AuthService.tokenKey}=`);
    if (keyIndex >= 0) {
      const cookieMinusKey = cookie.substr(keyIndex + AuthService.tokenKey.length + 1);
      token = cookieMinusKey.split(';')[0];
    }
    return token;
  }

  static clearToken(): void {
    document.cookie = `${AuthService.tokenKey}=;expires=-99999999;`;
  }
}
