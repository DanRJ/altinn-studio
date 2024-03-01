import type { Props } from './Props';
import type { SimpleSubexpressionValueType } from '../../../../../enums/SimpleSubexpressionValueType';
import React, { useState } from 'react';
import { useStudioExpressionContext } from '../../../../../StudioExpressionContext';
import { ExpressionErrorKey } from '../../../../../enums/ExpressionErrorKey';
import { DataLookupFuncName } from '../../../../../enums/DataLookupFuncName';
import { Combobox } from '@digdir/design-system-react';

export const ComponentIdSelector = ({
  value,
  onChange,
}: Props<SimpleSubexpressionValueType.Component>) => {
  const { dataLookupOptions, texts } = useStudioExpressionContext();
  const [errorKey, setErrorKey] = useState<ExpressionErrorKey | null>(null);
  const [idValue, setIdValue] = useState<string>(value.id);

  const options = dataLookupOptions[DataLookupFuncName.Component];

  const handleChange = (values: string[]) => {
    if (values.length) {
      setIdValue(values[0]);
      onChange({ ...value, id: values[0] });
      setErrorKey(null);
    } else {
      setIdValue('');
      setErrorKey(ExpressionErrorKey.InvalidComponentId);
    }
  };

  return (
    <Combobox
      error={texts.errorMessages[errorKey]}
      label={texts.componentId}
      onValueChange={handleChange}
      size='small'
      value={idValue ? [idValue] : []}
    >
      {options.map((option) => (
        <Combobox.Option key={option} value={option}>
          {option}
        </Combobox.Option>
      ))}
    </Combobox>
  );
};
