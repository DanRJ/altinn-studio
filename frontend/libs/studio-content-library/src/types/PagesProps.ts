import type { CodeListProps } from '../ContentLibrary/LibraryBody/pages/CodeList';
import type { PageName } from './PageName';
import type { ImagesProps } from '../ContentLibrary/LibraryBody/pages/Images';

export type PagePropsMap<P extends PageName> = {
  landingPage: {};
  codeList: CodeListProps;
  images: ImagesProps;
}[P];

type GlobalPageConfig<T> = {
  props: T;
};

type AllPagesConfig = {
  [K in PageName]: GlobalPageConfig<PagePropsMap<K>>;
};

export type PagesConfig = Partial<AllPagesConfig>;
