import type { CodeList } from '../types/CodeList';
import type { ValueError } from '../types/ValueError';
import { ArrayUtils } from '@studio/pure-functions';
import type { ValueErrorMap } from '../types/ValueErrorMap';

export function isCodeListValid(codeList: CodeList): boolean {
  const errors = findCodeListErrors(codeList);
  return !areThereCodeListErrors(errors);
}

export function findCodeListErrors(codeList: CodeList): ValueErrorMap {
  const values = codeList.map((item) => item.value);
  return mapValueErrors(values);
}

function mapValueErrors(values: string[]): ValueErrorMap {
  return values.map((value) => findValueError(value, values));
}

function findValueError(value: string, allValues: string[]): ValueError | null {
  return ArrayUtils.isDuplicate(value, allValues) ? 'duplicateValue' : null;
}

export function areThereCodeListErrors(errorMap: ValueErrorMap): boolean {
  return errorMap.some((item) => item !== null);
}
