var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { Field } from 'formik';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmpty from 'validator/lib/isEmpty';
import { Fieldset, Row, ErrorMessage, Input, Label } from '../';
// import styled, { css } from 'styled-components'

const validateEmail = (value = '') => {
  let errorMessage;
  if (isEmpty(value, { ignore_whitespace: true })) {
    errorMessage = 'Укажите адрес эл. почты';
  } else if (!isEmail(value)) {
    errorMessage = 'Укажите валидный адрес эл. почты';
  }

  return errorMessage;
};

const validatePhone = (value = '') => {
  let errorMessage;

  console.log(value, ' : ', isMobilePhone(value));

  if (isEmpty(value, { ignore_whitespace: true })) {
    errorMessage = 'Укажите телефон';
  } else if (!isMobilePhone(value)) {
    errorMessage = 'Укажите правильный телефон';
  }

  return errorMessage;
};

const validateName = (firstName = true) => (value = '') => {
  let errorMessage;

  if (isEmpty(value, { ignore_whitespace: true })) {
    errorMessage = `Укажите ${firstName ? 'имя' : 'фамилию'}`;
  }

  return errorMessage;
};

const validateFirstName = validateName();
const validateLastName = validateName(false);

const FormInput = (_ref) => {
  let { inline, label, placeholder } = _ref,
      props = _objectWithoutProperties(_ref, ['inline', 'label', 'placeholder']);

  return React.createElement(
    Field,
    props,
    ({ field, form: { touched, errors } }) => {
      const errorMessage = errors[field.name] || null;
      const hasError = touched[field.name] && errorMessage;
      const empty = !field.value || field.value.length === 0;
      // console.log(field)

      return React.createElement(
        Row,
        {
          inline: inline,
          error: hasError,
          empty: empty },
        React.createElement(Input, _extends({}, field, {
          showPlaceholder: false,
          placeholder: placeholder,
          type: 'text' })),
        label && React.createElement(
          Label,
          null,
          label
        )
      );
    }
  );
};

const FirstName = props => React.createElement(FormInput, _extends({ label: '\u0418\u043C\u044F', placeholder: '\u0418\u0432\u0430\u043D', name: 'first_name', validate: validateFirstName }, props));

const LastName = props => React.createElement(FormInput, _extends({ label: '\u0424\u0430\u043C\u0438\u043B\u0438\u044F', placeholder: '\u041F\u0435\u0442\u0440\u043E\u0432', name: 'last_name', validate: validateLastName }, props));

const Email = props => React.createElement(FormInput, _extends({ label: '\u042D\u043B. \u043F\u043E\u0447\u0442\u0430', placeholder: 'email@example.com', name: 'email', validate: validateEmail }, props));

const Phone = props => React.createElement(FormInput, _extends({ label: '\u0422\u0435\u043B\u0435\u0444\u043E\u043D', placeholder: '+79823332211', name: 'phone', validate: validatePhone }, props));

const Customer = ({ title = 'Контактная информация' }) => React.createElement(
  Fieldset,
  { title: title },
  React.createElement(FirstName, { inline: true }),
  React.createElement(LastName, { inline: true }),
  React.createElement(Email, { inline: true }),
  React.createElement(Phone, { inline: true })
);

export { Customer as default, Email, Phone, FirstName, LastName };