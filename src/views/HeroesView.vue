<template>
    <v-container class="pa-6">
        <v-app-bar flat color="transparent" class="mb-8">
            <v-toolbar-title class="text-h4 font-weight-bold primary--text">
                <v-icon large color="primary" class="mr-3">mdi-account-star</v-icon>
                Heroes
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                color="primary"
                large
                depressed
                @click="openCreateHeroDialog"
            >
                <v-icon left>mdi-plus</v-icon>
                New Hero
            </v-btn>
        </v-app-bar>

        <!-- Heroes Grid -->
        <v-row v-if="heroAliases.length > 0">
            <v-col
                v-for="hero in heroAliases"
                :key="hero._id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
                <v-card
                    class="hero-card mx-auto"
                >
                    <v-card-title class="d-flex align-center">
                        <v-avatar color="primary" size="56" class="mr-4">
                            <v-icon dark>mdi-account-star</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-h6">{{ hero.publicName }}</div>
                            <div class="text-caption grey--text">
                                {{ hero.realName || 'Secret identity' }}
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
                    src="@/assets/empty-heroes.png"
                    max-height="200"
                    contain
                    class="mb-6"
                ></v-img>
                <h2 class="text-h5 grey--text text--darken-1 mb-4">No Heroes Created Yet</h2>
                <v-btn
                    color="primary"
                    large
                    @click="openCreateHeroDialog"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Create First Hero
                </v-btn>
            </v-col>
        </v-row>

        <!-- Create Hero Dialog -->
        <v-dialog v-model="dialog" max-width="600" persistent>
            <v-card>
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Create New Hero</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pt-6">
                    <v-text-field
                        v-model="newHero.publicName"
                        label="Hero Name"
                        outlined
                        clearable
                        autofocus
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        v-model="newHero.realName"
                        label="Secret Identity"
                        outlined
                        clearable
                    ></v-text-field>

                    <v-divider class="my-6"></v-divider>

                    <div class="d-flex align-center mb-4">
                        <h3 class="text-h6">Superpowers</h3>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            small
                            @click="addPower"
                        >
                            <v-icon left small>mdi-plus</v-icon>
                            Add Power
                        </v-btn>
                    </div>

                    <v-expansion-panels>
                        <v-expansion-panel
                            v-for="(power, index) in newHero.powers"
                            :key="index"
                        >
                            <v-expansion-panel-header>
                                <div class="d-flex align-center">
                                    <v-icon class="mr-2">mdi-star</v-icon>
                                    {{ power.name || "New Power" }}
                                </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-text-field
                                    v-model="power.name"
                                    label="Power Name"
                                    outlined
                                    class="mb-4"
                                    :rules="[rules.required]"
                                ></v-text-field>

                                <v-select
                                    v-model="power.type"
                                    :items="powerTypeOptions"
                                    label="Power Type"
                                    outlined
                                    class="mb-4"
                                ></v-select>

                                <v-slider
                                    v-model="power.level"
                                    label="Power Level"
                                    min="0"
                                    max="100"
                                    thumb-label
                                    ticks
                                ></v-slider>

                                <v-btn
                                    color="error"
                                    text
                                    @click="removePower(index)"
                                >
                                    <v-icon left>mdi-delete</v-icon>
                                    Remove Power
                                </v-btn>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>

                <v-card-actions class="px-6 pb-6">
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        depressed
                        :loading="loading"
                        :disabled="!isFormValid"
                        @click="handleHeroCreation"
                    >
                        Create Hero
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'HeroesView',

    data: () => ({
        dialog: false,
        loading: false,
        newHero: {
            publicName: '',
            realName: '',
            powers: []
        },
        powerTypes: [
            "Force", "Vitesse", "Endurance",
            "Magie", "Effrayant", "Furtivité", "Stupidité"
        ],
        rules: {
            required: value => !!value || 'Required',
        }
    }),

    computed: {
        ...mapState('hero', ['heroAliases']),
        ...mapState('org', ['organisationSecret']),

        powerTypeOptions() {
            return this.powerTypes.map((type, index) => ({
                text: type,
                value: index + 1
            }));
        },

        isFormValid() {
            return this.newHero.publicName &&
                this.newHero.powers.every(p => p.name);
        }
    },

    methods: {
        ...mapActions('hero', ['getHeroAliases', 'createHero']),

        openCreateHeroDialog() {
            this.resetForm();
            this.dialog = true;
        },

        resetForm() {
            this.newHero = {
                publicName: '',
                realName: '',
                powers: []
            };
        },

        addPower() {
            this.newHero.powers.push({
                name: '',
                type: 1,
                level: 50
            });
        },

        removePower(index) {
            this.newHero.powers.splice(index, 1);
        },

        async handleHeroCreation() {
            this.loading = true;
            try {
                await this.createHero(this.newHero);
                await this.getHeroAliases();
                this.dialog = false;
            } catch (error) {
                console.error("Error creating hero:", error);
            } finally {
                this.loading = false;
            }
        },
    },

    mounted() {
        this.getHeroAliases();
    }
};
</script>

<style scoped>
.hero-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;
}

.hero-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.v-app-bar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>