<template>
    <v-container class="pa-6">
        <!-- App Bar avec bouton retour et titre -->
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
                @click="addTeamDialog = true"
            >
                <v-icon left>mdi-plus</v-icon>
                Add Existing Team
            </v-btn>
        </v-app-bar>

        <!-- Dialog pour créer une nouvelle équipe -->
        <v-dialog v-model="addTeamDialog" max-width="500">
            <v-card>
                <v-card-title>Add epz Team</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="selectedTeam"
                        :items="availableTeams"
                        item-text="name"
                        item-value="_id"
                        label="Select a team"
                        outlined
                    ></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="addTeamDialog = false">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        @click="addExistingTeam"
                        :disabled="!selectedTeam"
                    >
                        Add Team
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Message si aucune organisation sélectionnée -->
        <v-row v-if="!currentOrganisation" class="fill-height d-flex flex-column justify-center align-center">
            <v-btn color="primary" @click="$router.push('/orgs')">
                Connect to an organisation
            </v-btn>
            <v-alert type="error" class="mt-3" style="max-width: fit-content;" dense text>
                Please connect to an organisation
            </v-alert>
        </v-row>

        <!-- Grid des équipes -->
        <v-row v-if="currentOrganisation && currentOrganisation.teams?.length > 0">
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

                    <v-divider class="my-2"></v-divider>

                    <v-card-text>
                        <div v-if="team.members && team.members.length > 0">
                            <v-chip
                                v-for="memberId in team.members"
                                :key="memberId"
                                small
                                class="mr-1 mb-1"
                                color="primary"
                                text-color="white"
                            >
                                {{ getHeroName(memberId) }}
                            </v-chip>
                        </div>
                        <div v-else class="text-caption grey--text">
                            No heroes yet
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="error"
                            text
                            @click.stop="deleteTeam(team._id)"
                        >
                            Remove
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else-if="currentOrganisation" class="fill-height" align="center" justify="center">
            <v-col cols="12" class="text-center">
                <h2 class="text-h5 grey--text text--darken-1 mb-4">No Teams in This Organisation</h2>
                <v-btn
                    color="primary"
                    large
                    @click="addTeamDialog = true"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Add First Team
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    name: 'OrgTeamsView',
    data: () => ({
        addTeamDialog: false,
        selectedTeam: null,
    }),
    computed: {
        ...mapState('org', ['currentOrganisation']),
        ...mapState('hero', ['heroAliases']),
        ...mapState('team', ['teams']),
        ...mapGetters('hero', ['getHeroById']),

        availableTeams() {
            if (!this.currentOrganisation?.teams || !this.teams) return [];
            const orgTeamIds = this.currentOrganisation.teams.map(t => t._id);
            return this.teams.filter(team => !orgTeamIds.includes(team._id));
        }
    },
    methods: {
        ...mapActions('org', ['addTeam', 'removeTeam']),
        ...mapActions('hero', ['loadHeroAliases']),
        ...mapActions('team', ['getTeams']),

        getHeroName(memberId) {
            const hero = this.getHeroById(memberId);
            return hero?.publicName || hero?.name || "Unknown Hero";
        },

        async addExistingTeam() {
            if (!this.selectedTeam) return;

            try {
                await this.addTeam(this.selectedTeam);
                this.addTeamDialog = false;
                this.selectedTeam = null;

                // Rafraîchir les données
                await this.getTeams();
                await this.$store.dispatch('org/getOrganisation', this.currentOrganisation._id);

            } catch (err) {
                console.error('Error adding team:', err);
                alert('Error adding team: ' + (err.response?.data?.data || err.message));
            }
        },

        deleteTeam(teamId) {
            this.removeTeam(teamId)
        },

        editTeam(team) {
            console.log('Edit team:', team);
        }
    },
    async mounted() {
        if (!this.currentOrganisation) {
            this.$router.push('/orgs');
        } else {
            await this.loadHeroAliases();
            await this.getTeams();
        }
    }
};
</script>

<style scoped>
.team-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;
    cursor: pointer;
    height: 100%;
}

.team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>