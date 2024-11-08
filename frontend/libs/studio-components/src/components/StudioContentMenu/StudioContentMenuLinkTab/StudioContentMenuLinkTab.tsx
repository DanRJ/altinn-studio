import React from 'react';
import type { ReactNode } from 'react';
import { useTabProps } from '../hooks/useTabProps';
import { StudioButton } from '@studio/components';

export type StudioContentMenuLinkTabProps<TabId extends string> = {
  icon: ReactNode;
  tabName: string;
  tabId: TabId;
  renderTab: (props: React.HTMLAttributes<HTMLAnchorElement>) => React.ReactElement;
};

export function StudioContentMenuLinkTab<TabId extends string>({
  icon,
  tabName,
  tabId,
  renderTab,
}: StudioContentMenuLinkTabProps<TabId>): React.ReactElement {
  const props = useTabProps(icon, tabName, tabId);

  return <StudioButton asChild>{renderTab(props)}</StudioButton>;
}
