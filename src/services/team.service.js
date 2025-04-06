import { getRequest, patchRequest, postRequest } from "@/services/axios.service"

async function getAllTeamsFromAPI() {
    return getRequest('/teams/get', 'getAllTeams')
}

async function createTeamFromAPI(name) {
    return postRequest('/teams/create', name, 'createTeam')
}

async function teamAddHeroesFromAPI(data) {
    return patchRequest('/teams/addheroes', {
        _id: data._id,
        members: data.members
    }, 'teamAddHeroes');
}
async function teamRemoveHeroesFromAPI(data) {
    return patchRequest('/teams/removeheroes', data, 'teamRemoveHeroes')
}
async function getAllTeamsService() {
    let answer = await getAllTeamsFromAPI()
    return answer
}

async function createTeamService(name) {
    let answer = await createTeamFromAPI(name)
    return answer
}

async function teamAddHeroesService(data) {
    let answer = await teamAddHeroesFromAPI(data)
    return answer
}

async function teamRemoveHeroesService(data) {
    let answer = await teamRemoveHeroesFromAPI(data)
    return answer
}

async function getTeamByIdService(teamId) {
    try {
        const answer = await getAllTeamsService();
        if (answer.error === 0) {
            const team = answer.data.find(t => t._id === teamId);
            if (team) {
                return { error: 0, data: team };
            }
            return { error: 1, data: 'Team not found' };
        }
        return answer;
    } catch (err) {
        return { error: 1, data: err.message };
    }
}

export {
    getAllTeamsService,
    createTeamService,
    teamAddHeroesService,
    teamRemoveHeroesService,
    getTeamByIdService
}