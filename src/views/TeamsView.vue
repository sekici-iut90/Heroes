<template>
    <v-container class="pa-6">
        <v-app-bar flat color="transparent" class="mb-8">
            <v-toolbar-title class="text-h4 font-weight-bold primary--text">
                <v-icon large color="primary" class="mr-3">mdi-account-group</v-icon>
                Teams
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                color="primary"
                large
                depressed
                @click="openCreateTeamDialog"
            >
                <v-icon left>mdi-plus</v-icon>
                New Team
            </v-btn>
        </v-app-bar>

        <!-- Teams Grid -->
        <v-row v-if="teams.length > 0">
            <v-col
                v-for="team in teams"
                :key="team._id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
                <v-card
                    class="team-card mx-auto"
                    hover
                    @click="viewTeamDetails(team)"
                >
                    <v-card-title class="d-flex align-center">
                        <v-avatar color="primary" size="56" class="mr-4">
                            <v-icon dark>mdi-account-group</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-h6">{{ team.name }}</div>
                        </div>
                    </v-card-title>


                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else class="fill-height" align="center" justify="center">
            <v-col cols="12" class="text-center">
                <h2 class="text-h5 grey--text text--darken-1 mb-4">No Teams Created Yet</h2>
                <v-btn
                    color="primary"
                    large
                    @click="openCreateTeamDialog"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Create First Team
                </v-btn>
            </v-col>
        </v-row>

        <!-- Create Team Dialog -->
        <v-dialog v-model="dialog" max-width="500" persistent>
            <v-card>
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Create New Team</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pt-6">
                    <v-text-field
                        v-model="newTeamName"
                        label="Team Name"
                        outlined
                        clearable
                        autofocus
                        :rules="[rules.required]"
                    ></v-text-field>
                </v-card-text>

                <v-card-actions class="px-6 pb-6">
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        depressed
                        :loading="loading"
                        :disabled="!newTeamName"
                        @click="handleTeamCreation"
                    >
                        Create Team
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'TeamsView',

    data: () => ({
        dialog: false,
        newTeamName: '',
        loading: false,
        rules: {
            required: value => !!value || 'Required',
        },
    }),

    computed: {
        ...mapState('team', ['teams']),
    },

    methods: {
        ...mapActions('team', ['getTeams', 'createTeam']),

        openCreateTeamDialog() {
            this.newTeamName = '';
            this.dialog = true;
        },

        async handleTeamCreation() {
            this.loading = true;
            try {
                await this.createTeam({ name: this.newTeamName });
                await this.getTeams();
                this.dialog = false;
            } catch (error) {
                console.error("Error creating team:", error);
            } finally {
                this.loading = false;
            }
        },

        viewTeamDetails(team) {
            console.log("View team:", team);
        },

        editTeam(team) {
            console.log("Edit team:", team);
        },
    },

    mounted() {
        this.getTeams();
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

.v-app-bar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>