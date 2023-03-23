import Vue from 'vue'
import Vuex from 'vuex'
import defaultBoard from './default-board'
import { saveStatePlugin, uuid } from '@/utils'
Vue.use(Vuex)

const board = JSON.parse(localStorage.getItem('board')) || defaultBoard
console.log(board)
export default new Vuex.Store({
  plugins: [saveStatePlugin],
  state: {
    board: board
  },
  getters: {
    getTask (state) {
      return (id) => {
        for (const column of state.board.columns) {
          for (const task of column.tasks) {
            if (task.id === id) {
              return task
            }
          }
        }
      }
    }
  },
  mutations: {
    CREATE_TASK (state, { tasks, name }) {
      tasks.push({
        name,
        id: uuid(),
        description: ''
      })
    },
    UPDATE_TASK (state, { task, key, value }) {
      task[key] = value
    },
    MOVE_TASK (state, { fromTasks, fromTaskIndex, toTasks, toTaskIndex }) {
      console.log('MOVE_TASK')
      const taskToMove = fromTasks.splice(fromTaskIndex, 1)[0]
      toTasks.splice(toTaskIndex, 0, taskToMove)
    },
    MOVE_COLUMN (state, { fromColumnIndex, toColumnIndex }) {
      console.log('MOVE_COLUMN')
      const columnsList = state.board.columns
      const columnToMove = columnsList.splice(fromColumnIndex, 1)[0]
      columnsList.splice(toColumnIndex, 0, columnToMove)
    }
  }
})
