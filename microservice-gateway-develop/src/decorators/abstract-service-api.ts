import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export abstract class ServiceApiResponse<T> {
  abstract get rows(): T;

  @ApiModelProperty({ type: Number })
  count: number;
}
