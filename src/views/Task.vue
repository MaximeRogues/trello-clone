<template>
  <div class="task-view">
    <div class="flex flex-col flex-grow items-start justify-content justify-between px-4">
      <input
        type="text"
        class="p-2 w-full mr-2 block text-xl font-bold"
        :value="task.name"
        @change="updateTaskProperty($event, task, 'name')"
      >
      <textarea class="relative bg-transparent px-2 border mt-2 h-64 border-none leading-normal"
         :value="task.description"
         @change="updateTaskProperty($event, task, 'description')"
      />
    </div>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['getTask']),
    task () {
      return this.getTask(this.$route.params.id)
    }
  },
  methods: {
    updateTaskProperty (event, task, field) {
      this.$store.commit('UPDATE_TASK', {
        task: task,
        key: field,
        value: event.target.value
      })
    }
  }
}
</script>

<style>
.task-view {
  @apply relative flex flex-row bg-white pin mx-4 m-32 mx-auto py-4 text-left rounded shadow;
  max-width: 700px;
}
</style>
