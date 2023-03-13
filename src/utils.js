export function uuid () {
  return Math.random().toString(16).slice(2)
}

export function saveStatePlugin (store) {
  // à chaque changement dans le state, le store sera mis à jour
  store.subscribe(
    (mutation, state) => localStorage.setItem('board', JSON.stringify(state.board))
  )
}
