import React from 'react';
import { screen } from '@testing-library/react';
import { ItemPropertiesTab } from './ItemPropertiesTab';
import { UiSchemaItem } from '../../types';
import { renderWithRedux } from '../../../test/renderWithRedux';

test('item property tab renders combinations', async () => {
  const checkIsNameInUse = jest.fn();
  const selectedItem: UiSchemaItem = {
    type: 'object',
    path: '#/properties/test',
    displayName: 'test',
    combinationItem: true,
    combinationKind: 'anyOf',
    combination: [
      {
        type: 'string',
        path: '#/properties/test/donald',
        displayName: 'donald',
      },
      {
        type: 'string',
        path: '#/properties/test/dolly',
        displayName: 'dolly',
      },
    ],
  };
  renderWithRedux(
    <ItemPropertiesTab
      language={{}}
      selectedItem={selectedItem}
      checkIsNameInUse={checkIsNameInUse}
    />,
  );
  expect(
    screen.getByText('combination_inline_object_disclaimer'),
  ).toBeDefined();
});