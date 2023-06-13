import { RepositoryType } from 'app-shared/types/global';
import { AppPreviewMenuItem } from './AppPreviewBarConfig';
import { mockUseTranslation } from '../../../../testing/mocks/i18nMock';
import { getTopBarAppPreviewMenu, menu } from './AppPreviewBarConfig';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SubPreviewMenuContent } from './AppPreviewBarConfig';

describe('getTopBarAppPreviewMenu', () => {
  const { t } = mockUseTranslation();
  it('should return all items when provided repository type is "App"', () => {
    expect(getTopBarAppPreviewMenu('test-org', 'test-app', RepositoryType.App, t)).toHaveLength(
      menu.length
    );
  });

  it('should return empty list when provided repo type is "Unknown"', () => {
    const expected: AppPreviewMenuItem[] = [];
    expect(getTopBarAppPreviewMenu('test-org', 'test-app', RepositoryType.Unknown, t)).toEqual(
      expected
    );
  });

  it('should render enders all buttons', () => {
    render(<SubPreviewMenuContent />);

    expect(screen.getByTestId('restartBtn'));
    expect(screen.getByTestId('showBtn'));
    expect(screen.getByTestId('shareBtn'));
  });
});