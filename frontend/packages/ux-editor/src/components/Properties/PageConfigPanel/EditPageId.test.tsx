import React from 'react';
import { screen } from '@testing-library/react';
import { formLayoutSettingsMock, renderWithProviders } from '../../../testing/mocks';
import { QueryKey } from 'app-shared/types/QueryKey';
import { createQueryClientMock } from 'app-shared/mocks/queryClientMock';
import userEvent from '@testing-library/user-event';
import { textMock } from '../../../../../../testing/mocks/i18nMock';
import { EditPageId } from './EditPageId';
import type { ServicesContextProps } from 'app-shared/contexts/ServicesContext';
import { appContextMock } from '../../../testing/appContextMock';
import { externalLayoutsMock } from '../../../testing/layoutMock';

// Test data
const app = 'app';
const org = 'org';
const selectedLayout = 'layoutPageName';
const layoutSetName = 'test-layout-set';

describe('EditPageId', () => {
  it('renders given page ID', () => {
    renderEditPageId();
    screen.getByRole('button', { name: textMock('ux_editor.id_identifier') });
  });

  it('calls updateFormLayoutName and textIdMutation with new page ID when changed', async () => {
    const user = userEvent.setup();
    const newPageName = 'myNewPageName';
    const updateTextId = jest.fn();
    const updateFormLayoutName = jest.fn().mockImplementation(() => Promise.resolve());
    const mockQueries: Partial<ServicesContextProps> = {
      updateTextId,
      updateFormLayoutName,
    };
    renderEditPageId(mockQueries);
    const pageIdButton = screen.getByRole('button', { name: textMock('ux_editor.id_identifier') });
    await user.click(pageIdButton);
    const editPageId = screen.getByLabelText(
      textMock('ux_editor.modal_properties_textResourceBindings_page_id'),
    );
    await user.clear(editPageId);
    await user.type(editPageId, newPageName);
    await user.tab();
    expect(updateFormLayoutName).toHaveBeenCalledTimes(1);
    expect(updateFormLayoutName).toHaveBeenCalledWith(
      org,
      app,
      selectedLayout,
      newPageName,
      layoutSetName,
    );
    expect(updateTextId).toHaveBeenCalledTimes(1);
    expect(appContextMock.refetchLayouts).toHaveBeenCalledTimes(1);
    expect(appContextMock.refetchLayouts).toHaveBeenCalledWith(layoutSetName);
  });

  it('does not call updateFormLayoutName and textIdMutation when page ID is unchanged', async () => {
    const user = userEvent.setup();
    const updateTextId = jest.fn();
    const updateFormLayoutName = jest.fn();
    const mockQueries: Partial<ServicesContextProps> = {
      updateTextId,
      updateFormLayoutName,
    };
    renderEditPageId(mockQueries);
    const pageIdButton = screen.getByRole('button', { name: textMock('ux_editor.id_identifier') });
    await user.click(pageIdButton);
    const editPageId = screen.getByLabelText(
      textMock('ux_editor.modal_properties_textResourceBindings_page_id'),
    );
    await user.click(editPageId);
    await user.tab();
    expect(updateFormLayoutName).not.toHaveBeenCalled();
    expect(updateTextId).toHaveBeenCalledTimes(0);
  });

  it('renders error message if page ID exist in layout settings order', async () => {
    const user = userEvent.setup();
    const existingPageName = formLayoutSettingsMock.pages.order[0];
    renderEditPageId();
    const notUniqueErrorMessage = screen.queryByText(textMock('ux_editor.pages_error_unique'));
    expect(notUniqueErrorMessage).not.toBeInTheDocument();
    const pageIdButton = screen.getByRole('button', { name: textMock('ux_editor.id_identifier') });
    await user.click(pageIdButton);
    const editPageId = screen.getByRole('textbox', {
      name: textMock('ux_editor.modal_properties_textResourceBindings_page_id'),
    });
    await user.clear(editPageId);
    await user.type(editPageId, existingPageName);
    screen.getByText(textMock('ux_editor.pages_error_unique'));
  });
});

const renderEditPageId = (queries?: Partial<ServicesContextProps>) => {
  const queryClient = createQueryClientMock();
  queryClient.setQueryData(
    [QueryKey.FormLayoutSettings, org, app, layoutSetName],
    formLayoutSettingsMock,
  );
  queryClient.setQueryData([QueryKey.FormLayouts, org, app, layoutSetName], externalLayoutsMock);
  return renderWithProviders(<EditPageId layoutName={selectedLayout} />, { queries, queryClient });
};
