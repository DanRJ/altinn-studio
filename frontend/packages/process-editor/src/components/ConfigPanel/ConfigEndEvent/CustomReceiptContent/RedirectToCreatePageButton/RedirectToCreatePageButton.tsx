import React from 'react';
import classes from './RedirectToCreatePageButton.module.css';
import { useStudioEnvironmentParams } from 'app-shared/hooks/useStudioEnvironmentParams';
import { PackagesRouter } from 'app-shared/navigation/PackagesRouter';
import { PencilWritingIcon } from '@studio/icons';
import { StudioButton, StudioRedirectBox } from '@studio/components';
import { useLocalStorage } from '@studio/components/src/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import { useBpmnApiContext } from '../../../../../contexts/BpmnApiContext';
import { Link } from '@digdir/designsystemet-react';

export const RedirectToCreatePageButton = (): React.ReactElement => {
  const { t } = useTranslation();
  const { org, app } = useStudioEnvironmentParams();
  const packagesRouter = new PackagesRouter({ org, app });
  const { existingCustomReceiptLayoutSetId } = useBpmnApiContext();

  const [, setSelectedLayoutSet] = useLocalStorage<string>('layoutSet/' + app);

  const handleClick = () => {
    setSelectedLayoutSet(existingCustomReceiptLayoutSetId);
  };

  return (
    <div className={classes.goToCreatePageWrapper}>
      <StudioRedirectBox
        title={t('process_editor.configuration_panel_custom_receipt_navigate_to_design_title')}
      >
        <StudioButton asChild variant='primary' color='second' onClick={handleClick}>
          <Link
            href={packagesRouter.getPackageNavigationUrl('editorUiEditor')}
            className={classes.link}
          >
            <PencilWritingIcon />
            {t('process_editor.configuration_panel_custom_receipt_navigate_to_design_button')}
          </Link>
        </StudioButton>
      </StudioRedirectBox>
    </div>
  );
};
