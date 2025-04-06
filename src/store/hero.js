import { getAllAliasesService, createHeroService, updateHeroService } from '@/services/hero.service';

export default {
    namespaced: true,
    state: {
        heroAliases: [],
        currentHero: null,
        heroes: []
    },
    getters: {
        getHeroById: (state) => (id) => {
            // Cherche d'abord dans heroAliases
            const aliasHero = state.heroAliases.find(h => h._id === id);
            if (aliasHero) return aliasHero;

            // Sinon cherche dans heroes
            const hero = state.heroes.find(h => h._id === id);
            return hero || {
                _id: id,
                name: 'Unknown Hero',
                publicName: 'Unknown Hero'
            };
        }
    },
    mutations: {
        setHeroAliases(state, aliases) {
            state.heroAliases = aliases;
        },
        setCurrentHero(state, hero) {
            state.currentHero = hero;
            if (hero) {
                const index = state.heroes.findIndex(h => h._id === hero._id);
                if (index === -1) {
                    state.heroes.push(hero);
                } else {
                    state.heroes.splice(index, 1, hero);
                }
            }
        },
    },
    actions: {
        async loadHeroAliases({ commit }) {
            try {
                const result = await getAllAliasesService();
                if (result.error === 0) {
                    commit("setHeroAliases", result.data);
                    return result.data;
                }
                console.error('Error loading hero aliases:', result.data);
            } catch (err) {
                console.error("Error in loadHeroAliases()", err);
            }
        },
        async getHeroAliases({ commit }) {
            let result = null;
            try {
                result = await getAllAliasesService()
                if (result.error === 0) {
                    commit("setHeroAliases", result.data)
                    return result.data
                } else {
                    console.log(result.data)
                }

            } catch (err) {
                console.log("Cas anormal dans getHeroAliases()")
            }
        },
        async createHero({ commit }, hero) {
            let result = null;
            try {
                result = await createHeroService(hero)
                if (result.error === 0) {
                    commit("setCurrentHero", result.data)
                    return result.data
                } else {
                    console.log(result.data)
                }
            } catch (err) {
                console.log("Cas anormal dans createHero()")
            }
        },
        async updateHero({ commit }, data) {
            let result = null;
            try {
                result = await updateHeroService(data)
                if (result.error === 0) {
                    commit("setCurrentHero", result.data)
                    return result.data
                } else {
                    console.log(result.data)
                }

            } catch (err) {
                console.log("Cas anormal dans updateHero()")
            }
        },
    }
}