import React from 'react';
import { LegacySelect, LegacyToggleButtonGroup } from '@digdir/design-system-react';
import type { AltinnButtonActionItem } from 'app-shared/components/altinnHeader/types';
import classes from '../AppPreviewSubMenu.module.css';
import { ArrowCirclepathIcon, EyeIcon, LinkIcon } from '@studio/icons';
import { useTranslation } from 'react-i18next';
import type { AppPreviewSubMenuProps } from '../AppPreviewSubMenu';
import { useLayoutSetsQuery } from 'app-shared/hooks/queries/useLayoutSetsQuery';
import { useStudioEnvironmentParams } from 'app-shared/hooks/useStudioEnvironmentParams';
import { TopBarMenu } from 'app-shared/enums/TopBarMenu';
import { PackagesRouter } from 'app-shared/navigation/PackagesRouter';
import { StudioButton } from '@studio/components';

export const SubPreviewMenuLeftContent = ({
  viewSize,
  setViewSize,
  selectedLayoutSet,
  handleChangeLayoutSet,
}: AppPreviewSubMenuProps) => {
  const { t } = useTranslation();
  const { org, app } = useStudioEnvironmentParams();
  const { data: layoutSets } = useLayoutSetsQuery(org, app);

  return (
    <div className={classes.leftSubHeaderComponents}>
      <div className={classes.viewSizeButtons}>
        <LegacyToggleButtonGroup
          items={[
            {
              label: t('preview.view_size_desktop'),
              value: 'desktop',
            },
            {
              label: t('preview.view_size_mobile'),
              value: 'mobile',
            },
          ]}
          onChange={setViewSize}
          selectedValue={viewSize === 'desktop' ? 'desktop' : 'mobile'}
        />
      </div>
      {layoutSets && (
        <div className={classes.layoutSetSelector}>
          <LegacySelect
            onChange={(layoutSet) => handleChangeLayoutSet(layoutSet)}
            options={layoutSets.sets.map((layoutSet) => ({
              label: layoutSet.id,
              value: layoutSet.id,
            }))}
            value={selectedLayoutSet}
          />
        </div>
      )}
    </div>
  );
};

export const SubPreviewMenuRightContent = () => {
  const { t } = useTranslation();
  return (
    <div className={classes.rightSubHeaderButtons}>
      <StudioButton icon={<ArrowCirclepathIcon />} variant='tertiary' color='inverted'>
        {t('preview.subheader.restart')}
      </StudioButton>
      <StudioButton icon={<EyeIcon />} variant='tertiary' color='inverted'>
        {t('preview.subheader.showas')}
      </StudioButton>
      <StudioButton icon={<LinkIcon />} variant='tertiary' color='inverted'>
        {t('preview.subheader.sharelink')}
      </StudioButton>
    </div>
  );
};

export const appPreviewButtonActions = (
  org: string,
  app: string,
  instanceId: string,
): AltinnButtonActionItem[] => {
  const packagesRouter = new PackagesRouter({ org, app });
  const queryParams = `?layout=${window.localStorage.getItem(instanceId)}`;

  return [
    {
      menuKey: TopBarMenu.PreviewBackToEditing,
      to: `${packagesRouter.getPackageNavigationUrl('editorUiEditor')}${queryParams}`,
    },
  ];
};
