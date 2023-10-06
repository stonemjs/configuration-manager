/**
 * Class representing a Deep.
 * Fluent and simple API for dictionnary management.
 *
 * @author Mr. Stone <pierre.evens16@gmail.com>
 */
export class Deep {
  /**
   * Determine whether the given value is array accessible.
   *
   * @param  {any}     value
   * @return {boolean}
   */
  static accessible (value) {
    return Array.isArray(value) || typeof value === 'object'
  }

  /**
   * Add an element to an array using "dot" notation if it doesn't exist.
   *
   * @param  {array|object}  items
   * @param  {string|number} key
   * @param  {any}           value
   * @return {array|object}
   */
  static add (items, key, value) {
    if (!this.has(items, key)) {
      this.set(items, key, value)
    }

    return items
  }

  /**
   * Check if an item or items exist in an array using "dot" notation.
   *
   * @param  {array|object}  items
   * @param  {string|number} key
   * @return {boolean}
   */
  static has (items, key) {
    return !!this.get(items, key, null)
  }

  /**
   * Get an item from an array using "dot" notation.
   *
   * @param  {array|object}  items
   * @param  {string|number} key
   * @param  {any}           fallback
   * @return {any}
   */
  static get (items, key, fallback = null) {
    if (!this.accessible(items)) {
      return fallback
    }

    if (!key) {
      return items
    }

    if (items[key]) {
      return items[key]
    }

    if (!key.includes('.')) {
      return items[key] ?? fallback
    }

    for (const part of key.split('.')) {
      if (this.accessible(items) && items[part]) {
        items = items[part]
      } else {
        return fallback
      }
    }

    return items
  }

  /**
   * Set an array item to a given value using "dot" notation.
   *
   * If no key is given to the method, the entire array will be replaced.
   *
   * @param  {array|object}  items
   * @param  {string|number}  key
   * @param  {any}           value
   * @return {array|object}
   */
  static set (items, key, value) {
    if (!key) {
      return value
    }

    const keys = key.split('.')

    for (const [i, part] of Object.entries(keys)) {
      if (keys.length === parseInt(i) + 1) {
        break
      }

      if (this.isEmpty(items[part])) {
        items[part] = {}
      }

      items = items[part]
    }

    items[keys.pop()] = value

    return items
  }

  /**
   * Sort the array using the given callback or "dot" notation.
   *
   * @param  {array|object}  items
   * @param  {Function|null} callback
   * @return {array|object}
   */
  static sort (items, callback) {
    if (this.accessible(items)) {
      return Object.fromEntries(Object.entries(items).sort(callback))
    }
    
    return items
  }

  /**
   * Filter the array using the given callback.
   *
   * @param  {array|object}  items
   * @param  {Function|null} callback
   * @return {array|object}
   */
  static where (items, callback) {
    if (this.accessible(items)) {
      return Object.fromEntries(Object.entries(items).filter(([key, value]) => callback(value, key)))
    }

    return items
  }

  /**
   * Filter items where the value is not null.
   *
   * @param  {array|object}  items
   * @return {array|object}
   */
  static whereNotNull (items) {
    if (this.accessible(items)) {
      return Object.fromEntries(Object.entries(items).filter(([, value]) => !!value))
    }

    return items
  }

  /**
   * Return the first element in an array passing a given truth test.
   *
   * @param  {array|object}  items
   * @param  {Function|null} callback
   * @param  {any}           fallback
   * @return {any}
   */
  static first (items, callback = null, fallback = null) {
    if (!callback) {
      if (this.isEmpty(items)) {
        return fallback
      } else {
        return Object.entries(items)[0][1]
      }
    } else {
      return Object
        .entries(items)
        .find(([key, value]) => callback(value, key))[1] ?? fallback
    }
  }

  /**
   * Return the last element in an array passing a given truth test.
   *
   * @param  {array|object}  items
   * @param  {Function|null} callback
   * @param  {any}           fallback
   * @return {any}
   */
  static last (items, callback = null, fallback = null) {
    if (!callback) {
      if (this.isEmpty(items)) {
        return fallback
      } else {
        return Object.entries(items).reverse()[0][1]
      }
    } else {
      return Object
        .entries(items)
        .reverse()
        .find(([key, value]) => callback(value, key))[1] ?? fallback
    }
  }

  /**
   * Remove one or many array items from a given array using "dot" notation.
   *
   * @param  {array|object}  items
   * @param  {string|number}  key
   * @return {void}
   */
  static forget (items, keys) {
    const original = items
    keys = Array.isArray(keys) ? keys : [keys]

    if (keys.length === 0) return

    for (const key of keys) {
      if (items[key]) {
        delete items[key]
        continue
      }
      
      const parts = key.split('.')

      items = original

      while(parts.length > 1) {
        const part = parts.shift()
        if (this.accessible(items[part]) && items[part]) {
          items = items[part]
        }
      }

      delete items[parts.shift()]
    }
  }

  static isEmpty (items) {
    return !items || Object.entries(items).length === 0
  }

  /**
   * Flatten a multi-dimensional associative array with dots.
   *
   * @param  {array|object}  items
   * @param  {string}        prepend
   * @return {array|object}
   */
  static dot (items, prepend = '') {
    const results = {}

    for (const [key, value] of Object.entries(items)) {
      if (this.accessible(value) && !this.isEmpty(value)) {
        Object.assign(results, this.dot(value, `${prepend}${key}.`))
      } else {
        results[`${prepend}${key}`] = value
      }
    }

    return results
  }

  /**
   * Convert a flatten "dot" notation array into an expanded array.
   *
   * @param  {array|object} items
   * @return {array|object}
   */
  static undot (items) {
    const results = {}

    for (const [key, value] of Object.entries(items)) {
      this.set(results, key, value)
    }

    return results
  }
}