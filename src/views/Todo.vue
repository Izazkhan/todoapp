<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="">
            <v-text-field v-model="newTask" hide-details outlined @click:append="addTask()" @keyup.enter="addTask()"
              label="Add Task" append-icon="mdi-plus"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-list flat class="pt-0">
          <v-list-item-group multiple>
            <div v-for="task in todo" :key="task.id">
              <v-list-item class="pa-3" @click="doneTask(task.id)" :class="{ 'blue lighten-5': task.done }">
                <template v-slot:default>
                  <v-list-item-action>
                    <v-checkbox :input-value="task.done" color="primary"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title :class="{ 'text-decoration-line-through': task.done }">{{ task.title
                    }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="m-0">
                    <v-btn @click.stop="editTodo(task.id)" icon>
                      <v-icon>mdi-note-edit-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action class="ma-0">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import gql from 'graphql-tag';

const GET_TODO_QUERY = gql`
  query getTodos {
    todo (order_by: { created_at: desc }) {
      title
      id
      done
    }
  }`;

const INSERT_TODO_QUERY = gql`
  mutation addTodo($title:String!) {
    insert_todo(objects: {
      title: $title
    }) {
      affected_rows,
      returning {
        id
        title
        done
      }
    }
  }
`;

export default {
  name: 'Todo',

  apollo: {
    todo: {
      query: GET_TODO_QUERY,
    }

  },

  components: {
  },

  data() {
    return {
      newTask: '',
      todo: []
    }
  },

  methods: {
    doneTask(id) {
      let task = this.todo.filter(task => task.id == id)[0];
      task.done = !task.done;
    },

    addTask() {
      let title = this.newTask;
      // Validation Here ...

      this.$apollo.mutate({
        mutation: INSERT_TODO_QUERY,
        variables: {
          title
        },
        update: (cache, { data: { insert_todo } }) => {
          try {
            const data = cache.readQuery({
              query: GET_TODO_QUERY
            });
            const insertedData = insert_todo.returning;
            // insert at beginning of list
            console.log(insertedData);
            data.todo.splice(0, 0, insertedData[0]);
            cache.writeQuery({
              query: GET_TODO_QUERY,
              data
            });

          } catch (error) {
            console.log(error);
          }
        }
      })

      this.newTask = '';
    },

    deleteTodo(id) {
      // Call Api to delete task from todo's list
      alert("Delete Task")
    },

    editTodo(id) {
      alert("Edit Task")
    }
  }
}
</script>
