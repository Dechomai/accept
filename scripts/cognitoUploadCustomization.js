const fs = require('fs');
const path = require('path');
const {CognitoIdentityServiceProvider} = require('aws-sdk');

const CSS_PATH = path.resolve(__dirname, '../client/cognito-ui/custom-css.css');
const IMAGE_PATH = path.resolve(__dirname, '../client/cognito-ui/header.png');

const ACCESS_KEY_ID = process.env.COGNITO_CUSTOMIZER_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.COGNITO_CUSTOMIZER_SECRET_ACCESS_KEY;
const REGION = process.env.COGNITO_REGION;

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

const uploadCustomizations = (css, image) =>
  new Promise((resolve, reject) => {
    const cognitoIdentityService = new CognitoIdentityServiceProvider({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      region: REGION
    });
    cognitoIdentityService.setUICustomization(
      {
        UserPoolId: COGNITO_USER_POOL_ID,
        ClientId: COGNITO_CLIENT_ID,
        CSS: css,
        ImageFile: image
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });

(async () => {
  let css, image;
  try {
    css = fs.readFileSync(CSS_PATH, 'utf8');
    image = fs.readFileSync(IMAGE_PATH);
  } catch (err) {
    console.log('Error reading file');
    console.error(err);
    process.exit(1);
  }
  try {
    const res = await uploadCustomizations(css, image);
    console.log('Done uploading customizations');
    console.log(res);
  } catch (err) {
    console.log('Error uploading customizations to Cognito');
    console.error(err);
    process.exit(1);
  }
})();
