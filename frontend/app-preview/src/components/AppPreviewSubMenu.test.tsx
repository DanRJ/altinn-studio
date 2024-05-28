import React from 'react';
import { queryClientMock } from 'app-shared/mocks/queryClientMock';
import { renderWithProviders } from '@altinn/ux-editor/testing/mocks';
import { layoutSet1NameMock, layoutSetsMock } from '@altinn/ux-editor/testing/layoutSetsMock';
import type { AppPreviewSubMenuProps } from './AppPreviewSubMenu';
import { AppPreviewSubMenu } from './AppPreviewSubMenu';
import type { LayoutSets } from 'app-shared/types/api/LayoutSetsResponse';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryKey } from 'app-shared/types/QueryKey';
import { app, org } from '@studio/testing/testids';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const user = userEvent.setup();

describe('AppPreviewSubMenu', () => {
  afterEach(jest.clearAllMocks);

  const props: AppPreviewSubMenuProps = {
    viewSize: 'desktop',
    setViewSize: jest.fn(),
    selectedLayoutSet: layoutSet1NameMock,
    handleChangeLayoutSet: jest.fn(),
  };

  it('renders the component with desktop viewSize', () => {
    setQueryData(null);
    renderWithProviders(<AppPreviewSubMenu {...props} />);
    const desktopButton = screen.getByRole('button', { name: 'preview.view_size_desktop' });
    const mobileButton = screen.getByRole('button', { name: 'preview.view_size_mobile' });
    expect(desktopButton).toHaveAttribute('aria-pressed', 'true');
    expect(mobileButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders the component with mobile viewSize', () => {
    setQueryData(null);
    renderWithProviders(<AppPreviewSubMenu {...props} viewSize='mobile' />);
    const desktopButton = screen.getByRole('button', { name: 'preview.view_size_desktop' });
    const mobileButton = screen.getByRole('button', { name: 'preview.view_size_mobile' });
    expect(desktopButton).toHaveAttribute('aria-pressed', 'false');
    expect(mobileButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders the component with layout sets in select list', async () => {
    setQueryData(layoutSetsMock);
    renderWithProviders(<AppPreviewSubMenu {...props} />);
    const layoutSetSelector = screen.getByRole('combobox');
    await user.click(layoutSetSelector);
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(layoutSetsMock.sets.length);
  });
});

const setQueryData = (layoutSets: LayoutSets | null) => {
  queryClientMock.setQueryData([QueryKey.LayoutSets, org, app], layoutSets);
};
