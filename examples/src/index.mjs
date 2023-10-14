import { ConfigurationManager } from '../../src/index.mjs'

const getVersion = (version) => {
  version = process.env.APP_VERSION ?? version
  if (!version) {
    throw new Error('Version must not be empty')
  }
  return version
}
console.log('Config values')

/**
 * ConfigurationManager example
 */
const items = {
  name: 'StoneJS',
  middleware: [
    (data, next) => next(`${data} - 1`),
    (data, next) => next(`${data} - 2`),
    (data, next) => next(`${data} - 3`),
  ],
  locale: {
    default: 'en',
    fallback: 'en'
  },
  aws: {
    lambda: {
      name: 'Login',
      alias: 'dev',
      version: getVersion(12)
    }
  },
}

console.log('New config instance')

const config = new ConfigurationManager(items)

// Set AWS lambda
config.set('aws.lambda.env.isProd', true)

// Set Azure function
config.set('azure.function.env.isProd', true)

// Get all config
console.log('All configs', config.all())

// Get fallback
console.log('fallback locale', config.get('locale.fallback'))

// Get AWS config
console.log('AWS', config.get('aws'))
console.log('AWS lambda name', config.get('aws.lambda.name'))
console.log('AWS lambda env isProd', config.get('aws.lambda.env.isProd'))

// Get Azure config
console.log('Azure', config.get('azure'))
console.log('Azure function env isProd', config.get('azure.function.env.isProd'))