var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React, { useState } from 'react';
import { Formik, connect } from 'formik';
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import CreditCard, { ThreedSecure, validate } from './credit-card';
import Customer from './customer';

const RowStyles = `
`;
const Row = styled.div`
width: 100%;
position: relative;
margin-bottom: 10px;

${props => !props.empty && css`
  ${Label} {
    background: #fff;
    transform: scale(.75) translateY(-33px); // translateX(3px);
    // color: ${props.error ? 'red' : '#1D96F3'} !important;
  }
  `}

${props => props.error && css`
  ${Input} {
    border-color: red !important;

    &:focus~  {
      ${Label} {
        color: red;
      }
    } 
  }
  `}

${props => props.inline && css`
  width: calc((100% / 2) - 5px);

  &:nth-child(odd) {
    margin-right: 10px;
  }
  `}
`;

const Rows = styled.div`
display: flex;
flex-flow: wrap;
`;

const FieldsetElement = styled.fieldset`
border: none;
padding: 0;
margin: 0 0 30px;
width: 100%;

&:last-child {
  margin: 0;
}
`;

const FieldsetTitle = styled.div`
width: 100%;
margin: 0 0 15px;
font-size: 12px;
    color: #565e66;
    letter-spacing: 1.1px;
font-weight: 700;
text-transform: uppercase;
`;

const Fieldset = ({ children, title }) => React.createElement(
  FieldsetElement,
  null,
  title && React.createElement(
    FieldsetTitle,
    null,
    title
  ),
  React.createElement(
    Rows,
    null,
    children
  )
);

const labelStyles = `
  background-color: transparent;
  bottom: 17px;
  box-sizing: border-box;
  color: #80868b;
  left: 8px;
  padding: 0 8px;
  transition: transform .15s cubic-bezier(.4,0,.2,1),opacity .15s cubic-bezier(.4,0,.2,1),background-color .15s cubic-bezier(.4,0,.2,1);
  width: auto;
  z-index: 1;
  font-size: 16px;
  pointer-events: none;
  position: absolute;
  transform-origin: bottom left;
  font-family: Helvetica,Arial,sans-serif;
`;

const Label = styled.label`
  ${labelStyles}
`;

const ErrorMessage = styled.div`
  ${labelStyles}
  transform-origin: bottom right;
  right: 8px;
  left: auto;
  text-align: right;
  transition: none;
  // transform: scale(.75) translateY(-33px); // translateX(3px);
  background: #fff;
  color: red;
  font-size: 12px;
  bottom: -5px;
`;

const Submit = styled.button.attrs(() => ({
  type: 'submit'
}))`
  display: block;
  clear: both;
  border: none;
  font-size: 30px;
  // text-transform: uppercase;
  color: #fff;
  width: ${props => props.full ? '100%' : 'auto'};
  border-radius: 3px;
  // margin: 24px 0;
  transition: all .125s ease;
  background: #1d96f3;
  font-size: 16px;
  height: 48px;
  cursor: pointer;
  letter-spacing: 1px;
  padding: 0 20px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.loading && css`
    cursor: wait !important;
  `}
`;

const Input = styled.input.attrs(({ showPlaceholder = true }) => ({
  showPlaceholder: showPlaceholder
}))`
padding: 12px 14px;  
border: 1px solid #ccc;
border-radius: 3px;
line-height: 24px;
// height: 28px;
outline: none;
display: block;
width: 100%;
box-sizing: border-box;
// margin: 2px;
font-size: 16px;
// transition: border-color .05s ease-in;

&::placeholder {
  color: #C9D3DC;
  opacity: 1;
}

${props => !props.showPlaceholder && css`
    &::placeholder {
      color: transparent;
      opacity: 0;
    }
`}

&:focus {
  border-color: #1D96F3;

  ${props => !props.showPlaceholder && css`
  &::placeholder {
    color: #C9D3DC;
    opacity: 1;
  }
  `}

  &~${Label} {
    transform: scale(.75) translateY(-33px); // translateX(3px);
    background: #fff;
    color: #1D96F3;
  } 
}

// &:after {
  //   content: '';
  //   border-radius: 4px;
  //   bottom: 0;
  //   opacity: 0;
  //   transform: none;
  //   transition: opacity 150ms cubic-bezier(0.4,0,0.2,1);
  //   width: calc(100% - 2*2px);
  //   border: 2px solid transparent;
  // }
`;
const Form = styled.form`
  display: flex;
  flex-flow: wrap;

// * {
//   margin: 0;
// 	padding: 0;
// 	border: 0;
// 	font-size: 100%;
// 	font: inherit;
// 	vertical-align: baseline;
// }
`;

const FormElements = styled.div`
  position: relative;
  margin: 0 0 30px;
`;

const Blurred = styled.div`

${FieldsetElement} {
  transition: all .2s;
}

${props => props.active && css`
  ${FieldsetElement} {
    opacity: 0.4;
    // filter: blur(2px);
    pointer-events: none;
  }
`}
`;

const StatusElement = styled.div`
  position: absolute;
  top: 0;
left: 0;
width: 100%;
height: 100%;
background: ${rgba('#fff', 0.6)};
z-index: 333;
`;

const StatusText = styled.div`
position: relative;
top: 50%;
text-align: center;
transform: perspective(1px) translateY(-50%);
`;

const Status = (_ref) => {
  let { text = 'Loading...' } = _ref,
      props = _objectWithoutProperties(_ref, ['text']);

  return React.createElement(
    StatusElement,
    null,
    React.createElement(
      StatusText,
      null,
      text
    )
  );
};

