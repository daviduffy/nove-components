// External Dependencies
import React from 'react';
import { shallow } from 'enzyme';

// Internal Dependencies
import * as actions from '../contactForm';
import * as types from '../../constants/eventTypes';
import * as inputs from '../../constants/formInputs';
import * as forms from '../../fixtures/forms';

// basic
// =================================================================================================
test('should hydrated inputs with default values and paths', () => {
  const hydratedOrder = actions.getHydratedInputs({
    types: types.EVENT_TYPES_COMMON,
    inputs: inputs.FORM_ORDER.FULL
  });

  const Name = hydratedOrder.find(({ id }) => id === 'name');
  const Drawer = hydratedOrder.find(({ id }) => id === 'drawer');
  const EventVenue = hydratedOrder.find(({ id }) => id === 'eventVenue');

  expect(Name).toEqual(expect.objectContaining({
    ...inputs.name,
    ...inputs.FORM_ORDER.FULL[0]
  }));
  expect(Drawer).toEqual(expect.objectContaining({
    ...inputs.drawer,
    ...inputs.FORM_ORDER.FULL[5]
  }));
  expect(EventVenue).toEqual(expect.objectContaining({
    ...inputs.eventVenue,
    ...inputs.FORM_ORDER.FULL[6]
  }));
});

test('should return flat array of ready-to-render components', () => {
  const hydratedOrder = actions.getHydratedInputs({
    types: types.EVENT_TYPES_COMMON,
    inputs: inputs.FORM_ORDER.FULL
  });
  const inputComponents = actions.getInputConfig({
    eventDate: null,
    formError: '',
    inputs: hydratedOrder,
    onAmountChange: () => {},
    onDateChange: () => {},
    onEmailBlur: () => {},
    onInputChange: () => {},
    onPhoneBlur: () => {},
    windowWidth: 700
  });
  const [Name] = inputComponents;
  expect(Name).toEqual(expect.objectContaining({
    ...types.name,
    required: true,
    classes: 'F__g--name'
  }));
});

test('should return wrapped input components when wrapped func is passed', () => {
  const style = actions.getCSS(actions.getStyles({}));
  const hydratedOrder = actions.getHydratedInputs({
    types: types.EVENT_TYPES_COMMON,
    inputs: inputs.FORM_ORDER.FULL
  });
  const spy = jest.fn();
  const wrapped = Component => (
    <div className="wrapped" key={new Date()}>
      <button onClick={spy}>clickme</button>
      {Component}
    </div>
  );
  const inputComponents = actions.getInputConfig({
    eventDate: null,
    formError: '',
    inputs: hydratedOrder,
    onAmountChange: () => {},
    onDateChange: () => {},
    onEmailBlur: () => {},
    onInputChange: () => {},
    onPhoneBlur: () => {},
    windowWidth: 700
  });
  const renormalizedInputs = actions.renormalizeInputs(inputComponents);
  const renderedInputs = actions.getRenderedComponents({
    accordionOpen: true,
    inputComponents,
    onAccordionClick: () => {},
    renormalizedInputs,
    style,
    wrapped
  });

  const wrapper = shallow(<div>{renderedInputs}</div>);
  const DrawerProps = wrapper.find({ classes: 'F__g--drawer' }).props();
  expect(DrawerProps).toEqual(expect.objectContaining({
    ...types.drawer,
    ...inputs.FORM_ORDER.FULL[5]
  }));

  const drawerWrapper = shallow(<div>{DrawerProps.items}</div>);
  const EventVenue = drawerWrapper.find({ classes: 'F__g--eventVenue' });
  expect(EventVenue.props()).toEqual(expect.objectContaining({
    ...inputs.FORM_ORDER.FULL[6]
  }));

  expect(wrapper.find('button')).toHaveLength(8);
});


// Renormalization
// =================================================================================================
test('should structure renormalized inputs correctly', () => {
  const hydratedInputs = actions.getHydratedInputs({ inputs: forms.customLayout.inputs });
  const renormalizedInputs = actions.renormalizeInputs(hydratedInputs);

  const [I1, I2, I3,, I5] = renormalizedInputs;

  expect(I1).toEqual(expect.objectContaining({ path: '0', required: true }));
  expect(I2).toEqual(expect.objectContaining({ path: '1', placeholder: 'your@email.com' }));
  expect(I3).toEqual(expect.objectContaining({ path: '2', id: 'row' }));
  expect(I3.items[0]).toEqual(expect.objectContaining({ path: '2/row/0', label: 'Event Type' }));
  expect(I3.items[1]).toEqual(expect.objectContaining({ path: '2/row/1', placeholder: 'On or around' }));
  expect(I5).toEqual(expect.objectContaining({ path: '4', id: 'referralSource' }));
});

