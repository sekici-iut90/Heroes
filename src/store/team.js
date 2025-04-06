import { getAllTeamsService, createTeamService, teamAddHeroesService, teamRemoveHeroesService, getTeamByIdService } from '@/services/team.service';

export default {
    namespaced: true,
    state: {
        teams: [],
        currentTeam: null,

    },
    mutations: {
        setTeams(state, teams) {
            state.teams = teams
        },
        setCurrentTeam(state, team) {
            state.currentTeam = team
        },
    },
    actions: {
        async fetchTeam({ commit, state }, teamId) {
            try {
                // Essayez d'abord de trouver dans le state existant
                if (state.teams.length > 0) {
                    const existingTeam = state.teams.find(t => t._id === teamId);
                    if (existingTeam) {
                        commit('setCurrentTeam', existingTeam);
                        return existingTeam;
                    }
                }

                // Sinon, faites une requête
                const result = await getTeamByIdService(teamId);
                if (result.error === 0) {
                    commit('setCurrentTeam', result.data);
                    return result.data;
                }
                throw new Error(result.data);
            } catch (err) {
                console.error('Error fetching team:', err);
                throw err;
            }
        },
        async getTeams({ commit }) {
            let result = null;
            try {
                result = await getAllTeamsService()
                if (result.error === 0) {
                    commit("setTeams", result.data)
                } else {
                    console.log(result.data)
                }

            } catch (err) {
                console.log("Cas anormal dans getTeams()")
            }
        },
        async createTeam({ commit }, name) {
            let result = null;
            try {
                result = await createTeamService(name)
                if (result.error === 0) {
                    commit("setCurrentTeam", result.data)
                } else {
                    console.log(result.data)
                }

            } catch (err) {
                console.log("Cas anormal dans createTeam()")
            }
        },
        async teamAddHeroes({ commit }, data) {
            let result = null;
            try {
                result = await teamAddHeroesService(data)
                if (result.error === 0) {
                    commit("setCurrentTeam", result.data)
                } else {
                    console.log(result.data)
                }

            } catch (err) {
                console.log("Cas anormal dans teamAddHeroes()")
            }
        },
        async teamRemoveHeroes({ commit }, data) {
            let result = null;
            try {
                result = await teamRemoveHeroesService(data)
                if (result.error === 0) {
                    commit("setCurrentTeam", result.data)
                } else {
                    console.log(result.data)
                }

            } catch (err) {
                console.log("Cas anormal dans teamRemoveHeroes()")
            }
        }
    }
}