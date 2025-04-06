<template>
    <v-container class="home-view">
        <v-row class="text-center">
            <v-col cols="12">
                <h1 class="display-2 font-weight-bold mb-3">
                    Bienvenue dans Heroes & Villains
                </h1>

                <p class="subheading">
                    Gestionnaire de super-héros, équipes et organisations
                </p>
            </v-col>

            <v-col cols="12" md="4" v-for="(card, i) in cards" :key="i">
                <v-card
                        class="pa-4 feature-card"
                        hover
                        @click="$router.push(card.route)"
                        height="100%"
                >
                    <v-icon x-large color="primary" class="mb-3">
                        {{ card.icon }}
                    </v-icon>
                    <h3 class="headline mb-2">{{ card.title }}</h3>
                    <p>{{ card.description }}</p>
                    <v-btn
                            color="primary"
                            text
                            class="mt-4"
                    >
                        Accéder
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'HomeView',
    data: () => ({
        cards: [
            {
                title: 'Héros',
                icon: 'mdi-account-supervisor',
                description: 'Gérez vos super-héros et leurs pouvoirs',
                route: '/heroes'
            },
            {
                title: 'Équipes',
                icon: 'mdi-account-group',
                description: 'Créez et organisez vos équipes',
                route: '/teams'
            },
            {
                title: 'Organisations',
                icon: 'mdi-office-building',
                description: 'Administrez vos organisations',
                route: '/orgs'
            }
        ]
    })
}
</script>

<style scoped>
.home-view {
    padding-top: 5rem;
}

.feature-card {
    transition: transform 0.3s;
    cursor: pointer;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.feature-card h3 {
    color: var(--v-primary-base);
}
</style>