import { Macro } from '@stone-js/macroable'
import { Deep } from './Deep.mjs'

/**
 * Class representing a ConfigurationManager.
 *
 * @author Mr. Stone <pierre.evens16@gmail.com>
 */
@Macro
export class ConfigurationManager {
  #items

  /**
   * Create a ConfigurationManager.
   *
   * @param {object} [items={}]
   */
  constructor (items = {}) {
    this.#items = { ...items, __proto__: null }
  }

  /**
   * All of the configuration items.
   *
   * @type   {object}
   * @public
   */
  get items () {
    return this.#items
  }

  /**
   * Get the specified configuration value.
   *
   * @param  {string|object} key
   * @param  {any}           fallback
   * @return {any}
   */
  get (key, fallback = null) {
    if (typeof key === 'object') {
      return this.getMany(key)
    }

    return Deep.get(this.#items, key, fallback)
  }

  /**
   * Get many configuration values.
   *
   * @param  {object} keys
   * @return {object}
   */
  getMany (keys) {
    const entries = Array.isArray(keys) ? keys.map(v => [v, null]) : Object.entries(keys)
    return entries.reduce((results, [key, fallback]) => ({ ...results, [key]: Deep.get(this.#items, key, fallback)}), {})
  }

  /**
   * Determine if the given configuration value exists.
   *
   * @param  {string} key
   * @return {boolean}
   */
  has (key) {
    return Deep.has(this.#items, key)
  }

  /**
   * Set a given configuration value.
   *
   * @param  {string|object} key
   * @param  {any}           value
   * @return {this}
   */
  set (key, value = null) {
    key = typeof key === 'object' ? key : { [key]: value }
    
    for (const [name, val] of Object.entries(key)) {
      Deep.set(this.#items, name, val)
    }

    return this
  }

  /**
   * Get all of the configuration items as literal object.
   *
   * @return {object}
   */
  all () {
    return this.#items
  }

  /**
   * Clear all of the configuration items.
   *
   * @return {this}
   */
  clear () {
    this.#items = Object.create(null)

    return this
  }
}