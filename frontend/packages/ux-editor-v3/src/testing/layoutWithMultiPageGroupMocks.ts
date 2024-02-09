import type { ExternalComponentV3, ExternalFormLayoutV3 } from 'app-shared/types/api';
import { ComponentTypeV3 } from 'app-shared/types/ComponentTypeV3';
import type { IInternalLayout } from '../types/global';
import type { FormComponent } from '../types/FormComponent';
import type { FormContainer } from '../types/FormContainer';
import { customDataPropertiesMock, customRootPropertiesMock } from './layoutMock';
import { BASE_CONTAINER_ID } from 'app-shared/constants';

export const component1Id = 'component1';
export const component2Id = 'component2';
export const component3Id = 'component3';
export const component3_1Id = 'component3_1';
export const component3_2Id = 'component3_2';
export const component3_1_1Id = 'component3_1_1';
export const component3_1_2Id = 'component3_1_2';
export const component3_1_3Id = 'component3_1_3';
export const component3_1_4Id = 'component3_1_4';

const externalComponent1: ExternalComponentV3 = {
  id: component1Id,
  type: ComponentTypeV3.Paragraph,
};
const internalComponent1: FormComponent = {
  id: component1Id,
  itemType: 'COMPONENT',
  pageIndex: null,
  type: ComponentTypeV3.Paragraph,
};

const externalComponent2: ExternalComponentV3 = {
  id: component2Id,
  type: ComponentTypeV3.Input,
};
const internalComponent2: FormComponent = {
  id: component2Id,
  itemType: 'COMPONENT',
  pageIndex: null,
  propertyPath: 'definitions/inputComponent',
  type: ComponentTypeV3.Input,
};

const externalComponent3: ExternalComponentV3 = {
  id: component3Id,
  type: ComponentTypeV3.Group,
  children: [component3_1Id, component3_2Id],
};
const internalComponent3: FormContainer = {
  id: component3Id,
  itemType: 'CONTAINER',
  type: ComponentTypeV3.Group,
  pageIndex: null,
  propertyPath: 'definitions/groupComponent',
};

const externalComponent3_1: ExternalComponentV3 = {
  id: component3_1Id,
  children: [
    '0:' + component3_1_1Id,
    '0:' + component3_1_2Id,
    '1:' + component3_1_3Id,
    '1:' + component3_1_4Id,
  ],
  edit: { multiPage: true },
  type: ComponentTypeV3.Group,
};
const internalComponent3_1: FormContainer = {
  edit: { multiPage: true },
  id: component3_1Id,
  itemType: 'CONTAINER',
  type: ComponentTypeV3.Group,
  pageIndex: null,
  propertyPath: 'definitions/groupComponent',
};

const externalComponent3_1_1: ExternalComponentV3 = {
  id: component3_1_1Id,
  type: ComponentTypeV3.Paragraph,
};
const internalComponent3_1_1: FormComponent = {
  id: component3_1_1Id,
  type: ComponentTypeV3.Paragraph,
  itemType: 'COMPONENT',
  pageIndex: 0,
};

const externalComponent3_1_2: ExternalComponentV3 = {
  id: component3_1_2Id,
  type: ComponentTypeV3.ButtonGroup,
};
const internalComponent3_1_2: FormContainer = {
  id: component3_1_2Id,
  itemType: 'CONTAINER',
  type: ComponentTypeV3.ButtonGroup,
  pageIndex: 0,
  propertyPath: 'definitions/buttonGroupComponent',
};

const externalComponent3_1_3: ExternalComponentV3 = {
  id: component3_1_3Id,
  type: ComponentTypeV3.Accordion,
  children: [],
};
const internalComponent3_1_3: FormContainer = {
  id: component3_1_3Id,
  itemType: 'CONTAINER',
  type: ComponentTypeV3.Accordion,
  pageIndex: 1,
  propertyPath: 'definitions/accordionComponent',
};

const externalComponent3_1_4: ExternalComponentV3 = {
  id: component3_1_4Id,
  type: ComponentTypeV3.Paragraph,
};
const internalComponent3_1_4: FormComponent = {
  id: component3_1_4Id,
  itemType: 'COMPONENT',
  pageIndex: 1,
  type: ComponentTypeV3.Paragraph,
};

const externalComponent3_2: ExternalComponentV3 = {
  id: component3_2Id,
  type: ComponentTypeV3.Paragraph,
};
const internalComponent3_2: FormComponent = {
  id: component3_2Id,
  type: ComponentTypeV3.Paragraph,
  itemType: 'COMPONENT',
  pageIndex: null,
};

export const externalLayoutWithMultiPageGroup: ExternalFormLayoutV3 = {
  $schema: 'https://altinncdn.no/schemas/json/layout/layout.schema.v1.json',
  data: {
    layout: [
      externalComponent1,
      externalComponent2,
      externalComponent3,
      externalComponent3_1,
      externalComponent3_2,
      externalComponent3_1_1,
      externalComponent3_1_2,
      externalComponent3_1_3,
      externalComponent3_1_4,
    ],
    ...customDataPropertiesMock,
  },
  ...customRootPropertiesMock,
};

const baseContainer: FormContainer = {
  id: BASE_CONTAINER_ID,
  index: 0,
  itemType: 'CONTAINER',
  type: undefined,
  pageIndex: null,
};

export const internalLayoutWithMultiPageGroup: IInternalLayout = {
  components: {
    [component1Id]: internalComponent1,
    [component2Id]: internalComponent2,
    [component3_1_1Id]: internalComponent3_1_1,
    [component3_1_4Id]: internalComponent3_1_4,
    [component3_2Id]: internalComponent3_2,
  },
  containers: {
    [BASE_CONTAINER_ID]: baseContainer,
    [component3Id]: internalComponent3,
    [component3_1Id]: internalComponent3_1,
    [component3_1_2Id]: internalComponent3_1_2,
    [component3_1_3Id]: internalComponent3_1_3,
  },
  order: {
    [BASE_CONTAINER_ID]: [component1Id, component2Id, component3Id],
    [component3Id]: [component3_1Id, component3_2Id],
    [component3_1Id]: [component3_1_1Id, component3_1_2Id, component3_1_3Id, component3_1_4Id],
    [component3_1_2Id]: [],
    [component3_1_3Id]: [],
  },
  customRootProperties: customRootPropertiesMock,
  customDataProperties: customDataPropertiesMock,
};
