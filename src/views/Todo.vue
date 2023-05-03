<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="">
            <v-text-field v-if="editTask.id == null" v-model="newTask" hide-details outlined @click:append="addTask()" @keyup.enter="addTask()"
            label="Add Task" append-icon="mdi-plus"></v-text-field>
            <v-text-field v-else v-model="editTask.title" hide-details outlined @click:append="updateTask(editTask)" @keyup.enter="updateTask(editTask)"
            label="Edit Task" append-icon="mdi-plus"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-list flat class="pt-0">
          <v-list-item-group multiple>
            <div v-for="task in tasks" :key="task.id">
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

const GET_TODO = gql`
  query getTodos {
    todo (order_by: { created_at: desc }) {
      title
      id
      done
    }
  }
`;

const INSERT_TODO = gql`
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

const UPDATE_TODO = gql`
  mutation updateTodo($id: Int!,$title: String!) {
    update_todo(where: {id: {_eq: $id}}, _set: {title: $title}) {
      affected_rows
      returning {
        id
        title
        done
      }
    }
  }
`;

const MARK_COMPLETE_TODO = gql`
  mutation updateTodo($id: Int!,$done: Boolean!) {
    update_todo(where: {id: {_eq: $id}}, _set: {done: $done}) {
      returning {
        id
        title
        done
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation removeTodo($id: Int!) {
    delete_todo(where: {id: {_eq: $id}}){
      affected_rows
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
    tasks: {
      query: GET_TODO,
      update: data => data.todo
    }
    
  },
  
  components: {
  },
  
  data() {
    return {
      newTask: '',
      editTask: {
        id: null,
        title: null
      },
      tasks: []
    }
  },
  
  methods: {
    doneTask(id) {
      
      let task = this.tasks.filter(task => task.id == id)[0];
      task.done = !task.done;

      this.$apollo.mutate({
        mutation: MARK_COMPLETE_TODO,
        variables: {
          id,
          done: task.done
        },
        update: (cache, {data: { update_todo }}) => {
          try {
            const data = cache.readQuery({
              query: GET_TODO
            });
            let affectedTask = data.todo.find(t => t.id == id);
            affectedTask.done = task.done;
            cache.writeQuery({
              query: GET_TODO,
              data
            });
          } catch (error) {
            console.log(error);
          }
        }
      })
    },
    
    addTask() {
      let title = this.newTask;
      // Validation Here ...
      
      this.$apollo.mutate({
        mutation: INSERT_TODO,
        variables: {
          title
        },
        // Update the cache
        update: (cache, { data: { insert_todo } }) => {
          try {
            const data = cache.readQuery({
              query: GET_TODO
            });
            const insertedData = insert_todo.returning;
            // insert at beginning of list
            data.todo.splice(0, 0, insertedData[0]);
            cache.writeQuery({
              query: GET_TODO,
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
      this.$apollo.mutate({
        mutation: DELETE_TODO,
        variables: {
          id
        },
        update: (cache, { data: { delete_todo } }) => {
          try {
            if(delete_todo.affected_rows) {
              const data = cache.readQuery({
                query: GET_TODO
              });
              // update the list
              data.todo = data.todo.filter(t => t.id !== id);
              cache.writeQuery({
                query: GET_TODO,
                data
              });
              
            }
          } catch (error) {
            console.log(error);
          }
        }
      })
    },
    
    editTodo(id) {
      this.editTask = {...this.tasks.filter(task => task.id == id)[0]};
    },
    
    updateTask(task) {
      this.$apollo.mutate({
        mutation: UPDATE_TODO,
        variables: {
          id: task.id,
          title: task.title
        },
        update: (cache, {data: { update_todo }}) => {
          // update cahce
          try {
            if(update_todo.affected_rows) {
              const data = cache.readQuery({
                query: GET_TODO
              });
              let affectedTask = data.todo.find(t => t.id === task.id);
              affectedTask.title = task.title;
              // set default
              this.editTask = {
                id: null,
                title: null
              }
              cache.writeQuery({
                query: GET_TODO,
                data
              });
              
            }
          } catch (error) {
            console.log(error);
          }
        }
      })
    }
  }
}
</script>
