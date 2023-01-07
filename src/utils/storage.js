function get(key) {
  return window.localStorage.getItem(key)
}

function set(key, value) {
  return window.localStorage.setItem(key, value)
}

function remove(key) {
  return window.localStorage.removeItem(key)
}

export default { get, set, remove }
