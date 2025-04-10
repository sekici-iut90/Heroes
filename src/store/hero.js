import { getAllAliasesService, createHeroService, updateHeroService ,getHeroByIdService } from '@/services/hero.service';

export default {
    namespaced: true,
    state: {
        heroAliases: [],
        currentHero: null,
        heroes: []
    },
    getters: {
        getHeroById: (state) => (id) => {
            const aliasHero = state.heroAliases.find(h => h._id === id);
            if (aliasHero) return aliasHero;

            const hero = state.heroes.find(h => h._id === id);
            console.log(JSON.stringify(hero,null,2))
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
        async getHero({ commit }, data) {
            let result = null;
            try {
                result = await getHeroByIdService(data)
                if (result.error === 0) {
                    commit("setCurrentHero", result.data[0])
                    return result.data[0]
                } else {
                    console.log(result.data)
                }

            } catch (err) {
                console.log("Cas anormal dans getHero()")
            }
            return result.data[0]
        },
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