import { Proxiable } from '@stone-js/common'
import { get, set, has, mergeWith } from 'lodash-es'

/**
 * Class representing a Config.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class Config extends Proxiable {
  #items

  /**
   * Create a Config.
   *
   * @param {Object} [items={}]
   * @return {Config}
   */
  static create (items = {}) {
    return new this(items)
  }

  /**
   * Create a Config.
   *
   * @param {Object} [items={}]
   */
  constructor (items = {}) {
    super({
      get: (target, prop, receiver) => {
        if (Reflect.has(target, prop)) {
          return Reflect.get(target, prop, receiver)
        } else {
          return target.get.apply(this, [prop])
        }
      }
    })

    this.#items = { ...items, __proto__: null }
  }

  /**
   * All of the configuration items.
   *
   * @type   {Object}
   * @public
   */
  get items () {
    return this.#items
  }

  /**
   * Get the specified configuration value.
   *
   * @param  {string|string[]|Object} key
   * @param  {*}                      [fallback=null]
   * @return {*}
   */
  get (key, fallback = null) {
    if (!Array.isArray(key) && typeof key === 'object') {
      return this.getMany(key)
    }

    return get(this.#items, key, fallback)
  }

  /**
   * Get the first match configuration value.
   *
   * @param  {string[]} keys
   * @param  {*}        [fallback=null]
   * @return {*}
   */
  firstMatch (keys, fallback = null) {
    return get(this.#items, keys.find((v) => this.has(v)), fallback)
  }

  /**
   * Get many configuration values.
   *
   * @param  {Object} keys
   * @return {Object}
   */
  getMany (keys) {
    const entries = Array.isArray(keys) ? keys.map(v => [v, null]) : Object.entries(keys)
    return entries.reduce((results, [key, fallback]) => ({ ...results, [key]: get(this.#items, key, fallback) }), {})
  }

  /**
   * Determine if the given configuration value exists.
   *
   * @param  {string|string[]} key
   * @return {boolean}
   */
  has (key) {
    return has(this.#items, key)
  }

  /**
   * Set a given configuration value.
   *
   * @param  {string|string[]|Object} key
   * @param  {*}                      [value=null]
   * @return {this}
   */
  set (key, value = null) {
    key = typeof key === 'object' ? key : { [key]: value }

    for (const [name, val] of Object.entries(key)) {
      set(this.#items, name, val)
    }

    return this
  }

  /**
   * Allows providers to define the default config for a module.
   *
   * @param  {string|string[]|Object} key
   * @param  {*}                      value
   * @return {this}
   */
  defaults (key, value) {
    if (this.has(key)) {
      mergeWith(value, this.get(key))
    }

    return this.set(key, value)
  }

  /**
   * Get all of the configuration items as literal Object.
   *
   * @return {Object}
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
