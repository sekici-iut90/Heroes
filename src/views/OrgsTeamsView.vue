    <template>
        <v-container class="pa-6">
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

            <v-dialog v-model="addTeamDialog" max-width="500">
                <v-card>
                    <v-card-title>Add existing Team</v-card-title>
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
                        <v-btn>Cancel</v-btn>
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

            <v-dialog v-model="addHeroDialog" max-width="500">
                <v-card>
                    <v-card-title>Add Hero to Team</v-card-title>
                    <v-card-text>
                        <v-select
                            v-model="selectedHero"
                            :items="availableHeroes"
                            item-text="publicName"
                            item-value="_id"
                            label="Select a hero"
                            outlined
                        ></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="addHeroDialog = false">Cancel</v-btn>
                        <v-btn
                            color="primary"
                            @click="addHeroToTeam"
                            :disabled="!selectedHero || !selectedTeamForHero"
                        >
                            Add Hero
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
                                <v-expansion-panels flat>
                                    <v-expansion-panel
                                        v-for="memberId in team.members"
                                        :key="memberId"
                                        @click="loadHeroDetails(memberId)"
                                    >
                                        <v-expansion-panel-header>
                                            {{ getHeroName(memberId) }}
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <div v-if="getHeroById(memberId).realName">
                                                <strong>Real Name:</strong> {{ getHeroById(memberId).realName }}
                                            </div>
                                            <div v-if="getHeroById(memberId).powers?.length">
                                                <strong>Powers:</strong>
                                                <v-chip
                                                    v-for="(power, index) in getHeroById(memberId).powers"
                                                    :key="index"
                                                    small
                                                    class="mr-1 mb-1"
                                                    color="secondary"
                                                >
                                                    {{ power.name }} (Lvl {{ power.level }})
                                                </v-chip>
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </div>
                            <div v-else class="text-caption grey--text">
                                No heroes yet
                            </div>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn
                                color="primary"
                                text
                                @click.stop="openAddHeroDialog(team._id)"
                            >
                                <v-icon left>mdi-account-plus</v-icon>
                                Add Hero
                            </v-btn>
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
            addHeroDialog: false,
            selectedTeam: null,
            selectedHero: null,
            selectedTeamForHero: null, // Pour stocker l'équipe à laquelle ajouter le héros
            loadingHeroes: false
        }),
        computed: {
            ...mapState('org', ['currentOrganisation']),
            ...mapState('hero', ['heroAliases', 'heroes']),
            ...mapState('team', ['teams']),
            ...mapGetters('hero', ['getHeroById']),

            availableTeams() {
                if (!this.currentOrganisation?.teams || !this.teams) return [];
                const orgTeamIds = this.currentOrganisation.teams.map(t => t._id);
                return this.teams.filter(team => !orgTeamIds.includes(team._id));
            },

            availableHeroes() {
                return this.heroAliases || [];
            }
        },
        methods: {
            ...mapActions('org', ['addTeam', 'removeTeam']),
            ...mapActions('hero', ['loadHeroAliases', 'getHero']),
            ...mapActions('team', ['getTeams', 'teamAddHeroes']),

            openAddHeroDialog(teamId) {
                this.selectedTeamForHero = teamId;
                this.addHeroDialog = true;
            },

            async addHeroToTeam() {
                if (!this.selectedTeamForHero || !this.selectedHero) return;

                try {
                    await this.teamAddHeroes({
                        _id: this.selectedTeamForHero,
                        members: [this.selectedHero]
                    });
                    await this.getTeams();
                    this.selectedHero = null;
                    this.selectedTeamForHero = null;
                    this.addHeroDialog = false;

                } catch (err) {
                    console.error('Error adding hero to team:', err);
                    alert('Error adding hero to team: ' + (err.response?.data?.data || err.message));
                }
            },
            getHeroName(memberId) {
                const hero = this.getHeroById(memberId);
                return hero?.publicName || hero?.name || "Unknown Hero";
            },

            async loadHeroDetails(memberId) {
                if (!this.getHeroById(memberId)?.powers) {
                    try {
                        await this.getHero({
                            id: memberId,
                            secret: this.currentOrganisation.secret
                        });
                    } catch (error) {
                        console.error(`Error loading hero details for ${memberId}:`, error);
                    }
                }
            },

            async addExistingTeam() {
                if (!this.selectedTeam) return;

                try {
                    await this.addTeam(this.selectedTeam);
                    this.addTeamDialog = false;
                    this.selectedTeam = null;

                    await this.getTeams();
                } catch (err) {
                    console.error('Error adding team:', err);
                    alert('Error adding team: ' + (err.response?.data?.data || err.message));
                }
            },

            deleteTeam(teamId) {
                this.removeTeam(teamId)
            },
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
        height: 100%;
    }

    .team-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    </style>>