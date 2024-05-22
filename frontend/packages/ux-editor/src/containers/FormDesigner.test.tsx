import React from 'react';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import {
  formLayoutSettingsMock,
  renderHookWithProviders,
  renderWithProviders,
} from '../testing/mocks';
import { FormDesigner } from './FormDesigner';
import { textMock } from '../../../../testing/mocks/i18nMock';
import { useWidgetsQuery } from '../hooks/queries/useWidgetsQuery';
import ruleHandlerMock from '../testing/ruleHandlerMock';
import type { ITextResources } from 'app-shared/types/global';
import { DEFAULT_LANGUAGE } from 'app-shared/constants';
import { QueryKey } from 'app-shared/types/QueryKey';
import { createQueryClientMock } from 'app-shared/mocks/queryClientMock';
import { queriesMock } from 'app-shared/mocks/queriesMock';
import { externalLayoutsMock, layout1NameMock } from '../testing/layoutMock';
import { FormItemContext } from './FormItemContext';
import { formItemContextProviderMock } from '../testing/formItemContextMocks';
import { appContextMock } from '../testing/appContextMock';

// Test data:
const org = 'org';
const app = 'app';

const defaultTexts: ITextResources = {
  [DEFAULT_LANGUAGE]: [],
};

const render = () => {
  const queryClient = createQueryClientMock();
  const queries = {
    getFormLayouts: jest.fn().mockImplementation(() => Promise.resolve(externalLayoutsMock)),
    getFormLayoutSettings: jest
      .fn()
      .mockImplementation(() => Promise.resolve(formLayoutSettingsMock)),
    getRuleModel: jest.fn().mockImplementation(() => Promise.resolve<string>(ruleHandlerMock)),
    getInstanceIdForPreview: jest.fn().mockImplementation(() => Promise.resolve<string>('test')),
  };
  queryClient.setQueryData([QueryKey.DatamodelMetadata, org, app, 'test-layout-set'], []);
  queryClient.setQueryData([QueryKey.TextResources, org, app], defaultTexts);
  return renderWithProviders(
    <FormItemContext.Provider
      value={{
        ...formItemContextProviderMock,
      }}
    >
      <FormDesigner />
    </FormItemContext.Provider>,
    {
      queries,
      queryClient,
      appContextProps: {
        selectedFormLayoutSetName: 'test-layout-set',
        selectedFormLayoutName: layout1NameMock,
      },
    },
  );
};

const waitForData = async () => {
  const widgetsResult = renderHookWithProviders(() => useWidgetsQuery(org, app)).result;
  await waitFor(() => expect(widgetsResult.current.isSuccess).toBe(true));
};

const dragAndDrop = (src: Element, dst: Element) => {
  fireEvent.dragStart(src);
  fireEvent.dragEnter(dst);
  fireEvent.drop(dst);
  fireEvent.dragLeave(dst);
  fireEvent.dragEnd(src);
};

describe('FormDesigner', () => {
  afterEach(jest.clearAllMocks);

  it('should render the spinner', () => {
    render();
    expect(screen.getByText(textMock('ux_editor.loading_form_layout'))).toBeInTheDocument();
  });

  it('should render the component', async () => {
    await waitForData();
    render();
    await waitFor(() =>
      expect(screen.queryByText(textMock('ux_editor.loading_form_layout'))).not.toBeInTheDocument(),
    );
  });

  it('should add a component', async () => {
    await waitForData();
    render();

    const component = await screen.findByText(textMock('ux_editor.component_title.TextArea'));
    const tree = await screen.findByRole('tree');
    dragAndDrop(component, tree);

    await waitFor(() => expect(queriesMock.saveFormLayout).toHaveBeenCalledTimes(1));
    expect(queriesMock.saveFormLayout).toHaveBeenCalledWith(
      org,
      app,
      layout1NameMock,
      'test-layout-set',
      expect.any(Object),
    );
    expect(appContextMock.refetchLayouts).toHaveBeenCalledTimes(1);
    expect(appContextMock.refetchLayouts).toHaveBeenCalledWith('test-layout-set');
  });

  it('should move a component', async () => {
    await waitForData();
    render();

    const tree = await screen.findByRole('tree');
    const component = await within(tree).findByText(textMock('ux_editor.component_title.Input'));
    dragAndDrop(component, tree);

    await waitFor(() => expect(queriesMock.saveFormLayout).toHaveBeenCalledTimes(1));
    expect(queriesMock.saveFormLayout).toHaveBeenCalledWith(
      org,
      app,
      layout1NameMock,
      'test-layout-set',
      expect.any(Object),
    );
    expect(appContextMock.refetchLayouts).toHaveBeenCalledTimes(1);
    expect(appContextMock.refetchLayouts).toHaveBeenCalledWith('test-layout-set');
  });
});