const ErrorsList = styled.ul`
  list-style: none; 
  margin: 0 0 30px;
  padding: 0;
  display: block;
  width: 100%;
  clear: both;
  color: red;
    padding: 10px 14px;
    background: #fff;
    // border: 1px solid red;
    background: rgba(255, 0, 0, 0.09);
    border-radius: 3px;

li {
  line-height: 1.5;
}
`;
const formatError = fields => Object.keys(fields).map(field => {
  if (typeof fields[field] === 'string') {
    return React.createElement(
      'li',
      { key: field },
      fields[field]
    );
  }
});

const Errors = ({ list = null }) => {
  const fields = Object.keys(list);

  if (fields.length < 1) {
    return null;
  }

  return React.createElement(
    ErrorsList,
    null,
    fields.map(field => {
      if (typeof list[field] === 'string') {
        return React.createElement(
          'li',
          { key: field },
          list[field]
        );
      } else {
        return formatError(list[field]);
      }
    })
  );
};

const Forms = (_ref2) => {
  let { children, submitText, submitting = false } = _ref2,
      props = _objectWithoutProperties(_ref2, ['children', 'submitText', 'submitting']);

  return React.createElement(
    Formik,
    props,
    ({ handleSubmit, handleReset, isValid, isSubmitting, errors }) => {
      return React.createElement(
        Form,
        { onReset: handleReset, onSubmit: handleSubmit },
        React.createElement(
          FormElements,
          null,
          React.createElement(
            Blurred,
            { active: submitting },
            children
          )
        ),
        React.createElement(Errors, { list: errors }),
        React.createElement(
          Submit,
          { disabled: !isValid || isSubmitting, loading: submitting },
          submitting ? 'Submitting...' : submitText
        )
      );
    }
  );
};

const FeedbackElement = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 32px;
  height: 32px;
  text-align: center;
  cursor: pointer;
  
svg {
    width: 60%;
    height: 60%;
    opacity: 0.8;
    fill: red;
    position: relative;
    top: 4px;
}
`;

const FeedbackMessage = styled.span`
  position: absolute;
  width: auto;
  right: 0;
`;

const Feedback = (_ref3) => {
  let { children } = _ref3,
      props = _objectWithoutProperties(_ref3, ['children']);

  return React.createElement(
    FeedbackElement,
    null,
    React.createElement(
      'svg',
      { x: '0px', y: '0px', viewBox: '0 0 65 65' },
      React.createElement(
        'g',
        null,
        React.createElement(
          'g',
          null,
          React.createElement('path', { d: 'M32.5,0C14.58,0,0,14.579,0,32.5S14.58,65,32.5,65S65,50.421,65,32.5S50.42,0,32.5,0z M32.5,61C16.785,61,4,48.215,4,32.5 S16.785,4,32.5,4S61,16.785,61,32.5S48.215,61,32.5,61z' }),
          React.createElement('circle', { cx: '33.018', cy: '19.541', r: '3.345' }),
          React.createElement('path', { d: 'M32.137,28.342c-1.104,0-2,0.896-2,2v17c0,1.104,0.896,2,2,2s2-0.896,2-2v-17C34.137,29.237,33.241,28.342,32.137,28.342z ' })
        )
      )
    ),
    React.createElement(
      FeedbackMessage,
      null,
      children
    )
  );
};
const ClearElement = styled.span`
  position: absolute;
right: 15px;
    top: calc(50% - 7px);
    display: block;
    line-height: 1;
cursor: pointer;
opacity: 0.6;
transition: all .2s;

&:hover {
  opacity: 1;
  svg {
    fill: #1D96F3;
  }
}

svg {
  width: 14px;
  height: 14px;
  transition: all .2s;
  // fill: #ccc;
}
`;

const Clear = props => React.createElement(
  ClearElement,
  props,
  React.createElement(
    'svg',
    { width: '64', height: '64', viewBox: '0 0 64 64' },
    React.createElement(
      'g',
      null,
      React.createElement('path', { d: 'M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z' })
    )
  )
);

const formatCard = (_ref4) => {
  let { expiry } = _ref4,
      card = _objectWithoutProperties(_ref4, ['expiry']);

  const { month, year } = validate.expirationDate(expiry);

  return _extends({}, card, {
    expiry: {
      month,
      year
    }
  });
};

const Checkout = (_ref5) => {
  let { card = true, customer = true, onSubmit, children, formik } = _ref5,
      props = _objectWithoutProperties(_ref5, ['card', 'customer', 'onSubmit', 'children', 'formik']);

  const [submitting, setSubmitting] = useState(false);
  const [threedSecureUrl, setThreedSecureUrl] = useState(null);

  const submit = (values, actions) => {
    if (typeof onSubmit !== 'function') {
      return false;
    }

    setSubmitting(true);

    // console.log(actions)

    const formData = _extends({}, values, {
      card: formatCard(values.card)
    });
    const result = onSubmit(formData, setSubmitting, setThreedSecureUrl);

    // setTimeout(() => {
    //   actions.resetForm()
    // }, 1000)

    // if (result instanceof Promise) {
    // Promise.resolve(result).then(() => setSubmitting(false))
    // }
  };

  if (!(card || customer)) {
    return null;
  }

  // console.log(formik)

  return React.createElement(
    Forms,
    _extends({}, props, {
      onSubmit: submit,
      submitting: submitting }),
    customer && React.createElement(Customer, null),
    card && React.createElement(CreditCard, {
      threedSecure: !!threedSecureUrl,
      threedSecureUrl: threedSecureUrl,
      onThreedSecureComplete: () => {
        setThreedSecureUrl(false);
        setSubmitting(false);
        // formik.handleReset()
      } })
  );
};

const ConnectedCheckout = connect(Checkout);

export { Checkout as default, Forms, Row, Input, Label, ErrorMessage, Feedback, Submit, Fieldset, Clear, CreditCard, Customer };