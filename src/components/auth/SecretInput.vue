<template>
    <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
            <v-card-title>Authentification requise</v-card-title>
            <v-card-text>
                <v-text-field
                        v-model="secret"
                        label="Secret de l'organisation"
                        type="password"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="validate" color="primary">Valider</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        dialog: true,
        secret: ''
    }),
    methods: {
        validate() {
            this.$store.commit('SET_ORG_SECRET', this.secret)
            this.dialog = false
        }
    }
}
</script>