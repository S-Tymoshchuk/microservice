export interface ServerConfig {
  port: number;
  environment: string;
}

export interface Swagger {
  docsSwaggerTitle: string;
  docsSwaggerDescription: string;
  docsSwaggerVersion: string;
}

export interface ServiceConfig {
  host: string;
  port: number;
}

export interface Service {
  auth: ServiceConfig;
  video: ServiceConfig;
}

export interface Configuration {
  server: ServerConfig;
  swagger: Swagger;
  service: Service;
}

export default (): Configuration => ({
  server: {
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
  },
  swagger: {
    docsSwaggerTitle: process.env.GATEWAY_DOCS_SWAGGER_TITLE,
    docsSwaggerDescription: process.env.GATEWAY_DOCS_SWAGGER_DESCRIPTION,
    docsSwaggerVersion: process.env.GATEWAY_DOCS_SWAGGER_VERSION,
  },
  service: {
    auth: {
      host: process.env.GATEWAY_SERVICE_AUTH_HOST,
      port: parseInt(process.env.GATEWAY_SERVICE_AUTH_PORT, 10),
    },
    video: {
      host: process.env.GATEWAY_SERVICE_VIDEO_HOST,
      port: parseInt(process.env.GATEWAY_SERVICE_VIDEO_PORT, 10),
    },
  },
});
