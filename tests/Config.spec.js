import { Config } from '../src/Config.mjs'

describe('Config', () => {
  describe('#create', () => {
    it('Must create a Config with empty items', () => {
      // Act
      const config = Config.create()

      // Assert
      expect(config.items).toEqual({})
    })
  })

  describe('#get, #getMany, #has', () => {
    it('Get items by keys and check if item exists', () => {
      // Arrange
      const config = new Config({ app: { name: 'Stone.js', kernel: { current: 'default' } }, router: { name: 'Stone Router' } })

      // Assert #get
      expect(config.app.name).toBe('Stone.js')
      expect(config.get('app.version')).toBe(null)
      expect(config.get('app.version', '1.0.0')).toBe('1.0.0')
      expect(config.get('app.kernel.current')).toBe('default')
      expect(config.get(['app', 'kernel'])).toEqual({ current: 'default' })
      expect(config.app).toEqual({ name: 'Stone.js', kernel: { current: 'default' } })
      expect(config.get({ 'app.name': null, 'router.name': null, 'kernel.name': null })).toEqual({ 'app.name': 'Stone.js', 'router.name': 'Stone Router', 'kernel.name': null })

      // Assert #firstMatch
      expect(config.firstMatch(['app.name', 'app.kernel.current'])).toBe('Stone.js')
      expect(config.firstMatch(['app.names', 'app.kernel.current'])).toBe('default')
      expect(config.firstMatch(['app.names', 'app.kernel.currents'], '1.0.0')).toBe('1.0.0')

      // Assert #getMany
      expect(config.getMany(['app.name', 'router.name'])).toEqual({ 'app.name': 'Stone.js', 'router.name': 'Stone Router' })

      // Assert #has
      expect(config.has('app.name')).toBe(true)
      expect(config.has('app.version')).toBe(false)
      expect(config.has('app.kernel.current')).toBe(true)
    })
  })

  describe('#set', () => {
    it('Must set items by keys', () => {
      // Act
      const config = new Config()

      // Act
      config.set({ router: { name: 'Router' } })
      config.set('app.kernel.current', 'Stone kernel')

      // Assert
      expect(config.get('app.kernel.current')).toBe('Stone kernel')
      expect(config.get('app')).toEqual({ kernel: { current: 'Stone kernel' } })
      expect(config.get(['app', 'kernel'])).toEqual({ current: 'Stone kernel' })
      expect(config.getMany(['app.name', 'router.name'])).toEqual({ 'app.name': null, 'router.name': 'Router' })
    })
  })

  describe('#defaults', () => {
    it('Must set default values', () => {
      // Arrange
      const config = new Config({ app: { name: 'Stone.js', kernel: { current: 'default' } } })

      // Assert
      expect(config.get('app.version')).toBe(null)
      expect(config.get('app.name')).toBe('Stone.js')

      // Act
      config.defaults('app.version', '1.0.0')
      config.defaults('app.name', 'Stone app')

      // Assert
      expect(config.get('app.version')).toBe('1.0.0')
      expect(config.get('app.name')).toBe('Stone app')
    })
  })

  describe('#clear', () => {
    it('Must clear the config items', () => {
      // Arrange
      const config = new Config({ app: { name: 'Stone.js', kernel: { current: 'default' } }, router: { name: 'Stone Router' } })

      // Assert
      expect(config.items).toEqual({ app: { name: 'Stone.js', kernel: { current: 'default' } }, router: { name: 'Stone Router' } })

      // Act
      config.clear()

      // Assert
      expect(config.all()).toEqual({})
    })
  })
})
