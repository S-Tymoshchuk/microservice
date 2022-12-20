import { ApiBody } from '@nestjs/swagger';

export const UploadVideoDecorator =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          video: {
            type: 'string',
            format: 'binary',
          },
          preview: {
            type: 'string',
            format: 'binary',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          duration: {
            type: 'string',
          },
          category: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
