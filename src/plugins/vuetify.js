import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)


export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#2196f3',  // Rouge foncé
                secondary: '#1976d2', // Bleu
                accent: '#ffc107',    // Or
                error: '#2196f3',
                warning: '#ff9800',
                info: '#2196f3',
                success: '#4caf50'
            },
            dark: {
                primary: '#2196f3',   // Rouge vif
                secondary: '#2196f3', // Bleu clair
                accent: '#ffd740',    // Or clair
                background: '#121212' // Fond très sombre
            }
        }
    }
})