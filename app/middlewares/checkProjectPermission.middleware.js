
import ApiError from "../errors/api.error.js";
import getUserProjectRole from "../utils/getUserProjectRole.js";

export default (requiredRoles) => {
  return async (req, res, next) => {
    try {
      console.log('Checking project permission...');
      const projectId = req.originalUrl.split('/')[2] === 'projects' ? req.originalUrl.split('/')[3] : req.originalUrl.split('/')[2];
      if (!Number(projectId)) {
        throw new ApiError(400, 'Bad Request', 'Invalid project ID');
      }
      const userId = req.user.id;
      console.log('Project ID:', projectId);
      

      const { project, role } = await getUserProjectRole(projectId, userId);

      // Accorder l'accès directement si l'utilisateur est administrateur
      if (role === 'admin') {
        req.userProjectRole = role;
        req.project = project;
        return next();
      }

      // Vérifier si le rôle de l'utilisateur est parmi les rôles requis
      if (!role || !requiredRoles.includes(role)) {
        throw new ApiError(403, 'Forbidden', 'You do not have the required permissions');
      }

      req.userProjectRole = role;
      req.project = project;
      console.log('User has the required permissions', role);
      return next();
    } catch (error) {
      console.error('Error checking project permission:', error);
      next(error);
    }
  };
};