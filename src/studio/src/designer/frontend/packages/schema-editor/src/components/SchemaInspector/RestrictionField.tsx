import React, { BaseSyntheticEvent } from 'react';
import { getDomFriendlyID } from '../../utils/schema';
import { TextField } from "@altinn/altinn-design-system";
import { Label } from "./Label";

export interface IRestrictionFieldProps {
  className?: string;
  keyName: string;
  label: string;
  onChangeValue: (id: string, key: string, value: string) => void;
  onReturn?: (e: BaseSyntheticEvent) => void;
  path: string;
  readOnly?: boolean;
  value?: string;
}

export const RestrictionField = ({
  className,
  keyName,
  label,
  onChangeValue,
  path,
  readOnly,
  value
}: IRestrictionFieldProps) => {

  const fieldId = `${getDomFriendlyID(path)}-${keyName}-value`;

  return (
    <div className={className}>
      <Label htmlFor={fieldId}>{label}</Label>
      <TextField
        id={fieldId}
        value={value ?? ''}
        onChange={(e) => onChangeValue(path, e.target.value, keyName)}
        aria-label={label}
        readOnly={readOnly}
      />
    </div>
  );
};