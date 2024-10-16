import React, { type ChangeEvent } from 'react';
import { StudioNativeSelect } from '@studio/components';
import { useTranslation } from 'react-i18next';
import classes from './SelectLayoutSet.module.css';
import { EditLayoutSetButtons } from './EditLayoutSetButtons/EditLayoutSetButtons';
import { useStudioEnvironmentParams } from 'app-shared/hooks/useStudioEnvironmentParams';
import { useLayoutSetsQuery } from 'app-shared/hooks/queries/useLayoutSetsQuery';
import { SubFormUtilsImpl } from '../../../../../../classes/SubFormUtils';

type SelectLayoutSetProps = {
  existingLayoutSetForSubForm: string;
  onUpdateLayoutSet: (layoutSetId: string) => void;
  onSetLayoutSetSelectorVisible: (visible: boolean) => void;
};

export const SelectLayoutSet = ({
  existingLayoutSetForSubForm,
  onUpdateLayoutSet,
  onSetLayoutSetSelectorVisible,
}: SelectLayoutSetProps) => {
  const { t } = useTranslation();
  const { org, app } = useStudioEnvironmentParams();
  const { data: layoutSets } = useLayoutSetsQuery(org, app);
  const subFormUtils = new SubFormUtilsImpl(layoutSets.sets);

  const addLinkToLayoutSet = (layoutSetId: string): void => {
    onUpdateLayoutSet(layoutSetId);
  };

  const deleteLinkToLayoutSet = (): void => {
    onUpdateLayoutSet(undefined);
    closeLayoutSetSelector();
  };

  const closeLayoutSetSelector = (): void => {
    onSetLayoutSetSelectorVisible(false);
  };

  const handleLayoutSetChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedLayoutSetId = event.target.value;

    if (selectedLayoutSetId === '') {
      deleteLinkToLayoutSet();
      return;
    }

    addLinkToLayoutSet(selectedLayoutSetId);
  };

  return (
    <div className={classes.selectLayoutSet}>
      <StudioNativeSelect
        size='small'
        onChange={handleLayoutSetChange}
        label={t('ux_editor.component_properties.subform.choose_layout_set_label')}
        defaultValue={existingLayoutSetForSubForm}
        onBlur={closeLayoutSetSelector}
      >
        <option value=''>{t('ux_editor.component_properties.subform.choose_layout_set')}</option>
        {subFormUtils.subformLayoutSetsIds.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </StudioNativeSelect>
      <EditLayoutSetButtons onClose={closeLayoutSetSelector} onDelete={deleteLinkToLayoutSet} />
    </div>
  );
};