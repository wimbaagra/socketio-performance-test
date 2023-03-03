const fs = require('fs');
const jwt = require('jsonwebtoken');
const { parse } = require('csv-parse');
const { stringify } = require("csv-stringify");

const {
  ACCESS_TOKEN_PAYLOAD,
  ID_TOKEN_PAYLOAD
} = require('./constant');

const main = () => {
  const stringifier = stringify({ header: false });
  const nodeEnv = 'sit';
  const privateKeyPath = `${__dirname}/keys/${nodeEnv}/private.key`;
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
  const signOptions = {
    expiresIn:  "12h",
    algorithm:  "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
  };
  const tokenOutputFile = `${__dirname}/../../data/cif-token.csv`;

  console.log('Generating Access Token .....');
  const accessToken = jwt.sign(ACCESS_TOKEN_PAYLOAD, privateKey, signOptions);
  const writableTokenStream = fs.createWriteStream(tokenOutputFile);
  stringifier.write([accessToken]);
  console.log(`Access Token Generated. Saved to ${tokenOutputFile}`);

  console.log('\nGenerating ID Token .....');
  const cifFile =  `${__dirname}/../../data/cif.csv`;
  fs.createReadStream(cifFile)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      const payload = ID_TOKEN_PAYLOAD;
      const cif = row[0];
      payload.cif = cif;
  
      const idToken = jwt.sign(ID_TOKEN_PAYLOAD, privateKey, signOptions);
      stringifier.write([cif, idToken]);
    })
    .on('end', () => {
      console.log(`ID Token Generated. Saved to ${tokenOutputFile}`);
    })
    .on('error', () => {
      console.log(error.message);
    });
  stringifier.pipe(writableTokenStream);
}

main();