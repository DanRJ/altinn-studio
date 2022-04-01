import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import TopToolbarButton from './TopToolbarButton';

let somethingHappened = false;
const action = () => {
  somethingHappened = true;
};

const makeWrapper = (text: string, style = 'text', disabled = false) => {
  let wrapper: any = null;
  act(() => {
    wrapper = mount(
      <TopToolbarButton
        faIcon='fa ai-trash'
        hideText={style === 'icon'}
        onClick={action}
        disabled={disabled}
        warning={style === 'warning'}
      >
        {text}
      </TopToolbarButton>,
    );
  });
  return wrapper;
};

beforeEach(() => {
  somethingHappened = false;
});

test('renders a text button', () => {
  const wrapper = makeWrapper('delete');
  const button = wrapper.find('ForwardRef(Button)');
  expect(button.length).toBe(1);
  expect(button.text()).toBe('delete');
  expect(button.find('button').text()).toBe('delete');
});

test('renders a icon only button with aria-label', () => {
  const wrapper = makeWrapper('delete', 'icon');
  const button = wrapper.find('ForwardRef(IconButton)').find('button');
  expect(button.length).toBe(1);
  expect(button.text()).not.toBe('delete');
  expect(button.prop('aria-label')).toBe('delete');
  expect(button.prop('className')).toContain('makeStyles-iconButton');
});

test('renders a warning button', () => {
  const wrapper = makeWrapper('delete', 'warning');
  const button = wrapper.find('ForwardRef(Button)').find('button');
  expect(button.length).toBe(1);
  expect(button.prop('className')).toContain('warn');
});

test('reacts to being clicked', () => {
  const wrapper = makeWrapper('delete', 'text');
  const button = wrapper.find('ForwardRef(Button)');
  button.simulate('click');
  expect(somethingHappened).toBeTruthy();
});

test('rects to being clicked (icon button)', () => {
  const wrapper = makeWrapper('delete', 'icon');
  const button = wrapper.find('ForwardRef(IconButton)');
  button.simulate('click');
  expect(somethingHappened).toBeTruthy();
});

test('does nothing when disabled', () => {
  const wrapper = makeWrapper('delete', 'text', true);
  const button = wrapper.find('ForwardRef(Button)');
  button.simulate('click');
  expect(somethingHappened).toBeFalsy();
});

test('does nothing when disabled (icon button)', () => {
  const wrapper = makeWrapper('delete', 'icon', true);
  const button = wrapper.find('ForwardRef(IconButton)');
  button.simulate('click');
  expect(somethingHappened).toBeFalsy();
});