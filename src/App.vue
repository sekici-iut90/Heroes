<template>
    <v-app id="app">
        <!-- Barre de navigation -->
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title class="headline">
                Heroes & Villains
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="toggleTheme">
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- Menu de navigation -->
        <v-navigation-drawer v-model="drawer" app temporary>
            <v-list nav dense>
                <v-list-item-group color="primary">
                    <v-list-item to="/" exact>
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Accueil</v-list-item-title>
                    </v-list-item>

                    <v-list-item to="/heroes">
                        <v-list-item-icon>
                            <v-icon>mdi-account-star</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Héros</v-list-item-title>
                    </v-list-item>

                    <v-list-item to="/teams">
                        <v-list-item-icon>
                            <v-icon>mdi-account-group</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Équipes</v-list-item-title>
                    </v-list-item>

                    <v-list-item to="/orgs">
                        <v-list-item-icon>
                            <v-icon>mdi-office-building</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Organisations</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <!-- Contenu principal -->
        <v-main>
            <v-container fluid class="px-6 py-4">
                <router-view></router-view>
            </v-container>
        </v-main>

        <!-- Pied de page -->
        <v-footer color="black" dark padless>
            <v-col class="text-center py-4" cols="12">
                <div class="text-h6 amber--text font-weight-bold">
                    Heroes & Villains
                </div>
                <div class="text-caption mt-2">
                    © {{ new Date().getFullYear() }} - Ekici Sugdenaz & Merat Leslie
                </div>
            </v-col>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data: () => ({
        drawer: false,
    }),
    methods: {
        toggleTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        }
    }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v-main {
  min-height: calc(100vh - 64px - 36px); /* Hauteur totale - header - footer */
}

.v-footer {
  margin-top: auto;
}

/* Transition entre les vues */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>