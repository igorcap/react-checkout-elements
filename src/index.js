import React, { useState } from 'react'
import { Formik, connect } from 'formik'
import styled, { css } from 'styled-components'
import { rgba } from 'polished'
import CreditCard, { ThreedSecure, validator as validate } from './credit-card'
import Customer from './customer'

const RowStyles = `
`
export const Row = styled.div`
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

${props => props.inline && css `
  width: calc((100% / 2) - 5px);

  &:nth-child(odd) {
    margin-right: 10px;
  }
  `}
`

const Rows = styled.div`
display: flex;
flex-flow: wrap;
`

const FieldsetElement = styled.fieldset`
border: none;
padding: 0;
margin: 0 0 30px;
width: 100%;

&:last-child {
  margin: 0;
}
`

const FieldsetTitle = styled.div`
width: 100%;
margin: 0 0 15px;
font-size: 12px;
    color: #565e66;
    letter-spacing: 1.1px;
font-weight: 700;
text-transform: uppercase;
`

export const Fieldset = ({ children, title }) => (
  <FieldsetElement>
    {title &&
      <FieldsetTitle>{title}</FieldsetTitle>
    }

    <Rows>
      {children}
    </Rows>
  </FieldsetElement>
)

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
`

export const Label = styled.label`
  ${labelStyles}
`

export const ErrorMessage = styled.div`
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
`

const Submit = styled.button.attrs(() => ({
  type: 'submit',
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
`

export const Input = styled.input.attrs(({ showPlaceholder = true }) => ({
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
`
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
`

const FormElements = styled.div`
  position: relative;
  margin: 0 0 30px;
`

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
`

const StatusElement = styled.div`
  position: absolute;
  top: 0;
left: 0;
width: 100%;
height: 100%;
background: ${rgba('#fff',0.6)};
z-index: 333;
`

const StatusText = styled.div`
position: relative;
top: 50%;
text-align: center;
transform: perspective(1px) translateY(-50%);
`

const Status = ({ text = 'Loading...', ...props }) => (
  <StatusElement>
    <StatusText>
      {text}
    </StatusText>
  </StatusElement>
)

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
`
const formatError = fields => Object.keys(fields).map(field => {
	if (typeof fields[field] === 'string') {
	  return (
	    <li key={field}>{fields[field]}</li>
	  )
	}
      })

export const Errors = ({ list = null }) => {
  const fields = Object.keys(list)

  if (fields.length < 1) {
    return null
  }


  return (
    <ErrorsList>
      {fields.map(field => {
	if (typeof list[field] === 'string') {
	  return (
	    <li key={field}>{list[field]}</li>
	  )
	} else {
	  return formatError(list[field])
	}
      })}
    </ErrorsList>
  )
}

export const Forms = ({ children, submitText, submitFullWidth, submitting = false, ...props }) => {
  return (
  <Formik {...props}>
    {({ handleSubmit, handleReset, isValid, isSubmitting, errors }) => {
      return (
      <Form onReset={handleReset} onSubmit={handleSubmit}>
	<FormElements>
	  <Blurred active={submitting}>
	    {children}
	  </Blurred>
	  {/* submitting &&
	    <Status />
	    */}
	</FormElements>
	<Errors list={errors} />
	<Submit full={submitFullWidth} disabled={!isValid || isSubmitting} loading={submitting}>
	  {submitting ? 'Submitting...' : submitText}
	</Submit>
      </Form>
      )
    }}
  </Formik>
  )
}

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
`

const FeedbackMessage = styled.span`
  position: absolute;
  width: auto;
  right: 0;
`

export const Feedback = ({ children, ...props }) => (
  <FeedbackElement>
    <svg x="0px" y="0px" viewBox="0 0 65 65">
      <g>
	<g>
		<path d="M32.5,0C14.58,0,0,14.579,0,32.5S14.58,65,32.5,65S65,50.421,65,32.5S50.42,0,32.5,0z M32.5,61C16.785,61,4,48.215,4,32.5
			S16.785,4,32.5,4S61,16.785,61,32.5S48.215,61,32.5,61z"/>
		<circle cx="33.018" cy="19.541" r="3.345"/>
		<path d="M32.137,28.342c-1.104,0-2,0.896-2,2v17c0,1.104,0.896,2,2,2s2-0.896,2-2v-17C34.137,29.237,33.241,28.342,32.137,28.342z
			"/>
	</g>
</g>
    </svg>
    <FeedbackMessage>{children}</FeedbackMessage>
  </FeedbackElement>
)
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
`

export const Clear = props => (
  <ClearElement {...props}>
    <svg width="64" height="64" viewBox="0 0 64 64">
      <g>
      <path d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>
    </g>
  </svg>
  </ClearElement>
)

const formatCard = ({ expiry, ...card }) => {
  const { month, year } = validate.expirationDate(expiry) 
   
  return {
    ...card,
    expiry: {
      month,
      year
    }
  }
}
 
const Checkout = ({ card = true, customer = true, onSubmit, children, formik, ...props }) => {
  const [submitting, setSubmitting] = useState(false)
  const [threedSecureUrl, setThreedSecureUrl] = useState(null)

  const submit  = (values, actions) => {
    if (typeof onSubmit !== 'function') {
      return false
    }

    setSubmitting(true)

    // console.log(actions)

    const formData = {
      ...values,
      card: formatCard(values.card)
    }
    const result = onSubmit(formData, setSubmitting, setThreedSecureUrl)

    // setTimeout(() => {
    //   actions.resetForm()
    // }, 1000)

    // if (result instanceof Promise) {
    // Promise.resolve(result).then(() => setSubmitting(false))
    // }
  }

  if (!(card || customer)) {
    return null
  }

  // console.log(formik)

  return (
    <Forms 
      {...props}
      onSubmit={submit}
      submitting={submitting}>
      {customer &&
	<Customer />
      }
      {card &&
	<CreditCard
	  threedSecure={!!threedSecureUrl}
	  threedSecureUrl={threedSecureUrl}
	  onThreedSecureComplete={() => {
	    setThreedSecureUrl(false) 
	    setSubmitting(false)
	    // formik.handleReset()
	  }} />
      }
      {children &&
	<Fieldset>{children}</Fieldset>
      }
    </Forms>
  )
}

const ConnectedCheckout = connect(Checkout)

export default Checkout
