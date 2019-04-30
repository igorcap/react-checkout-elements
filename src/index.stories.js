import React, { useState } from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { action, configureActions } from '@storybook/addon-actions'

import Checkout, { Submit, Fieldset, Forms } from './'
import Customer, { Email, FirstName, LastName, Phone } from './customer'
import CreditCard from './credit-card'

const styles = {
  // textAlign: 'center',
  margin: '30px',
  maxWidth: '600px'
};
const CenterDecorator = storyFn => <div style={styles}>{storyFn()}</div>;
addDecorator(CenterDecorator)

const CheckoutForm = (props) => {
  const submit = (values, done, threedSecure) => {
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
	// console.log(values)
	threedSecure('https://secure.payu.ru/order/3ds/return/tid/2Xrl83KEneyC1XG3d7-9eg/refno/62820787/attempt/2Xrl85iEoeuO6HXrfr_KZXKD3YLdl7Ft/sign/d354287866910dd4fd11aadd9707db20/')
	resolve()
      // }, 2000)
    })
  }
  
  return (
    <Checkout
      {...props}
      submitText="Submit"
      initialValues={{ first_name: 'John', last_name: 'Doe', email: 'john@doe.com', phone: '+79621112233', card: { number: '4242424242424242', expiry: '04 / 23', cvv: '123' } }}
  onSubmit={submit}>
    </Checkout>
  )
}

storiesOf('Checkout', module)
  .add('default view', () => (
    <Checkout 
      submitText="Submit"
      initialValues={{ first_name: '', last_name: '', email: '', phone: '', card: { number: '', expiry: '', cvv: '' } }}
      onSubmit={action('submitted')} />
  ))
  .add('with total ptice', () => (
    <Checkout 
      submitText="Submit"
      total="3 999 руб."
      initialValues={{ first_name: '', last_name: '', email: '', phone: '', card: { number: '', expiry: '', cvv: '' } }}
      onSubmit={action('submitted')} />
  ))
  .add('with agreement', () => (
    <Checkout 
      agreement
      agreementText=""
      submitText="Submit"
      total="3 999 руб."
      initialValues={{ first_name: '', last_name: '', email: '', phone: '', card: { number: '', expiry: '', cvv: '' } }}
      onSubmit={action('submitted')} />
  ))
  .add('Submitting', () => (
    <Forms
      submitting
      submitText="Submit"
      initialValues={{ first_name: '', last_name: '', email: '', phone: '', card: { number: '', expiry: '', cvv: '' } }}
      onSubmit={action('submitted')}>
      <Customer />
      <CreditCard submitting />
      </Forms>
  ))
  .add('With 3DS active', () => (
    <Forms
      submitting
      submitText="Submit"
      initialValues={{ first_name: '', last_name: '', email: '', phone: '', card: { number: '', expiry: '', cvv: '' } }}
      onSubmit={action('submitted')}>
      <Customer />
      <CreditCard
	threedSecure
	threedSecureUrl={'https://google.com'} />
      </Forms>
  ))
  .add('With submit request', () => (
    <CheckoutForm submitFullWidth />
  ))
