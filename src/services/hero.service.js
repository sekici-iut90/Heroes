import { getRequest, postRequest, putRequest } from "@/services/axios.service";

const HEROES_ENDPOINTS = {
    GET_ALIASES: '/heroes/getaliases',
    CREATE: '/heroes/create',
    UPDATE: '/heroes/update',
    GET_BY_ID: '/heroes/getbyid/'
};

// Service de base pour les opérations sur les héros
class HeroService {
    /**
     * Récupère tous les alias des héros
     * @returns {Promise<Object>} Réponse de l'API
     */
    static async getAllAliases() {
        return getRequest(HEROES_ENDPOINTS.GET_ALIASES, 'getAllAliases');
    }

    /**
     * Crée un nouveau héros
     * @param {Object} hero - Données du héros à créer
     * @returns {Promise<Object>} Réponse de l'API
     */
    static async create(hero) {
        return postRequest(HEROES_ENDPOINTS.CREATE, hero, 'createHero');
    }

    /**
     * Met à jour un héros existant
     * @param {Object} data - Données de mise à jour
     * @param {Object} data.hero - Données du héros
     * @param {string} data.secret - Secret de l'organisation
     * @returns {Promise<Object>} Réponse de l'API
     */
    static async update({ hero, secret }) {
        const config = {
            params: { "org-secret": secret }
        };
        return putRequest(HEROES_ENDPOINTS.UPDATE, hero, 'updateHero', config);
    }

    /**
     * Récupère un héros par son ID
     * @param {Object} data - Données de la requête
     * @param {string} data.id - ID du héros
     * @param {string} data.secret - Secret de l'organisation
     * @returns {Promise<Object>} Réponse de l'API
     */
    static async getById({ id, secret }) {
        const config = {
            params: { "org-secret": secret }
        };
        return getRequest(`${HEROES_ENDPOINTS.GET_BY_ID}${id}`, 'getHeroById', config);
    }
}

// Fonctions de service
async function getAllAliasesService() {
    return HeroService.getAllAliases();
}

async function createHeroService(hero) {
    return HeroService.create(hero);
}

async function updateHeroService(data) {
    return HeroService.update(data);
}

async function getHeroByIdService(data) {
    return HeroService.getById(data);
}

export {
    HeroService,
    getAllAliasesService,
    createHeroService,
    updateHeroService,
    getHeroByIdService,
};