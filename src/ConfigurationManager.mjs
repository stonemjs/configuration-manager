import { Macro } from '@stone-js/macroable'

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
    this.#items = new Map(Object.entries(items))
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
   * @param  {string|array|object} key
   * @param  {any}                 fallback
   * @return {any}
   */
  get (key, fallback = null) {
    if (typeof key === 'object') {
      return this.getMany(key)
    }

    return key
      .split('.')
      .reduce((prev, curr) => {
        return prev && prev[curr] ? prev[curr] : fallback
      }, Object.fromEntries(this.#items.entries()))
  }

  /**
   * Get many configuration values.
   *
   * @param  {array|object} keys
   * @return {object}
   */
  getMany (keys) {
    const entries = Array.isArray(keys)
      ? keys.map(v => [v, null])
      : Object.entries(keys)
    
    return entries.reduce((prev, [key, fallback]) => {
      prev[key] = this.#items.has(key) ? this.#items.get(key) : fallback
      return prev
    }, {})
  }

  /**
   * Determine if the given configuration value exists.
   *
   * @param  {string} key
   * @return {boolean}
   */
  has (key) {
    return this.#items.has(key)
  }

  /**
   * Set a given configuration value.
   *
   * @param  {string|object}  key
   * @param  {any}            value
   * @return {this}
   */
  set (key, value = null) {
    if (typeof key === 'object') {
      for (const [name, val] of Object.entries(key)) {
        this.#items.set(name, val)
      }
    } else {
      key.split('.').reduce((prev, curr, i, arr) => {
        if (arr.length === 1) {
          prev.set(curr, value)
        } else if (arr.length === (i+1)) {
          prev[curr] = value
        } else {
          prev = prev[curr] ?? {}
        }
        return prev
      }, this.#items)
    }

    return this
  }

  /**
   * Prepend a value onto an array configuration value.
   *
   * @param  {string}  key
   * @param  {any}     value
   * @return {this}
   */
  prepend (key, value) {
    if (!Array.isArray(this.#items.get(key))) {
      this.#items.set(key, value)
    }

    this.#items.get(key).unshift(value)
    
    return this
  }

  /**
   * Push a value onto an array configuration value.
   *
   * @param  {string}  key
   * @param  {any}     value
   * @return {this}
   */
  push (key, value) {
    if (!Array.isArray(this.#items.get(key))) {
      this.#items.set(key, value)
    }

    this.#items.get(key).push(value)

    return this
  }

  /**
   * Get all of the configuration items as literal object.
   *
   * @return {object}
   */
  all () {
    return Object.fromEntries(this.#items.entries())
  }

  /**
   * Clear all of the configuration items.
   *
   * @return {this}
   */
  clear () {
    this.#items.clear()

    return this
  }
}