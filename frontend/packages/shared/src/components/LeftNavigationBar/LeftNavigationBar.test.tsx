import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeftNavigationBar, LeftNavigationBarProps } from './LeftNavigationBar';
import { LeftNavigationTab, TabAction } from 'app-shared/types/LeftNavigationTab';
import { TestFlaskIcon } from '@navikt/aksel-icons';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { textMock } from '../../../../../testing/mocks/i18nMock';

const mockOnClick = jest.fn();

const mockTo: string = '/test';

const mockLinkAction1: TabAction = {
  type: 'link',
  to: mockTo,
  onClick: mockOnClick,
};

const mockLinkAction2: TabAction = {
  type: 'link',
  to: mockTo,
};

const mockButtonAction: TabAction = {
  type: 'button',
  onClick: mockOnClick,
};

const mockTabId1: string = 'tab1';
const mockTabId2: string = 'tab2';
const mockTabId3: string = 'tab3';

const mockTabs: LeftNavigationTab[] = [
  {
    icon: <TestFlaskIcon />,
    tabName: `test.test_${mockTabId1}`,
    tabId: mockTabId1,
    action: mockLinkAction1,
    isActiveTab: true,
  },
  {
    icon: <TestFlaskIcon />,
    tabName: `test.test_${mockTabId2}`,
    tabId: mockTabId2,
    action: mockButtonAction,
    isActiveTab: false,
  },
  {
    icon: <TestFlaskIcon />,
    tabName: `test.test_${mockTabId3}`,
    tabId: mockTabId3,
    action: mockLinkAction2,
    isActiveTab: false,
  },
];

const mockBackButtonText: string = 'Go back';
const mockBackButtonHref: string = '/back';

describe('LeftNavigationBar', () => {
  afterEach(jest.clearAllMocks);

  const defaultProps: LeftNavigationBarProps = {
    tabs: mockTabs,
    upperTab: 'backButton',
    backLink: mockBackButtonHref,
    backLinkText: mockBackButtonText,
  };

  it('calls the onClick function when a tab is clicked and action type is button', async () => {
    const user = userEvent.setup();
    render(defaultProps);

    const nextTab = mockTabs[1];

    const tab2 = screen.getByRole('button', { name: textMock(nextTab.tabName) });
    await act(() => user.click(tab2));
    expect(nextTab.action.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls the onClick function when a tab is clicked and action type is link and onClick is present', async () => {
    const user = userEvent.setup();
    render(defaultProps);

    const nextTab = mockTabs[1];
    const tab2 = screen.getByRole('button', { name: textMock(nextTab.tabName) });
    await act(() => user.click(tab2));

    const newNextTab = mockTabs[0];
    const tab1 = screen.getByRole('link', { name: textMock(newNextTab.tabName) });
    await act(() => user.click(tab1));

    expect(newNextTab.action.onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call the onClick function when a tab is clicked and action type is link and onClick is not present', async () => {
    const user = userEvent.setup();
    render(defaultProps);

    const nextTab = mockTabs[2];

    const tab3 = screen.getByRole('link', { name: textMock(nextTab.tabName) });
    await act(() => user.click(tab3));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('does not call the onClick function when the active tab is clicked', async () => {
    const user = userEvent.setup();
    render(defaultProps);

    const currentTab = mockTabs[0];

    const tab1 = screen.getByRole('link', { name: textMock(currentTab.tabName) });
    await act(() => user.click(tab1));
    expect(currentTab.action.onClick).toHaveBeenCalledTimes(0);
  });

  it('displays back button when "upperTab" is backButton and "backButtonHref" and "backButtonText" is present', () => {
    render(defaultProps);

    const backButton = screen.getByRole('link', { name: mockBackButtonText });
    expect(backButton).toBeInTheDocument();
  });

  it('does not display the back button when "upperTab" is backButton and "backButtonHref" or "backButtonText" is not present', () => {
    render({ tabs: mockTabs });

    const backButton = screen.queryByRole('link', { name: mockBackButtonText });
    expect(backButton).not.toBeInTheDocument();
  });
});

const render = (props: LeftNavigationBarProps) => {
  return rtlRender(
    <MemoryRouter initialEntries={['/']}>
      <LeftNavigationBar {...props} />
    </MemoryRouter>
  );
};