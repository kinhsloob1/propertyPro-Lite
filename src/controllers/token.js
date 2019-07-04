import { createHmac } from 'crypto';

class Token extends Map {
  constructor(options = {}) {
    super();
    const { algorithim = 'HS512', secret = 'PropertyProLite' } = options;
    this.setValid(false);
    this.setSecret(secret);
    this.setAlgorithim(algorithim);
  }

  static model() {
    return new Token();
  }

  decode(token = null) {
    if (typeof token !== 'string') {
      return this.setValid(false);
    }

    const jwtParts = token.split('.');
    if (jwtParts.length !== 3) {
      return this.setValid(false);
    }

    const [headerPartUrlString, payloadPartUrlString, signaturePartUrlString] = jwtParts;
    let payloadPart = null;
    let headerPart = null;

    try {
      headerPart = JSON.parse(Token.base64UrlDecode(headerPartUrlString));
      headerPart = new Map(Object.entries(headerPart));
      payloadPart = JSON.parse(Token.base64UrlDecode(payloadPartUrlString));
    } catch (e) {
      return this.setValid(false);
    }

    const alg = headerPart.get('alg');
    const type = headerPart.get('type');

    if (!((type === 'JWT') && (alg === this.getAlgorithim()))) {
      return this.setValid(false);
    }

    let receivedSignature = this.generateSignaturePart(headerPartUrlString, payloadPartUrlString);
    receivedSignature = Token.base64UrlEncode(receivedSignature, true);

    if (receivedSignature !== signaturePartUrlString) {
      return this.setValid(false);
    }

    const expires = payloadPart.expires || 0;
    if (Date.now() > expires) {
      return this.setValid(false);
    }

    Array.from(Object.entries(payloadPart)).forEach(([key, value]) => {
      this.set(key, value);
    });

    return this.setValid(true);
  }

  static base64UrlEncode(data, isBase64 = false) {
    let string = String(data);
    if (!isBase64) {
      string = Buffer.from(string, 'utf8').toString('base64');
    }

    return string.replace('+', '-').replace('/', '_');
  }

  static base64UrlDecode(data, isBase64 = false) {
    let string = String(data);
    if (!isBase64) {
      string = string.replace('-', '+').replace('_', '/');
    }

    return Buffer.from(string, 'base64').toString('utf8');
  }

  encode(userData = null) {
    if (!((typeof userData === 'object') && (!Array.isArray(userData)))) {
      return this.setValid(false);
    }

    let headerPartString = JSON.stringify({
      alg: this.getAlgorithim(),
      type: 'JWT',
    });
    headerPartString = Token.base64UrlEncode(headerPartString);

    let payloadPartString = JSON.stringify({
      ...userData,
      expires: (Date.now() + (1 * 24 * 60 * 60 * 1000)),
    });

    payloadPartString = Token.base64UrlEncode(payloadPartString);

    let signaturePartString = this.generateSignaturePart(headerPartString, payloadPartString);
    if (!signaturePartString) {
      return this.setValid(false);
    }
    signaturePartString = Token.base64UrlEncode(signaturePartString, true);

    return this
      .setValid(true)
      .setJwt(`${headerPartString}.${payloadPartString}.${signaturePartString}`);
  }

  setJwt(jwt) {
    return this.set('_jwt', jwt);
  }

  getJwt() {
    return this.get('_jwt');
  }

  generateSignaturePart(headerPartUrlString = null, payloadPartUrlString = null) {
    try {
      return createHmac('sha512', this.getSecret()).update(`${headerPartUrlString}.${payloadPartUrlString}`, 'utf8').digest('base64');
    } catch (e) {
      return false;
    }
  }

  getAlgorithim() {
    return this.get('_algorithim');
  }

  setAlgorithim(algorithim) {
    this.set('_algorithim', algorithim);
    return this;
  }

  getSecret() {
    return this.get('_secret');
  }

  setSecret(secret) {
    this.set('_secret', secret);
    return this;
  }

  setValid(type = true) {
    this.set('_isValid', Boolean(type));
    return this;
  }

  isValid() {
    return (this.has('_isValid') && (this.get('_isValid') !== false));
  }
}

export const { model: JwtManager } = Token;
export default Token;
