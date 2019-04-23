import React from 'react'
import { Field } from 'formik'
import styled, { css } from 'styled-components'
import { rgba } from 'polished';
import MaskedInput from 'react-text-mask'
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import validate from 'card-validator'
import { Fieldset, Clear, Feedback, ErrorMessage, Input, Label } from './'

// validate.creditCardType.addCard({
//   niceType: 'Mir',
//   type: 'mir',
//   prefixPattern: /^(22|220|220[0-4]|35(6|62|623|6234)?|9(0|05|051)?)$/,
//   exactPattern: /^(22|220|220[0-4]|35(6|62|623|6234)?|9(0|05|051)?)\d*$/,
//   gaps: [4, 8, 12],
//   lengths: [16, 18, 19],
//   code: {
//       name: 'CVV',
//       size: 3
//   }
// })

// validate.creditCardType.changeOrder('mir', 0)

const { creditCardType } = validate

export const validator = validate

// const Visa

const Card = styled.div`
width: 100%;
position: relative;
`

const CardField = styled.div`
  position: relative;
  width: 100%;

${props => props.fieldType !== 'number' && css`
  width: calc((100% / 2) - 5px); 
  float: left;
  margin-right: ${props => props.fieldType === 'expiry' ? '10px' : '0'}
`}

${Input} {
  width: 100%;
}

  &:first-child {
    margin-bottom: 10px;
  } 
${props => props.fieldType === 'expiry' && css`
  margin-right: 10px;
  `}

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
`

const CardInputElement = styled.input`
  
`

const CardInput = ({
  pipe = null, 
  type = 'text', 
  keepCharPositions = false, 
  mask = null, 
  inline, 
  label, 
  placeholder, 
  name: fieldName,
  keyName = 'card',
  ...props
}) => (
  <Field {...props} name={`${keyName}.${fieldName}`}>
    {({ field, form: { setFieldValue, touched, errors } }) => {
      const errorMessage = errors[keyName] ? errors[keyName][fieldName] : null
      const hasError = touched[keyName] && touched[keyName][fieldName] && errorMessage 
      const empty = !field.value || field.value.length === 0
      const ref = React.createRef()
      const clear = () => {
        setFieldValue(`${keyName}.${fieldName}`, '')
        ref.current.inputElement.focus()
      }

      // console.log(fieldName)

      return (
        <CardField
          fieldType={fieldName}
          inline={inline}
          error={hasError}
          empty={empty}>
          <MaskedInput
            ref={ref}
            {...field}
            // value={field.value || ''}
            mask={mask}
            pipe={pipe}
            keepCharPositions={keepCharPositions}
            guide={false}
            placeholder={placeholder}
            type={type}
            render={(ref, maskedProps) => (
              <Input
                ref={ref}
                {...maskedProps}
                showPlaceholder={false} />
            )}
            />

            {label &&
              <Label>{label}</Label>
            }

            {!empty &&
              <Clear onClick={clear} />
            }

            {/* <Feedback>Обязательное поле</Feedback> */}

            {/* (hasError && errorMessage) &&
              <Feedback>{errorMessage}</Feedback>
              */}
          </CardField>
      )
    }}
  </Field>
)

const validateNumber = (value = '') => {
  let errorMessage
  const cardNumber = validate.number(value.replace(/\s+/g, ''))

  if (!value) {
    errorMessage = 'Укажите номер карты'
  } else if (!(cardNumber && cardNumber.isValid)) {
     errorMessage= 'Укажите правильный номер карты'
  }
  return errorMessage
}
const CardNumber = ({ placeholder = '4242 4242 4242 4242' }) => (
  <CardInput
    label="Номер карты"
    placeholder={placeholder}
    name="number"
    validate={validateNumber}
    mask={[/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/]}  />
)

const validateExpiry = (value = '') => {
  let errorMessage
  const expiry = validate.expirationDate(value)

  if (!value) {
    errorMessage = 'Укажите срок дейсвия карты'
  } else if (!expiry.isValid) {
    errorMessage= 'Укажите правильный срок действия карты'
  }

  return errorMessage 
}

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm / yy', { minYear: 2019 })
const CardExpiry = ({ placeholder = '04 / 22' }) => (
  <CardInput
    label="Срок действия"
    placeholder={placeholder}
    name="expiry"
    keepCharPositions={true} 
    pipe={autoCorrectedDatePipe} 
    validate={validateExpiry}
    mask={[/\d/, /\d/, ' ', '/', ' ', /[1-9]/, /[0-9]/]}  />
)

const CardHolder = () => (
  <CardInput name="holder" />
)

const validateCVV = (value = '') => {
  let errorMessage
  const cvv = validate.cvv(value)

  if (!value) {
    errorMessage = 'Укажите CVV код'
  } else if (!cvv.isValid) {
    errorMessage = 'Укажите правильный cvv код'
  }

  return errorMessage 
}
const CardCVV = ({ placeholder = '123' }) => (
  <CardInput
    label="CVV код"
    placeholder={placeholder}
    type="password" 
    name="cvv" 
    validate={validateCVV}
    mask={[/\d/, /\d/, /\d/]} />
)

