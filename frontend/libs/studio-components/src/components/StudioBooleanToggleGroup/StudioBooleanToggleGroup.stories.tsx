import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { StudioBooleanToggleGroup } from './StudioBooleanToggleGroup';

type Story = StoryFn<typeof StudioBooleanToggleGroup>;

const meta: Meta = {
  title: 'Forms/StudioBooleanToggleGroup',
  component: StudioBooleanToggleGroup,
};

export default meta;
export const Preview: Story = (args) => (
  <StudioBooleanToggleGroup {...args}></StudioBooleanToggleGroup>
);

Preview.args = {
  value: false,
  trueLabel: 'Yes',
  falseLabel: 'No',
};
