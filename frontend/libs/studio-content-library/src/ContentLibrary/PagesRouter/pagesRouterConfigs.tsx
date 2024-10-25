import React, { type ReactNode } from 'react';
import type { PageName } from '../../types/PageName';
import { BookIcon, CodeListsIcon, ImageIcon } from '@studio/icons';

type RouterPageProps = {
  icon: ReactNode;
  pageName: PageName;
  pageTitleTextKey: string;
};

type PagesRouterConfigs = { [T in PageName]: RouterPageProps };

export const pagesRouterConfigs: PagesRouterConfigs = {
  landingPage: {
    pageName: 'landingPage',
    pageTitleTextKey: 'app_content_library.landing_page.page_name',
    icon: <BookIcon fontSize='2rem' />,
  },
  codeList: {
    icon: <CodeListsIcon fontSize='1.5rem' />,
    pageName: 'codeList',
    pageTitleTextKey: 'app_content_library.code_lists.page_name',
  },
  images: {
    icon: <ImageIcon fontSize='1.5rem' />,
    pageName: 'images',
    pageTitleTextKey: 'app_content_library.images.page_name',
  },
};
