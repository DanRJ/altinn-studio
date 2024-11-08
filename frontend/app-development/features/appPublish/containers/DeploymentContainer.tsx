import React, { useMemo } from 'react';
import classes from './DeploymentContainer.module.css';
import { AltinnContentLoader } from '../components/AltinnContentLoader';
import {
  useOrgListQuery,
  useEnvironmentsQuery,
  useAppDeploymentsQuery,
} from '../../../hooks/queries';
import type { Environment } from 'app-shared/types/Environment';
import { useStudioEnvironmentParams } from 'app-shared/hooks/useStudioEnvironmentParams';
import { DeploymentEnvironment } from '../components/DeploymentEnvironment';
import { getAppLink } from 'app-shared/ext-urls';
import { useTranslation } from 'react-i18next';
import { PROD_ENV_TYPE } from 'app-shared/constants';
import { StudioError } from '@studio/components';

export const DeploymentContainer = () => {
  const { org, app } = useStudioEnvironmentParams();
  const { t } = useTranslation();

  const {
    data: environmentList = [],
    isPending: environmentListIsPending,
    isError: environmentListIsError,
  } = useEnvironmentsQuery({ hideDefaultError: true });
  const {
    data: orgs,
    isPending: orgsIsPending,
    isError: orgsIsError,
  } = useOrgListQuery({ hideDefaultError: true });
  const {
    data: appDeployment,
    isPending: appDeploymentIsPending,
    isError: appDeploymentIsError,
  } = useAppDeploymentsQuery(org, app, { hideDefaultError: true });

  const orgName: string = useMemo(() => {
    let name = '';
    if (orgs && orgs[org]) {
      name = orgs[org].name.nb;
    }
    return name;
  }, [org, orgs]);

  if (environmentListIsPending || orgsIsPending || appDeploymentIsPending) {
    return (
      <div className={classes.deployContainer}>
        <AltinnContentLoader width={900} height={320} title={t('app_deployment.loading')}>
          <rect x='60' y='13' rx='0' ry='0' width='650' height='76' />
          <rect x='60' y='110' rx='0' ry='0' width='333' height='44' />
          <rect x='60' y='171' rx='0' ry='0' width='202' height='41' />
          <rect x='487' y='111' rx='0' ry='0' width='220' height='42' />
        </AltinnContentLoader>
      </div>
    );
  }

  if (environmentListIsError || orgsIsError || appDeploymentIsError)
    return (
      <div className={classes.deployContainer}>
        <StudioError className={classes.alert}>{t('app_deployment.error')}</StudioError>
      </div>
    );

  const selectedOrg = orgs?.[org];
  const orgEnvironmentList: Environment[] = environmentList.filter((env: Environment) =>
    selectedOrg.environments.some((envName) => envName.toLowerCase() === env.name.toLowerCase()),
  );

  return (
    <div className={classes.deployContainer}>
      {orgEnvironmentList.map((orgEnvironment: Environment) => {
        const pipelineDeploymentList = appDeployment.pipelineDeploymentList.filter(
          (item) => item.envName.toLowerCase() === orgEnvironment.name.toLowerCase(),
        );
        const kubernetesDeployment = appDeployment.kubernetesDeploymentList.find(
          (item) => item.envName.toLowerCase() === orgEnvironment.name.toLowerCase(),
        );
        return (
          <DeploymentEnvironment
            key={orgEnvironment.name}
            envName={orgEnvironment.name}
            isProduction={orgEnvironment.type.toLowerCase() === PROD_ENV_TYPE}
            urlToApp={getAppLink(orgEnvironment.appPrefix, orgEnvironment.hostname, org, app)}
            pipelineDeploymentList={pipelineDeploymentList}
            kubernetesDeployment={kubernetesDeployment}
            orgName={orgName}
          />
        );
      })}
    </div>
  );
};
