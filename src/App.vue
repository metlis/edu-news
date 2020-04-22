<template>
  <v-app>
    <v-content>
      <Widget />
    </v-content>
  </v-app>
</template>

<script>
import Widget from './components/Widget.vue';

export default {
  name: 'App',

  components: {
    Widget,
  },

  data: () => ({
    //
  }),
};
</script>
