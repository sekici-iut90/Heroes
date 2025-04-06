<template>
    <v-container class="pa-6">
        <!-- App Bar with Back Button and Title -->
        <v-app-bar flat color="transparent" class="mb-8">
            <v-btn icon @click="$router.go(-1)">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title class="text-h4 font-weight-bold primary--text ml-4">
                <v-icon large color="primary" class="mr-3">mdi-office-building</v-icon>
                {{ currentOrganisation.name }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                    color="primary"
                    large
                    depressed
                    @click="openCreateTeamDialog"
            >
                <v-icon left>mdi-plus</v-icon>
                Add Team
            </v-btn>
        </v-app-bar>

        <!-- Teams Grid -->
        <v-row v-if="currentOrganisation.teams?.length > 0">
            <v-col
                    v-for="team in currentOrganisation.teams"
                    :key="team._id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
            >
                <v-card class="team-card mx-auto">
                    <v-card-title class="d-flex align-center">
                        <v-avatar color="primary" size="56" class="mr-4">
                            <v-icon dark>mdi-account-group</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-h6">{{ team.name }}</div>
                            <div class="text-caption grey--text">
                                {{ team.members?.length || 0 }} members
                            </div>
                        </div>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else class="fill-height" align="center" justify="center">
            <v-col cols="12" class="text-center">
                <v-img
                        src="@/assets/empty-teams.svg"
                        max-height="200"
                        contain
                        class="mb-6"
                ></v-img>
                <h2 class="text-h5 grey--text text--darken-1 mb-4">No Teams in This Organisation</h2>
                <v-btn
                        color="primary"
                        large
                        @click="openCreateTeamDialog"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Add First Team
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'OrgTeamsView',

    data: () => ({
        createTeamDialog: false,
        newTeamName: '',
    }),

    computed: {
        ...mapState('org', ['currentOrganisation']),
    },

    methods: {
        ...mapActions('org', ['addTeam']),

        openCreateTeamDialog() {
            this.newTeamName = '';
            this.createTeamDialog = true;
        },

        async handleTeamCreation() {

        },
    },

    async mounted() {
    },
};
</script>

<style scoped>
.team-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;
}

.team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>