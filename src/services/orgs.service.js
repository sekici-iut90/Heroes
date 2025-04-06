import { getRequest, postRequest, patchRequest } from "@/services/axios.service";

// Configuration des endpoints
const ORG_ENDPOINTS = {
    BASE: '/orgs',
    GET_ALL: '/orgs/get',
    CREATE: '/orgs/create',
    ADD_TEAM: '/orgs/addteam',
    REMOVE_TEAM: '/orgs/removeteam',
    GET_BY_ID: '/orgs/getbyid/'
};

// Service principal
class OrganisationService {
    /**
     * Récupère toutes les organisations
     * @returns {Promise<ApiResponse>} Réponse de l'API
     */
    static async getAll() {
        return getRequest(ORG_ENDPOINTS.GET_ALL, 'getAllOrganisations');
    }

    /**
     * Crée une nouvelle organisation
     * @param {Object} data - Données de l'organisation
     * @returns {Promise<ApiResponse>} Réponse de l'API
     */
    static async create(data) {
        return postRequest(ORG_ENDPOINTS.CREATE, data, 'createOrganisation');
    }

    /**
     * Ajoute une équipe à une organisation
     * @param {string} teamId - ID de l'équipe à ajouter
     * @param {string} orgSecret - Secret de l'organisation
     * @returns {Promise<ApiResponse>} Réponse de l'API
     */
    static async addTeam(teamId, orgSecret) {
        return patchRequest(
            ORG_ENDPOINTS.ADD_TEAM,
            { idTeam: teamId },
            'addTeam',
            { params: { "org-secret": orgSecret } }
        );
    }

    /**
     * Supprime une équipe d'une organisation
     * @param {string} teamId - ID de l'équipe à supprimer
     * @param {string} orgSecret - Secret de l'organisation
     * @returns {Promise<ApiResponse>} Réponse de l'API
     */
    static async removeTeam(teamId, orgSecret) {
        return patchRequest(
            ORG_ENDPOINTS.REMOVE_TEAM,
            { idTeam: teamId },
            'removeTeam',
            { params: { "org-secret": orgSecret } }
        );
    }

    /**
     * Récupère une organisation par son ID
     * @param {string} id - ID de l'organisation
     * @param {string} secret - Secret de l'organisation
     * @returns {Promise<ApiResponse>} Réponse de l'API
     */
    static async getById(id, secret) {
        return getRequest(
            `${ORG_ENDPOINTS.GET_BY_ID}${id}`,
            'getOrganisationById',
            { params: { "org-secret": secret } }
        );
    }
}

const getAllOrganisationsService = () => OrganisationService.getAll();
const createOrganisationService = (data) => OrganisationService.create(data);
const addTeamService = (teamId, secret) => OrganisationService.addTeam(teamId, secret);
const removeTeamService = (teamId, secret) => OrganisationService.removeTeam(teamId, secret);
const getOrganisationByIdService = (id, secret) => OrganisationService.getById(id, secret);

export {
    OrganisationService as default,
    getAllOrganisationsService,
    createOrganisationService,
    addTeamService,
    removeTeamService,
    getOrganisationByIdService
};