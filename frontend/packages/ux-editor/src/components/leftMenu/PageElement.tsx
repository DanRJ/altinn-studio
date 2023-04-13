import React, { useEffect, useState } from 'react';
import classes from './PageElement.module.css';
import cn from 'classnames';
import type { ChangeEvent, SyntheticEvent, MouseEvent } from 'react';
import { Button, ButtonVariant, TextField } from '@digdir/design-system-react';
import { ConfirmModal } from './ConfirmModal';
import { Divider } from 'app-shared/primitives';
import { MenuElipsisVerticalIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { FormLayoutActions } from '../../features/formDesigner/formLayout/formLayoutSlice';
import { deepCopy, removeKey } from 'app-shared/pure';
import { useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { AltinnMenu, AltinnMenuItem } from 'app-shared/components';
import { useTranslation } from 'react-i18next';
import { useFormLayoutSettingsQuery } from '../../hooks/queries/useFormLayoutSettingsQuery';
import { useUpdateLayoutOrderMutation } from '../../hooks/mutations/useUpdateLayoutOrderMutation';
import { useDeleteLayoutMutation } from '../../hooks/mutations/useDeleteLayoutMutation';
import { useUpdateLayoutNameMutation } from '../../hooks/mutations/useUpdateLayoutNameMutation';

export interface IPageElementProps {
  name: string;
  invalid?: boolean;
}

export function PageElement({ name, invalid }: IPageElementProps) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLayout = searchParams.get('layout');
  const { t } = useTranslation();
  const { org, app } = useParams();
  const formLayoutSettingsQuery = useFormLayoutSettingsQuery(org, app);
  const updateLayoutOrderMutation = useUpdateLayoutOrderMutation(org, app);
  const deleteLayoutMutation = useDeleteLayoutMutation(org, app);
  const updateLayoutNameMutation = useUpdateLayoutNameMutation(org, app);
  const layoutOrder = formLayoutSettingsQuery.data?.pages.order;
  const [editMode, setEditMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<null | Element>(null);
  const disableUp = layoutOrder.indexOf(name) === 0;
  const disableDown = layoutOrder.indexOf(name) === layoutOrder.length - 1;

  useEffect(() => {
    if (name !== selectedLayout) {
      setEditMode(false);
    }
  }, [name, selectedLayout]);

  const onPageClick = () => {
    if (invalid) {
      alert(`${name}: ${t('left_menu.pages.invalid_page_data')}`);
    } else if (selectedLayout !== name) {
      dispatch(FormLayoutActions.updateSelectedLayout(name));
      setSearchParams({ ...deepCopy(searchParams), layout: name });
    }
  };

  const onPageSettingsClick = (event: MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(event.currentTarget);

  const onMenuClose = (_event: SyntheticEvent) => setMenuAnchorEl(null);

  const onMenuItemClick = (event: SyntheticEvent, action: 'up' | 'down' | 'edit' | 'delete') => {
    if (action === 'delete') {
      setDeleteAnchorEl(event.currentTarget);
    } else if (action === 'edit') {
      setEditMode(true);
      setNewName(name);
    } else if (action === 'up' || action === 'down') {
      updateLayoutOrderMutation.mutate({ layoutName: name, direction: action });
    }
    setMenuAnchorEl(null);
  };

  const handleOnBlur = async (_event: any) => {
    setEditMode(false);
    if (!errorMessage && name !== newName) {
      await dispatch(FormLayoutActions.updateLayoutName({ oldName: name, newName }));
      setSearchParams({ ...deepCopy(searchParams), layout: newName });
    } else {
      setNewName('');
      setErrorMessage('');
    }
  };

  const pageNameExists = (candidateName: string): boolean =>
    layoutOrder.some((p: string) => p.toLowerCase() === candidateName.toLowerCase());

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const nameRegex = new RegExp('^[a-zA-Z0-9_\\-\\.]*$');
    const newNameCandidate = event.target.value.replace(/[/\\?%*:|"<>]/g, '-').trim();
    if (pageNameExists(newNameCandidate)) {
      setErrorMessage(t('left_menu.pages_error_unique'));
    } else if (!newNameCandidate) {
      setErrorMessage(t('left_menu.pages_error_empty'));
    } else if (newNameCandidate.length >= 30) {
      setErrorMessage(t('left_menu.pages_error_length'));
    } else if (!newNameCandidate.match(nameRegex)) {
      setErrorMessage(t('left_menu.pages_error_format'));
    } else {
      setErrorMessage('');
      setNewName(newNameCandidate);
    }
  };

  const handleKeyPress = async (event: any) => {
    if (event.key === 'Enter' && !errorMessage && name !== newName) {
      updateLayoutNameMutation.mutate({ oldName: name, newName });
      setSearchParams({ ...deepCopy(searchParams), layout: newName });
      setEditMode(false);
    } else if (event.key === 'Escape') {
      setEditMode(false);
      setNewName('');
    }
  };

  const handleConfirmDeleteClose = () => setDeleteAnchorEl(null);

  const handleConfirmDelete = () => {
    setDeleteAnchorEl(null);
    deleteLayoutMutation.mutate({ layoutName: name });
    setSearchParams(removeKey(searchParams, 'layout'));
  };

  return (
    <div
      className={cn({ [classes.selected]: selectedLayout === name, [classes.invalid]: invalid })}
    >
      <div className={classes.elementContainer}>
        <div>
          <ChevronRightIcon
            visibility={selectedLayout === name ? 'visible' : 'hidden'}
            style={{
              width: 'auto',
              color: '#022F51',
            }}
          />
        </div>
        {editMode ? (
          <div>
            <TextField
              onBlur={handleOnBlur}
              onKeyDown={handleKeyPress}
              onChange={handleOnChange}
              defaultValue={name}
              isValid={!errorMessage}
            />
            <div className={classes.errorMessage}>{errorMessage}</div>
          </div>
        ) : (
          <div onClick={onPageClick}>{name}</div>
        )}
        <Button
          className={classes.ellipsisButton}
          icon={<MenuElipsisVerticalIcon />}
          onClick={onPageSettingsClick}
          style={menuAnchorEl ? { visibility: 'visible' } : {}}
          variant={ButtonVariant.Quiet}
        />
      </div>
      <AltinnMenu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={onMenuClose}>
        {layoutOrder.includes(name) && (
          <AltinnMenuItem
            onClick={(event) => onMenuItemClick(event, 'up')}
            disabled={disableUp || invalid}
            text={t('left_menu.page_menu_up')}
            iconClass='fa fa-arrowup'
            id='move-page-up-button'
          />
        )}
        {layoutOrder.includes(name) && (
          <AltinnMenuItem
            onClick={(event) => onMenuItemClick(event, 'down')}
            disabled={disableDown || invalid}
            text={t('left_menu.page_menu_down')}
            iconClass='fa fa-arrowdown'
            id='move-page-down-button'
          />
        )}
        <AltinnMenuItem
          onClick={(event) => onMenuItemClick(event, 'edit')}
          text={t('left_menu.page_menu_edit')}
          iconClass='fa fa-write'
          id='edit-page-button'
          disabled={invalid}
        />
        <Divider marginless/>
        <AltinnMenuItem
          onClick={(event) => onMenuItemClick(event, 'delete')}
          text={t('left_menu.page_menu_delete')}
          iconClass='fa fa-trash'
          id='delete-page-button'
        />
      </AltinnMenu>
      <ConfirmModal
        anchorEl={deleteAnchorEl}
        open={Boolean(deleteAnchorEl)}
        header={t('left_menu.page_delete_header')}
        description={t('left_menu.page_delete_information', { name })}
        confirmText={t('left_menu.page_delete_confirm')}
        cancelText={t('left_menu.page_delete_cancel')}
        onClose={handleConfirmDeleteClose}
        onCancel={handleConfirmDeleteClose}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
