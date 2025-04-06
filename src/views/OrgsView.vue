<template>
    <v-container class="pa-6">
        <!-- App Bar with Title and Action Button -->
        <v-app-bar flat color="transparent" class="mb-8">
            <v-toolbar-title class="text-h4 font-weight-bold primary--text">
                <v-icon large color="primary" class="mr-3">mdi-office-building</v-icon>
                Organisations
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                color="primary"
                large
                depressed
                @click="openCreateOrgDialog"
            >
                <v-icon left>mdi-plus</v-icon>
                New Organisation
            </v-btn>
        </v-app-bar>

        <!-- Organisations Grid -->
        <v-row v-if="organisationNames.length > 0">
            <v-col
                v-for="org in organisationNames"
                :key="org._id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
                <v-card
                    class="org-card mx-auto"
                    hover
                    @click="openSecretDialog(org)"
                >
                    <v-card-title class="d-flex align-center">
                        <v-avatar color="primary" size="56" class="mr-4">
                            <v-icon dark>mdi-office-building-outline</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-h6">{{ org.name }}</div>

                        </div>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else class="fill-height" align="center" justify="center">
            <v-col cols="12" class="text-center">
                <h2 class="text-h5 grey--text text--darken-1 mb-4">No Organisations Created Yet</h2>
                <v-btn
                    color="primary"
                    large
                    @click="openCreateOrgDialog"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Create First Organisation
                </v-btn>
            </v-col>
        </v-row>

        <!-- Create Organisation Dialog -->
        <v-dialog v-model="createDialog" max-width="500" persistent>
            <v-card>
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Create New Organisation</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="createDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pt-6">
                    <v-text-field
                        v-model="newOrgName"
                        label="Organisation Name"
                        outlined
                        clearable
                        autofocus
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        v-model="newOrgSecret"
                        label="Secret Password"
                        outlined
                        :rules="[rules.required]"
                        :type="showSecret ? 'text' : 'password'"
                        :append-icon="showSecret ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append="showSecret = !showSecret"
                    ></v-text-field>
                </v-card-text>

                <v-card-actions class="px-6 pb-6">
                    <v-spacer></v-spacer>
                    <v-btn text @click="createDialog = false">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        depressed
                        :loading="loading"
                        :disabled="!isFormValid"
                        @click="handleOrgCreation"
                    >
                        Create Organisation
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Secret Verification Dialog -->
        <v-dialog v-model="secretDialog" max-width="500" persistent>
            <v-card>
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Access {{ selectedOrg?.name }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="secretDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pt-6">
                    <v-alert
                        v-if="secretError"
                        type="error"
                        class="mb-4"
                    >
                        Incorrect secret phrase
                    </v-alert>

                    <v-text-field
                        v-model="enteredSecret"
                        label="Enter Secret Phrase"
                        outlined
                        :rules="[rules.required]"
                        :type="showEnteredSecret ? 'text' : 'password'"
                        :append-icon="showEnteredSecret ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append="showEnteredSecret = !showEnteredSecret"
                        @keyup.enter="verifySecret"
                    ></v-text-field>
                </v-card-text>

                <v-card-actions class="px-6 pb-6">
                    <v-spacer></v-spacer>
                    <v-btn text @click="secretDialog = false">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        depressed
                        :loading="verifying"
                        :disabled="!enteredSecret"
                        @click="verifySecret"
                    >
                        Verify
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
    name: 'OrganisationsView',

    data: () => ({
        createDialog: false,
        secretDialog: false,
        newOrgName: '',
        newOrgSecret: '',
        enteredSecret: '',
        showSecret: false,
        showEnteredSecret: false,
        loading: false,
        verifying: false,
        secretError: false,
        selectedOrg: null,
        rules: {
            required: value => !!value || 'Required',
        },
    }),

    computed: {
        ...mapState('org', ['organisationNames', 'organisationSecret']),
        isFormValid() {
            return this.newOrgName && this.newOrgSecret;
        }
    },

    methods: {
        ...mapActions('org', ['getOrganisations', 'createOrganisation', 'getOrganisation']),
        ...mapMutations('org', ['setOrganisationSecret']),

        openCreateOrgDialog() {
            this.newOrgName = '';
            this.newOrgSecret = '';
            this.createDialog = true;
        },

        openSecretDialog(org) {
            this.selectedOrg = org;
            this.enteredSecret = '';
            this.secretError = false;
            this.secretDialog = true;
        },

        async verifySecret() {
            this.verifying = true;
            this.secretError = false;

            try {
                // Store the secret in Vuex
                this.setOrganisationSecret(this.enteredSecret);

                // Try to fetch the organisation with the secret
                const result = await this.getOrganisation(this.selectedOrg._id);

                if (result) {
                    // If successful, close dialog and navigate
                    this.secretDialog = false;
                    this.$router.push(`/orgs/${this.selectedOrg._id}/teams`);
                } else {
                    this.secretError = true;
                }
            } catch (error) {
                console.error("Error verifying secret:", error);
                this.secretError = true;
            } finally {
                this.verifying = false;
            }
        },

        async handleOrgCreation() {
            this.loading = true;
            try {
                await this.createOrganisation({
                    name: this.newOrgName,
                    secret: this.newOrgSecret
                });
                await this.getOrganisations();
                this.createDialog = false;
            } catch (error) {
                console.error("Error creating organisation:", error);
            } finally {
                this.loading = false;
            }
        },
    },

    mounted() {
        this.getOrganisations();
    },
};
</script>

<style scoped>
.org-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;
}

.org-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.v-app-bar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>