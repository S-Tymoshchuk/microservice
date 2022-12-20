export interface ServerConfig {
  port: number;
  environment: string;
}

export interface AwsConfig {
  defaultRegion: string;
  secretAccessKey: string;
  accessKeyId: string;
  bucketName: string;
}

export interface JwtConfig {
  accessTokenPublicKey: string;
}

export interface Configuration {
  server: ServerConfig;
  jwt: JwtConfig;
  aws: AwsConfig;
}

const b64ToStr = (b64) => Buffer.from(b64, 'base64').toString('ascii');

export default (): Configuration => ({
  server: {
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
  },
  jwt: {
    accessTokenPublicKey: b64ToStr(
      process.env.VIDEO_JWT_ACCESS_TOKEN_PUBLIC_KEY,
    ),
  },
  aws: {
    defaultRegion: process.env.VIDEO_AWS_DEFAULT_REGION,
    secretAccessKey: process.env.VIDEO_AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.VIDEO_AWS_ACCESS_KEY_ID,
    bucketName: process.env.VIDEO_AWS_PUBLIC_BUCKET_NAME,
  },
});
