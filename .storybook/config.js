import { addDecorator, configure } from '@storybook/react'
import  '@storybook/addon-console'

function loadStories() {
  const req = require.context('../src', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

// addDecorator((storyFn, context) => withConsole()(storyFn)(context))
configure(loadStories, module)
