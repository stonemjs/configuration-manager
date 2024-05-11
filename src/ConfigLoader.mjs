import { ConfigBuilder } from './ConfigBuilder.mjs'
import { OptionsResolver } from './resolvers/OptionsResolver.mjs'

/**
 * Class representing a ConfigLoader.
 * Load the complex strucred options for StoneFactory.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class ConfigLoader {
  #options

  /**
   * Create an ConfigLoader.
   *
   * @param   {Object} options
   * @returns {ConfigLoader}
   */
  static create (options) {
    return new this(options)
  }

  /**
   * Create an ConfigLoader.
   *
   * @param {Object} options
   */
  constructor (options) {
    this.#options = options
  }

  /**
   * Load config
   *
   * @param   {Object} modules
   * @param   {Object} modules.app
   * @param   {Object} modules.options
   * @param   {Object} modules.commands
   * @returns {Object}
   */
  async load (modules) {
    const passable = {}

    for (const [name, value] of Object.entries(modules)) {
      passable[name] = Object.values(value)
    }

    return ConfigBuilder
      .create(passable, this.#options.autoload.pipes)
      .setPassableResolver(OptionsResolver())
      .setDestinationResolver((v) => v.options)
      .build()
  }
}
