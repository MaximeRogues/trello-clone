<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div class="column" v-for="column of board.columns" :key="column.id">
        <span class="hidden">{{column.id}}</span>
        <div class="flex items-center mb-2 font-bold">
          {{column.name}}
        </div>
        <div class="list-reset">
          <div class="task" v-for="task of column.tasks" :key="task.id" @click="goToTask(task)">
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
