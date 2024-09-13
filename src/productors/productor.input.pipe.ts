import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ProductorsInputDto } from './model/productors.dto';
import * as cpfUtil from '@fnando/cpf';
import * as cnpjUtil from '@fnando/cnpj';

@Injectable()
export class ProductorInputValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const { farmTotalArea, farmForestArea, farmUsefulArea, documentNumber } =
      value as ProductorsInputDto;

    const invalidCauses: string[] = [];

    if (
      Number(farmTotalArea) <
      Number(farmForestArea) + Number(farmUsefulArea)
    ) {
      invalidCauses.push(
        'farmTotalArea value cannot be greater than farmForestArea + farmUsefulArea values',
      );
    }

    if (![11, 14].includes(documentNumber.length)) {
      invalidCauses.push('documentNumber must have exactly 11 or 14 digits');
    } else if (
      documentNumber.length === 11 &&
      !cpfUtil.isValid(documentNumber)
    ) {
      invalidCauses.push('documentNumber has an invalid CPF value');
    } else if (
      documentNumber.length === 14 &&
      !cnpjUtil.isValid(documentNumber)
    ) {
      invalidCauses.push('documentNumber has an invalid CNPJ value');
    }

    if (invalidCauses.length > 0) {
      throw new BadRequestException(invalidCauses);
    }

    return value;
  }
}
