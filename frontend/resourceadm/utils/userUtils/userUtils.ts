import { SelectedContextType } from 'app-shared/navigation/main-header/Header';
import type { Organization } from 'app-shared/types/Organization';

export const userHasAccessToOrganization = ({
  org,
  orgs,
}: {
  org: string | SelectedContextType;
  orgs: Organization[];
}): boolean => {
  if (org == SelectedContextType.Self || org == SelectedContextType.All) {
    return true;
  }

  return Boolean(orgs.find((x) => x.username === org));
};

export const getOrgNameByUsername = (username: string, orgs: Organization[]) => {
  const org = orgs?.find((o) => o.username === username);
  return org?.full_name || org?.username;
};
