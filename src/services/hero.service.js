import { getRequest, postRequest, putRequest } from "@/services/axios.service"

async function getAllAliasesFromAPI() {
    return getRequest('/heroes/getaliases', 'getAllAliases')
}

async function createHeroFromAPI(hero) {
    return postRequest('/heroes/create', hero, 'createHero')
}

async function updateHeroFromAPI(data) {
    let hero = data.hero
    let secret = data.secret
    return putRequest('/heroes/update', hero, 'updateHero', { "params": { "org-secret": secret } })
}

async function getHeroByIdFromAPI(data) {
    let id = data.id
    let secret = data.secret
    return getRequest('/heroes/getbyid/' + id, 'getHeroById', { "params": { "org-secret": secret } })
}

async function getAllAliasesService() {
    let answer = await getAllAliasesFromAPI()
    return answer
}

async function createHeroService(hero) {
    let answer = await createHeroFromAPI(hero)
    return answer
}

async function updateHeroService(data) {
    let answer = await updateHeroFromAPI(data)
    return answer
}

async function getHeroByIdService(data) {
    let answer = await getHeroByIdFromAPI(data)
    return answer
}

export {
    getAllAliasesService,
    createHeroService,
    updateHeroService,
    getHeroByIdService,
}