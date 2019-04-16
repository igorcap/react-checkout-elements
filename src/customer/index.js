import React from 'react'
import { Field } from 'formik'
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone'
import isEmpty from 'validator/lib/isEmpty'
import { Fieldset, Row, ErrorMessage, Input, Label } from '../'
// import styled, { css } from 'styled-components'

const validateEmail = (value = '') => {
  let errorMessage
  if (isEmpty(value, { ignore_whitespace: true })) {
    errorMessage = 'Укажите адрес эл. почты'
  } else if (!isEmail(value)) {
    errorMessage = 'Укажите валидный адрес эл. почты'
  }

  return errorMessage
}

const validatePhone = (value = '') => {
  let errorMessage

  console.log(value, ' : ', isMobilePhone(value))

  if (isEmpty(value, { ignore_whitespace: true })) {
    errorMessage = 'Укажите телефон'
  } else if (!isMobilePhone(value)) {
    errorMessage = 'Укажите правильный телефон'
  }

  return errorMessage
}

const validateName = (firstName = true) => (value = '') => {
  let errorMessage

  if (isEmpty(value, { ignore_whitespace: true })) {
   errorMessage = `Укажите ${firstName ? 'имя' : 'фамилию'}`;
  }

  return errorMessage
}

const validateFirstName = validateName()
const validateLastName = validateName(false)

const FormInput = ({ inline, label, placeholder, ...props }) => (
    <Field {...props}>
      {({ field, form: { touched, errors } }) => {
        const errorMessage = errors[field.name] || null
        const hasError = touched[field.name] && errorMessage 
        const empty = !field.value || field.value.length === 0
        // console.log(field)

        return (
          <Row 
            inline={inline}
            error={hasError}
            empty={empty}>
            <Input
              {...field}
              showPlaceholder={false}
              placeholder={placeholder}
              type="text" />

            {label &&
              <Label>{label}</Label>
            }

            {/* (hasError && errorMessage) &&
              <ErrorMessage>{errorMessage}</ErrorMessage>
              */}
          </Row>
        )
      }}
    </Field>
)


const FirstName = props => (
  <FormInput label="Имя" placeholder="Иван" name="first_name" validate={validateFirstName} {...props} />
)

const LastName = props => (
  <FormInput label="Фамилия" placeholder="Петров" name="last_name" validate={validateLastName} {...props} />
)

const Email = (props) => (
  <FormInput label="Эл. почта" placeholder="email@example.com" name="email" validate={validateEmail} {...props} />
)

const Phone = (props) => (
  <FormInput label="Телефон" placeholder="+79823332211" name="phone" validate={validatePhone} {...props} />
)

const Customer = ({ title = 'Контактная информация' }) => (
  <Fieldset title={title}>
    <FirstName inline />
    <LastName inline />
    <Email inline />
    <Phone inline />
  </Fieldset>
)

export {
  Customer as default,
  Email,
  Phone,
  FirstName,
  LastName
}
