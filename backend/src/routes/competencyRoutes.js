const {
    createCompetencyHandler,
    deleteCompetencyHandler,
    getCompetencyByIdHandler,
    listCompetenciesHandler,
    updateCompetencyHandler,
} = require('../controllers/competenciesController');

async function handleCompetencyRoutes(req, res, pathname, body) {
    if (req.method === 'GET' && pathname === '/api/competencies') {
        return listCompetenciesHandler(res);
    }

    if (req.method === 'POST' && pathname === '/api/competencies') {
        return createCompetencyHandler(res, body);
    }

    if (pathname.startsWith('/api/competencies/')) {
        const competencyId = pathname.split('/').pop();

        if (req.method === 'GET') {
            return getCompetencyByIdHandler(res, competencyId);
        }

        if (req.method === 'PUT' || req.method === 'PATCH') {
            return updateCompetencyHandler(res, competencyId, body);
        }

        if (req.method === 'DELETE') {
            return deleteCompetencyHandler(res, competencyId);
        }
    }

    return false;
}

module.exports = {
    handleCompetencyRoutes,
};
