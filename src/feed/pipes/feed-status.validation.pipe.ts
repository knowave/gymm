import { BadRequestException, PipeTransform } from '@nestjs/common';
import { FeedStatus } from '../enums/feed-status.enum';

export class FeedStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [FeedStatus.PRIVATE, FeedStatus.PUBLIC];

  transform(value: any): any {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException('올바르지 않은 상태값 입니다.');
    }

    return value;
  }

  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);

    return index !== -1;
  }
}
