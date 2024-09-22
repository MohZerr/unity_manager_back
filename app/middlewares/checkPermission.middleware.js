import ApiError from "../errors/api.error.js";
import getUserResourceRole from "../utils/getUserResourceRole.js";

export default (resourceType, requiredRoles) => {
  return async (req, res, next) => {
    try {
      const resourceId = +req.params.id
      const userId = +req.user.id;

      const { resource, role } = await getUserResourceRole(resourceType, resourceId, userId);

      if(role === 'admin'){
        req.userResourceRole = role;
        req.resource = resource;
        return next();
      }

      // check if the user has the required role
      if (!role || !requiredRoles.includes(role)) {
        next(new ApiError(403, 'Forbidden', `You do not have the required permissions to access this ${resourceType}`));
      }
      

      req.userResourceRole = role;
      req.resource = resource;
      return next();
    } catch (error) {
      next(new ApiError(error.status, error.details, error.message));
    }
  };
};