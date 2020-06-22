<template>
  <div id="app">
    <div id="nav">
      <h4 style="margin: 10px;">网易严选(伪)</h4>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
  * {
    padding: 0;
    margin: 0;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>