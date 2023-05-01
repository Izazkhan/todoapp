<template>
  <div>
    <v-form>
      <v-container class="ma-0 pa-0">
        <v-row>
          <v-col cols="12" class="pa-0 ma-0">
            <v-text-field hide-details outlined class="pa-3" label="Add Task" append-icon="mdi-plus"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-list flat class="pt-0">
      <v-list-item-group multiple>
        <div v-for="task in tasks" :key="task.id">
          <v-list-item @click="doneTask(task.id)" :class="{ 'blue lighten-5': task.done }">
            <template v-slot:default>
              <v-list-item-action>
                <v-checkbox :input-value="task.done" color="primary"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title :class="{ 'text-decoration-line-through': task.done }">{{ task.title
                }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click.stop="deleteTodo(task.id)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'Todo',

  components: {
  },

  data() {
    return {
      tasks: [
        {
          id: 1,
          title: "Wake Up",
          done: true
        },
        {
          id: 2,
          title: "Get bananas",
          done: true
        },
        {
          id: 3,
          title: "Eat bananas",
          done: false
        },
      ]
    }
  },

  methods: {
    doneTask(id) {
      let task = this.tasks.filter(task => task.id == id)[0];
      task.done = !task.done;
    },

    deleteTodo(id) {
      // Call Api to delete task from todo's list
      alert("Delete Task")
    }
  }
}
</script>
