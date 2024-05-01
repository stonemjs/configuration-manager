import deepmerge from 'deepmerge'

export const OptionsResolver = (key = 'options') => (passable) => {
  if (Array.isArray(passable[key])) {
    passable[key] = passable[key].reduce((prev, option) => deepmerge(prev, option), {})
  }
  return passable
}
