import React from 'react';
import { renderWithProviders } from '../../../../testing/mocks';
import { EditLayoutSetForSubform } from './EditLayoutSetForSubform';
import { ComponentType } from 'app-shared/types/ComponentType';
import { componentMocks } from '../../../../testing/componentMocks';
import { textMock } from '@studio/testing/mocks/i18nMock';
import { screen, within } from '@testing-library/react';
import { createQueryClientMock } from 'app-shared/mocks/queryClientMock';
import { app, org } from '@studio/testing/testids';
import { QueryKey } from 'app-shared/types/QueryKey';
import { layoutSets } from 'app-shared/mocks/mocks';
import type { LayoutSets } from 'app-shared/types/api/LayoutSetsResponse';
import type { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import type { FormComponent } from '../../../../types/FormComponent';
import { AppContext } from '../../../../AppContext';
import { appContextMock } from '../../../../testing/appContextMock';

const handleComponentChangeMock = jest.fn();
const setSelectedFormLayoutSetMock = jest.fn();

describe('EditLayoutSetForSubForm', () => {
  afterEach(jest.clearAllMocks);

  it('displays "no existing subform layout sets" message if no subform layout set exist', () => {
    renderEditLayoutSetForSubForm();
    const noExistingSubFormForLayoutSet = screen.getByText(
      textMock('ux_editor.component_properties.subform.no_layout_sets_acting_as_subform'),
    );
    expect(noExistingSubFormForLayoutSet).toBeInTheDocument();
  });

  it('displays a button to set subform if subform layout sets exists', () => {
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm({ sets: [{ id: subformLayoutSetId, type: 'subform' }] });
    const setLayoutSetButton = screen.getByRole('button', {
      name: textMock('ux_editor.component_properties.subform.selected_layout_set_label'),
    });
    expect(setLayoutSetButton).toBeInTheDocument();
  });

  it('displays a select to choose a layout set for the subform when clicking button to set', async () => {
    const user = userEvent.setup();
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm({ sets: [{ id: subformLayoutSetId, type: 'subform' }] });
    await openEditMode(user);
    const selectLayoutSet = getSelectForLayoutSet();
    const options = within(selectLayoutSet).getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent(
      textMock('ux_editor.component_properties.subform.choose_layout_set'),
    );
    expect(options[1]).toHaveTextContent(subformLayoutSetId);
  });

  it('calls handleComponentChange when setting a layout set for the subform', async () => {
    const user = userEvent.setup();
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm({ sets: [{ id: subformLayoutSetId, type: 'subform' }] });
    await openEditMode(user);
    const selectLayoutSet = getSelectForLayoutSet();
    await user.selectOptions(selectLayoutSet, subformLayoutSetId);
    expect(handleComponentChangeMock).toHaveBeenCalledTimes(1);
    expect(handleComponentChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        layoutSet: subformLayoutSetId,
      }),
    );
  });

  it('calls handleComponentChange with no layout set for component if selecting the empty option', async () => {
    const user = userEvent.setup();
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm({ sets: [{ id: subformLayoutSetId, type: 'subform' }] });
    await openEditMode(user);
    const selectLayoutSet = getSelectForLayoutSet();
    const emptyOptionText = textMock('ux_editor.component_properties.subform.choose_layout_set');
    await user.selectOptions(selectLayoutSet, emptyOptionText);
    expect(handleComponentChangeMock).toHaveBeenCalledTimes(1);
    expect(handleComponentChangeMock).toHaveBeenCalledWith(
      expect.not.objectContaining({
        layoutSet: expect.anything(),
      }),
    );
  });

  it('closes the view mode when clicking close button after selecting a layout set', async () => {
    const user = userEvent.setup();
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm({ sets: [{ id: subformLayoutSetId, type: 'subform' }] });
    await openEditMode(user);
    const closeSetLayoutSetButton = screen.getByRole('button', {
      name: textMock('general.close'),
    });
    await user.click(closeSetLayoutSetButton);
    const setLayoutSetButtonAfterClose = screen.getByRole('button', {
      name: textMock('ux_editor.component_properties.subform.selected_layout_set_label'),
    });
    expect(setLayoutSetButtonAfterClose).toBeInTheDocument();
  });

  it('calls handleComponentChange with no layout set for component when clicking delete button', async () => {
    const user = userEvent.setup();
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm({ sets: [{ id: subformLayoutSetId, type: 'subform' }] });
    await openEditMode(user);
    const deleteLayoutSetConnectionButton = screen.getByRole('button', {
      name: textMock('general.delete'),
    });
    await user.click(deleteLayoutSetConnectionButton);
    expect(handleComponentChangeMock).toHaveBeenCalledTimes(1);
    expect(handleComponentChangeMock).toHaveBeenCalledWith(
      expect.not.objectContaining({
        layoutSet: expect.anything(),
      }),
    );
  });

  it('displays a button with the existing layout set for the subform if set', () => {
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm(
      { sets: [{ id: subformLayoutSetId, type: 'subform' }] },
      { layoutSet: subformLayoutSetId },
    );
    const existingLayoutSetButton = screen.getByRole('button', {
      name: textMock('ux_editor.component_properties.subform.selected_layout_set_title', {
        subform: subformLayoutSetId,
      }),
    });
    expect(existingLayoutSetButton).toBeInTheDocument();
  });

  it('opens view mode when clicking the button when a layout set for the subform if set', async () => {
    const user = userEvent.setup();
    const subformLayoutSetId = 'subformLayoutSetId';
    renderEditLayoutSetForSubForm(
      { sets: [{ id: subformLayoutSetId, type: 'subform' }] },
      { layoutSet: subformLayoutSetId },
    );
    const existingLayoutSetButton = screen.getByRole('button', {
      name: textMock('ux_editor.component_properties.subform.selected_layout_set_title', {
        subform: subformLayoutSetId,
      }),
    });
    await user.click(existingLayoutSetButton);
    const selectLayoutSet = getSelectForLayoutSet();
    expect(selectLayoutSet).toBeInTheDocument();
  });
});

const openEditMode = async (user: UserEvent) => {
  const setLayoutSetButton = screen.getByRole('button', {
    name: textMock('ux_editor.component_properties.subform.selected_layout_set_label'),
  });
  await user.click(setLayoutSetButton);
};

const getSelectForLayoutSet = () =>
  screen.getByRole('combobox', {
    name: textMock('ux_editor.component_properties.subform.choose_layout_set_label'),
  });

const renderEditLayoutSetForSubForm = (
  layoutSetsMock: LayoutSets = layoutSets,
  componentProps: Partial<FormComponent<ComponentType.SubForm>> = {},
) => {
  const queryClient = createQueryClientMock();
  queryClient.setQueryData([QueryKey.LayoutSets, org, app], layoutSetsMock);
  return renderWithProviders(
    <AppContext.Provider
      value={{ ...appContextMock, setSelectedFormLayoutSetName: setSelectedFormLayoutSetMock }}
    >
      <EditLayoutSetForSubform
        component={{ ...componentMocks[ComponentType.SubForm], ...componentProps }}
        handleComponentChange={handleComponentChangeMock}
      />
    </AppContext.Provider>,
    { queryClient },
  );
};