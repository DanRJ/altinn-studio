import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'app-shared/types/QueryKey';
import { useServicesContext } from 'app-shared/contexts/ServicesContext';
import { JsonSchema } from 'app-shared/types/JsonSchema';
import { useStudioUrlParams } from 'app-shared/hooks/useStudioUrlParams';

export const useSchemaMutation = (modelPath: string) => {
  const queryClient = useQueryClient();
  const { org, app } = useStudioUrlParams();
  const { saveDatamodel } = useServicesContext();
  return useMutation({
    mutationFn: async (payload: JsonSchema) => {
      await saveDatamodel(org, app, modelPath, payload);
      queryClient.setQueryData(
        [QueryKey.JsonSchema, org, app, modelPath],
        () => payload
      );
    },
  });
}