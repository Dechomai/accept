const fs = require('fs');
const path = require('path');
const config = require('../config');
const {CognitoIdentityServiceProvider} = require('aws-sdk');

const CSS_PATH = path.resolve(__dirname, '../client/cognito-ui/custom-css.css');
const IMAGE_PATH = path.resolve(__dirname, '../client/cognito-ui/header.png');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;

const uploadCustomizations = (css, image) =>
  new Promise((resolve, reject) => {
    const cognitoIdentityService = new CognitoIdentityServiceProvider({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION
    });
    cognitoIdentityService.setUICustomization(
      {
        UserPoolId: config.get('cognito.userPoolId'),
        ClientId: config.get('cognito.clientId'),
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
