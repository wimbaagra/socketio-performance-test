const ACCESS_TOKEN_PAYLOAD = {
  "sub": "jenius_usersync005@sit.com",
  "cts": "OAUTH2_STATELESS_GRANT",
  "auth_level": 0,
  "auditTrackingId": "5b1357ac-c479-4527-b02f-dc82487cec3e-1192484",
  "iss": "http://oamsit.dev.corp.btpn.co.id/openam/oauth2/realms/root/realms/jenius",
  "tokenName": "access_token",
  "token_type": "Bearer",
  "authGrantId": "Pq8LPJ1OllqiWSJX7ft11Hjq5tw",
  "nonce": "random",
  "aud": "jenius",
  "grant_type": "authorization_code",
  "scope": [
    "openid",
    "profile",
    "login:password",
    "lsec"
  ],
  "realm": "/jenius",
  "jti": "kLGT9DtH8IlCyycKAZH08O1e7yg"
};

const ID_TOKEN_PAYLOAD = {
  "at_hash": "zjr2ybLyWiruBaACZVL-dQ",
  "sub": "jenius_usersync005@sit.com",
  "cif": "5870D6",
  "telephoneNumber": "+628987721325",
  "auditTrackingId": "5b1357ac-c479-4527-b02f-dc82487cec3e-1191621",
  "iss": "http://oamsit.dev.corp.btpn.co.id/openam/oauth2/realms/root/realms/jenius",
  "tokenName": "id_token",
  "uid": "744217dd-eced-4939-853a-9829e0bd20d0",
  "acr": "0",
  "cashtag": "usersync005",
  "azp": "jenius",
  "passwordReset": "false",
  "email": "jenius_usersync005@sit.com",
  "avatarUrl": "736833c49a345e64d0ff32f26e900f3794a88f1d/public-avatar/self/2022-03-10T07:04:33.340Z.jpeg",
  "cn": "CUSTOMER 5870D6",
  "accountNumber": "90370000472",
  "nonce": "random",
  "jenius": "s:NORMAL,a:5cac370785c37944aa3b65326331238a,a:250ccdb5af7deeb577926bb749482db4,a:b4447f5743605253772a82b74591205e,a:556ac7ce2a346d1a72cd8c70b0037de3,a:fcceccaef8ac612e701d530cc9659fb7",
  "aud": "jenius",
  "c_hash": "xBVxsRnxH8_1Ma-GXPVkbQ",
  "org.forgerock.openidconnect.ops": "tAEdmweWLEzIs2dslKqPctGZSTc",
  "realm": "/jenius",
  "tokenType": "JWTToken"
};

const BASE_DIR = `${__dirname}/../../../`

module.exports = {
  ACCESS_TOKEN_PAYLOAD,
  ID_TOKEN_PAYLOAD,
  BASE_DIR
};
