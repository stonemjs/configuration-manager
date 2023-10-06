export class ConfigurationException extends Error {
  static CODE = 'CONFIG-500'

  constructor (message, metadata = {}) {
    super()
    this.message = message
    this.metadata = metadata
    this.name = 'stonejs.configuration'
    this.code = ConfigurationException.CODE
  }
}