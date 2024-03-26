import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { StudioLabelWrapper } from './StudioLabelWrapper';

type Story = StoryFn<typeof StudioLabelWrapper>;

const meta: Meta = {
  title: 'Forms/StudioLabelWrapper',
  component: StudioLabelWrapper,
};
export const Preview: Story = (args): React.ReactElement => <StudioLabelWrapper {...args} />;

Preview.args = {
  withAsterisk: true,
  children: 'Label',
};
export default meta;
