<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div class="column" v-for="(column, $columnIndex) of board.columns" :key="column.id"
        @drop="dropTaskOrColumn($event, column.tasks, $columnIndex)"
        draggable
        @dragstart.self="pickupColumn($event, $columnIndex)"
        @dragenter.prevent
        @dragover.prevent
      > <!-- @dragover.prevent (équivalent de v-on:dragover sert à empêcher le comportement de base de l'élément
        HTML (interdire le drop d'un élément) lorsqu'on va glisser-déposer sur cet élément
             @dragstart.self => le self sert à ne déclencher l'événement que si c'est la colonne elle-même qui est déplacée, pas ses éléments enfants
        -->

        <span class="hidden">{{column.id}}</span>
        <div class="flex items-center mb-2 font-bold">
          {{column.name}}
        </div>
        <div class="list-reset">
          <div class="task" v-for="(task, $taskIndex) of column.tasks" :key="task.id" @click="goToTask(task)"
            draggable
            @dragstart="pickupTask($event, $taskIndex, $columnIndex)"
            @drop.stop="dropTaskOrColumn($event, column.tasks, $columnIndex)"
            @dragenter.prevent
            @dragover.prevent
          >
          <!-- @drop.stop empêche la propagation de l'event, sinon c'est la task ET la column qui vont chacun déclencher leur drop  -->
            <span class="hidden">{{task.id}}</span>
            <span class="w-full flex-no-shrink font-bold">
                {{task.name}}
            </span>
            <p v-if="task.description" class="w-full flex-no-shrink mt-1 text-small" >
              {{task.description}}
            </p>
          </div>
        </div>
        <input
          type="text"
          class="block p-2 w-full bg-transparent"
          placeholder="+ Enter new task"
          name="newTask"
          @keyup.enter="createTask($event, column.tasks)"
        >
      </div>
    </div>

    <div class="task-bg" v-if="isTaskOpen"  @click.self="close">
<!--      div sombre qui s'affiche en fond quand une task est ouverte-->
<!--      @click.self pour que l'événement ne soit pris en compte que si le clic est sur cet élément précis (la div sombre en background) -->
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

// console.log($store.board)
export default {
  computed: {
    ...mapState(['board']),
    isTaskOpen () {
      return this.$route.name === 'task'
    }
  },
  methods: {
    goToTask (task) {
      this.$router.push({ name: 'task', params: { id: task.id } })
    },
    close () {
      this.$router.push({ name: 'board' })
    },
    createTask (event, tasks) {
      this.$store.commit('CREATE_TASK', {
        tasks, // ne fonctionne pas si on appelle cette variable autrement ??? il faut qu'elle s'appelle de la même façon ici et dans le store
        name: event.target.value
      })
      event.target.value = '' // vider l'input une fois la task ajoutée
    },
    // méthodes pour déplacer les tasks
    pickupTask (event, taskIndex, columnIndex) {
      console.log('pickup Task')
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('from_task_index', taskIndex)
      event.dataTransfer.setData('from_column_index', columnIndex)
      event.dataTransfer.setData('element_type', 'task')
    },
    dropTask (event, toTasks, toTaskIndex) {
      console.log('drop task')
      const fromColumnIndex = event.dataTransfer.getData('from_column_index')
      // const fromTasks = this.board.columns[fromColumnIndex].tasks
      // const taskIndex = event.dataTransfer.getData('task_index')
      this.$store.commit('MOVE_TASK', {
        fromTasks: this.board.columns[fromColumnIndex].tasks,
        fromTaskIndex: event.dataTransfer.getData('from_task_index'),
        toTasks: toTasks,
        toTaskIndex: toTaskIndex
      })
    },
    // méthodes pour déplacer les colonnes
    pickupColumn (event, fromColumnIndex) {
      console.log('pickupColumn')
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('from_column_index', fromColumnIndex)
      event.dataTransfer.setData('element_type', 'column')
    },
    dropColumn (event, toColumnIndex) {
      console.log('dropColumn')
      const fromColumnIndex = event.dataTransfer.getData('from_column_index')
      this.$store.commit('MOVE_COLUMN', {
        fromColumnIndex: fromColumnIndex,
        toColumnIndex: toColumnIndex
      })
    },
    dropTaskOrColumn (event, toTasks, toColumnIndex) {
      console.log('dropTaskOrColumn')
      const elementType = event.dataTransfer.getData('element_type')
      if (elementType === 'task') {
        this.dropTask(event, toTasks)
      } else if (elementType === 'column') {
        this.dropColumn(event, toColumnIndex)
      }
    }
  }

}
</script>

<style lang="css">
.task {
  @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
}

.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}

.board {
  @apply p-4 bg-teal-dark h-full overflow-auto;
}

.task-bg {
  @apply pin absolute;
  background: rgba(0,0,0,0.5);
}
</style>
