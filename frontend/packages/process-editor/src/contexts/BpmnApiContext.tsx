import type { LayoutSets, LayoutSetConfig } from 'app-shared/types/api/LayoutSetsResponse';
import React, { createContext, useContext } from 'react';
import type { MetaDataForm } from 'app-shared/types/BpmnMetaDataForm';
import type { DataTypeChange } from 'app-shared/types/api/DataTypeChange';
import type { OnProcessTaskEvent } from '../types/OnProcessTask';

type QueryOptions = {
  onSuccess: () => void;
};

export type BpmnApiContextProps = {
  availableDataModelIds: string[];
  allDataModelIds: string[];
  layoutSets: LayoutSets;
  pendingApiOperations: boolean;
  existingCustomReceiptLayoutSetId: string | undefined;
  addLayoutSet: (
    data: { layoutSetIdToUpdate: string; layoutSetConfig: LayoutSetConfig },
    options?: QueryOptions,
  ) => void;
  deleteLayoutSet: (data: { layoutSetIdToUpdate: string }) => void;
  mutateLayoutSetId: (data: { layoutSetIdToUpdate: string; newLayoutSetId: string }) => void;
  mutateDataType: (dataTypeChange: DataTypeChange, options?: QueryOptions) => void;
  saveBpmn: (bpmnXml: string, metaData?: MetaDataForm) => void;
  openPolicyEditor: () => void;
  onProcessTaskAdd: (taskMetadata: OnProcessTaskEvent) => void;
  onProcessTaskRemove: (taskMetadata: OnProcessTaskEvent) => void;
};

export const BpmnApiContext = createContext<Partial<BpmnApiContextProps>>(undefined);

export type BpmnApiContextProviderProps = {
  children: React.ReactNode;
} & BpmnApiContextProps;

export const BpmnApiContextProvider = ({
  children,
  ...rest
}: Partial<BpmnApiContextProviderProps>) => {
  return (
    <BpmnApiContext.Provider
      value={{
        ...rest,
      }}
    >
      {children}
    </BpmnApiContext.Provider>
  );
};

export const useBpmnApiContext = (): Partial<BpmnApiContextProps> => {
  const context = useContext(BpmnApiContext);
  if (context === undefined) {
    throw new Error('useBpmnApiContext must be used within a BpmnApiContextProvider');
  }
  return context;
};
