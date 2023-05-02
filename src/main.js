import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

const httpLink = new HttpLink({
    // URL to graphql server, you should use an absolute URL here
    uri: 'http://localhost:8080/v1/graphql'
})

// create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

// install the vue plugin
Vue.use(VueApollo)

Vue.config.productionTip = false

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
