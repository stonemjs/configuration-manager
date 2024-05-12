/**
 * Passable.
 *
 * @typedef  {Object} Passable
 * @property {Object} app
 * @property {Object} options
 * @property {Object} commands
 */

/**
 * Handle Handler decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const HandlerPipe = (passable, next) => {
  const module = passable.app.find(module => module.$$metadata$$?.mainHandler)
  passable.options.app.handler = module ?? passable.options.app.handler
  return next(passable)
}

/**
 * Handle Service decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const ServicePipe = (passable, next) => {
  const modules = passable.app.filter(module => module.$$metadata$$?.service)
  passable.options.app.services = modules.concat(passable.options.app.services)
  return next(passable)
}

/**
 * Handle Provider decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const ProviderPipe = (passable, next) => {
  const modules = passable.app.filter(module => module.$$metadata$$?.provider)
  passable.options.app.providers = modules.concat(passable.options.app.providers)
  return next(passable)
}

/**
 * Handle Controller decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const ControllerPipe = (passable, next) => {
  const modules = passable.app.filter(module => module.$$metadata$$?.controller)
  passable.options.app.routes = modules.concat(passable.options.app.routes)
  return next(passable)
}

/**
 * Handle Listener decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const ListenerPipe = (passable, next) => {
  const modules = passable.app.filter(module => module.$$metadata$$?.listener)
  passable.options.app.listeners = modules.concat(passable.options.app.listeners)
  return next(passable)
}

/**
 * Handle Subscriber decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const SubscriberPipe = (passable, next) => {
  const modules = passable.app.filter(module => module.$$metadata$$?.subscriber)
  passable.options.app.subscribers = modules.concat(passable.options.app.subscribers)
  return next(passable)
}

/**
 * Handle Middleware decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const MiddlewarePipe = (passable, next) => {
  const modules = passable.app.filter(module => module.$$metadata$$?.middleware)
  passable.options.app.services = modules.concat(passable.options.app.services)
  return next(passable)
}

/**
 * Handle Adapter decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const AdapterPipe = (passable, next) => {
  const module = passable.app.find(module => module.$$metadata$$?.adapters)
  const adapters = module?.$$metadata$$?.adapters ?? []
  passable.options.adapters = adapters.concat(passable.options.adapters)
  return next(passable)
}