const numberMask = (rawValue = '') => {
  // const cards = creditCardType(rawValue)
  // const cardType = Array.isArray(cards) && cards[0] ? creditCardType.getTypeInfo(cards[0].type) : null

  // // console.log(rawValue)
  // console.log(validate.number(rawValue))

  // if (card) {
  //   var offsets = [].concat(0, card.gaps, cardNumber.length);
  //   var components = [];

  //   for (var i = 0; offsets[i] < cardNumber.length; i++) {
  //     var start = offsets[i];
  //     var end = Math.min(offsets[i + 1], cardNumber.length);
  //     components.push(cardNumber.substring(start, end));
  //   }

  //   return components.join(' ');
  // }
  const mask = [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
  
  // for (let i = 1; i < 20; i++) {
  //   mask.push(/\d/)

  //   if (i % 4 === 0) {
  //     mask.push(' ')
  //   }
  // }
  // console.log(mask)

  return mask 
}

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9998;
    visibility: hidden;
    opacity: 0;
    background-color: black;
    background-color: ${rgba(0, 0, 0, 0.8)};
    background: -webkit-radial-gradient(50% 50%, ellipse closest-corner, ${rgba(0, 0, 0, 0.6)} 1%, ${rgba(0, 0, 0, 0.8)} 100%);
    transform: translate3d(0, 0, 0);
    cursor: pointer;
    pointer-events: none;
    transition: all .32s ease-in;
visibility: visible;
opacity: 1;
pointer-events: auto;

    ${props => props.visible && css`
    `}
`;

const OverlayInner = styled.div`
    box-sizing: border-box;
    width: 320px;
    top: 50%;
    left: 50%;
    position: absolute;
    margin: -75px 0 0 -160px;
    cursor: pointer;
    text-align: center;
    color: white;
`;

const Message = styled.div`
    font-size: 15px;
        line-height: 1.5;
        padding: 0;
        margin: 0 0 25px;

        h3 {
            display: block;
            margin: 0 0 10px;
        }

        p {
            margin: 0 0 10px;

            &:last-child {
                margin: 0;
            }
        }
`;

export const Continue = styled.a.attrs({
  href: '#'
})`
    text-decoration: none;
    border-color: #fff;
    color: #fff;
    color: ${rgba(255, 255, 255, 0.9)};
    border: 1px solid ${rgba(255, 255, 255, 0.9)};
    padding: 0 16px;
    line-height: 36px;
    display: inline-block;
    border-radius: 3px;
    font-size: 15px;
    transition: all .3;
    cursor: pointer;

    &:hover {
        border-color: #fff;
        color: #fff;
    }
`;


const closeWindow = () => {
  if (windowOpened()) {
    window.threedSecureWindow.close()
  }
}

const windowOpened = () => {
  return (
    window && 
    window.threedSecureWindow && 
    window.threedSecureWindow.closed === false
  )
}

export class ThreedSecure extends React.Component {
  constructor(props) {
    super(props)

    this.callbackName = props.callbackName || 'completeThreedSecure'
    this.onComplete = this.onComplete.bind(this)
  }

  componentDidMount() {
    if (window && window.addEventListener) {
        window.addEventListener('beforeunload', closeWindow)
    }

    window[this.callbackName] = this.onComplete

    this.focus()
  }

  componentWillUnmount() {
    closeWindow()
    window.removeEventListener('beforeunload', closeWindow);

    window[this.callbackName] = undefined
  }

  onComplete(...args) {
    const { onComplete } = this.props

    closeWindow()

    if (typeof onComplete === 'function') {
      onComplete(...args)
    }
  }

  focus(event) {
    if (event) {
      event.preventDefault()
    }

    if (windowOpened()) {
      window.threedSecureWindow.focus()
    } else {
      this.open()
    }
  }

  open(title = '3ds авторизация', width = 460, height = 560) {
    const { url } = this.props

    if (
        !url ||
        windowOpened()
    ) {
        return;
    }

    const {screen, documentElement} = window;
    const dualScreenLeft = window.screenLeft || screen.left || 0;
    const dualScreenTop = window.screenTop || screen.top || 0;

    const clientWidth = documentElement ? documentElement.clientWidth : screen.width;
    const clientHeight = documentElement ? documentElement.clientHeight : screen.height;

    const windowWidth = window.innerWidth || clientWidth;
    const windowHeight = window.innerHeight || clientHeight;

    const left = ((windowWidth / 2) - (width / 2)) + dualScreenLeft;
    const top = ((windowHeight / 2) - (height / 2)) + dualScreenTop;

    const params = [
        'scrollbars=yes',
        'menubar=no',
        'dependent=yes',
        'dialog=yes',
        'minimizable=no',
        'resizable=no',
        'centerscreen=yes',
        'copyhistory=no',
        'chrome=yes',
        'width=' + width,
        'height=' + height,
        'top=' + top,
        'left=' + left
    ].join();

    window.threedSecureWindow = window.open(url, title, params);

    if (!window.threedSecureWindow) {
        return
    }

    // this.focus()
  }
  
  render() {
    const focus = this.focus.bind(this)  
    return (
    <Overlay onClick={focus}>
        <OverlayInner>
            {/* Don’t see the secure PayPal browser? We’ll help you re-launch the window to complete your purchase. */}
            <Message>
                {/* <h3>Не видите безопасное окно со страницей вашего банка?</h3> */}
                <p>Нажмите «Продолжить», если не видите окно со страницей вашего банка.</p>
            </Message>

            <Continue onClick={focus}>
                Продолжить
            </Continue>
        </OverlayInner>
    </Overlay>    
    )
  }
}

const Loader = () => (
  <div></div>
)

const CreditCard = ({
  title = 'Платежная информация', 
  submitting = false, 
  threedSecureCallbackName,
  onThreedSecureComplete,
  threedSecureUrl, 
  threedSecure = false }) => (
  <React.Fragment>
    <Fieldset title={title}>
      <Card threedSecure={threedSecure}>
        <CardNumber />
        <CardExpiry />
        <CardCVV />
      </Card>    
    </Fieldset>

    {threedSecure &&
      <ThreedSecure
        callbackName={threedSecureCallbackName}
        onComplete={onThreedSecureComplete}    
        url={threedSecureUrl} />  
    }
  </React.Fragment>
)

export default CreditCard
// export ThreedSecure as ThreedSecure
// export validate
