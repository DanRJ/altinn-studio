import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Textfield, Heading, Link as DigdirLink } from '@digdir/designsystemet-react';
import classes from './AccessListDetail.module.css';
import type { AccessList, ResourceError } from 'app-shared/types/ResourceAdm';
import { FieldWrapper } from '../FieldWrapper';
import { useEditAccessListMutation } from '../../hooks/mutations/useEditAccessListMutation';
import { useDeleteAccessListMutation } from '../../hooks/mutations/useDeleteAccessListMutation';
import { AccessListMembers } from '../AccessListMembers';
import { TrashIcon } from '@studio/icons';
import { StudioButton, StudioModal } from '@studio/components';
import { ServerCodes } from 'app-shared/enums/ServerCodes';
import { AccessListPreconditionFailedToast } from '../AccessListPreconditionFailedToast';

export interface AccessListDetailProps {
  org: string;
  env: string;
  list: AccessList;
  backUrl: string;
}

export const AccessListDetail = ({
  org,
  env,
  list,
  backUrl,
}: AccessListDetailProps): React.JSX.Element => {
  const { t } = useTranslation();

  const deleteWarningModalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  const [latestEtag, setLatestEtag] = useState<string>(list.etag || '');
  const [listName, setListName] = useState<string>(list.name || '');
  const [listDescription, setListDescription] = useState<string>(list.description || '');

  const { mutate: editAccessList } = useEditAccessListMutation(org, list.identifier, env);
  const { mutate: deleteAccessList, isPending: isDeletingAccessList } = useDeleteAccessListMutation(
    org,
    list.identifier,
    env,
  );

  const checkForEtagVersionError = (error: Error): void => {
    if ((error as ResourceError).response.status === ServerCodes.PreconditionFailed) {
      toast.error(<AccessListPreconditionFailedToast />);
    }
  };

  // change list name, description and possibly other properties
  const handleSave = (accessList: AccessList): void => {
    editAccessList(
      { ...accessList, etag: latestEtag },
      {
        onSuccess: (data: AccessList) => {
          setLatestEtag(data.etag);
        },
        onError: (error) => {
          checkForEtagVersionError(error);
        },
      },
    );
  };

  const handleDelete = (): void => {
    deleteAccessList(latestEtag, {
      onSuccess: () => {
        toast.success(t('resourceadm.listadmin_delete_list_success', { listname: listName }));
        navigate(backUrl);
      },
      onError: (error) => {
        checkForEtagVersionError(error);
        closeModal();
      },
    });
  };

  const closeModal = (): void => {
    deleteWarningModalRef.current?.close();
  };

  return (
    <div className={classes.accessListDetailWrapper}>
      <StudioModal.Root>
        <StudioModal.Dialog
          ref={deleteWarningModalRef}
          onClose={closeModal}
          closeButtonTitle={t('resourceadm.close_modal')}
          heading={t('resourceadm.listadmin_delete_list_header')}
          footer={
            <>
              <StudioButton color='danger' onClick={() => handleDelete()}>
                {t('resourceadm.listadmin_delete_list')}
              </StudioButton>
              <StudioButton variant='tertiary' onClick={closeModal}>
                {t('general.cancel')}
              </StudioButton>
            </>
          }
        >
          {t('resourceadm.listadmin_delete_list_description')}
        </StudioModal.Dialog>
      </StudioModal.Root>
      <div>
        <DigdirLink asChild>
          <Link to={backUrl}>{t('general.back')}</Link>
        </DigdirLink>
      </div>
      <Heading level={1} size='large'>
        {t('resourceadm.listadmin_list_detail_header')}
      </Heading>
      <FieldWrapper
        label={t('resourceadm.listadmin_list_id')}
        description={t('resourceadm.listadmin_list_id_description')}
      >
        <Textfield value={list.identifier} readOnly />
      </FieldWrapper>
      <FieldWrapper
        fieldId='listname'
        label={t('resourceadm.listadmin_list_name')}
        description={t('resourceadm.listadmin_list_name_description')}
        ariaDescriptionId='listname-description'
      >
        <Textfield
          id='listname'
          aria-describedby='listname-description'
          value={listName}
          onChange={(event) => setListName(event.target.value)}
          onBlur={(event) => handleSave({ ...list, name: event.target.value })}
        />
      </FieldWrapper>
      <FieldWrapper
        fieldId='listdescription'
        label={t('resourceadm.listadmin_list_description')}
        description={t('resourceadm.listadmin_list_description_description')}
        ariaDescriptionId='listdescription-description'
      >
        <Textfield
          id='listdescription'
          aria-describedby='listdescription-description'
          value={listDescription}
          onChange={(event) => setListDescription(event.target.value)}
          onBlur={(event) => handleSave({ ...list, description: event.target.value })}
        />
      </FieldWrapper>
      <AccessListMembers
        org={org}
        env={env}
        list={list}
        latestEtag={latestEtag}
        setLatestEtag={setLatestEtag}
      />
      <div>
        <StudioButton
          variant='tertiary'
          color='danger'
          icon={<TrashIcon className={classes.deleteIcon} />}
          iconPlacement='right'
          onClick={() => deleteWarningModalRef.current?.showModal()}
          disabled={isDeletingAccessList}
          size='medium'
        >
          {t('resourceadm.listadmin_delete_list')}
        </StudioButton>
      </div>
    </div>
  );
};
