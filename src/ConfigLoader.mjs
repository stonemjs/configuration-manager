import { join } from 'node:path'
import { cwd } from 'node:process'
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
   * @returns {Object}
   */
  async load () {
    const passable = {}

    for (const name of Object.keys(this.#options.autoload.modules)) {
      passable[name] = Object.values(await import(new URL(join('./.stone', `${name}.mjs`), `file://${cwd()}/`)))
    }

    return ConfigBuilder
      .create(passable, this.#options.autoload.pipes)
      .setPassableResolver(OptionsResolver())
      .setDestinationResolver((v) => v.options)
      .build()
  }
}
