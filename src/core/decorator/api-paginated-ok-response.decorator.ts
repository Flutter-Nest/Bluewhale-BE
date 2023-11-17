import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from "@nestjs/swagger";
import { PaginationMeta } from "../entity/pagination.entity";

export const ApiPaginatedOkResponseDecorator = <T extends Type<any>>(
  model: T,
  options: ApiResponseOptions = {}
) => {
  return applyDecorators(
    ApiOkResponse({
      ...options,
      schema: {
        properties: {
          meta: {
            $ref: getSchemaPath(PaginationMeta),
          },
          data: {
            type: "array",
            items: {
              $ref: getSchemaPath(model),
            },
          },
        },
      },
    })
  );
};
