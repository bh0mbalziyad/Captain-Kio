const fs = require("fs");
const { argv } = require("yargs");

require("dotenv").config();

const environment = argv.environment;
const isProduction = environment === "prod";

const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

const environmentFileContent = `export const environment = {
  production: ${isProduction},
  firebase: {
    apiKey: "${process.env.FIREBASE_API_KEY}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
    databaseURL: "${process.env.FIREBASE_DATABASE_URL}",
    projectId: "${process.env.FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.FIREBASE_APP_ID}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}",
  },
};
`;

if (!fs.existsSync(`./src/environments`)) fs.mkdirSync("./src/environments");

try {
  let stream = fs.createWriteStream(targetPath);
  stream.once("open", (fd) => {
    stream.write(environmentFileContent);
    console.log(`Wrote envs to ${targetPath}`);
    stream.end();
  });

  // fs.writeFileSync(targetPath, environmentFileContent);
  // console.log(`Wrote envs to ${targetPath}`);
} catch (error) {
  console.error("Cannot write file", error);
}
