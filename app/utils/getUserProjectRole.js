
import Project from "../../db/models/Project.js";
import User from "../../db/models/User.js";
import ApiError from "../errors/api.error.js";

export default async (projectId, userId) => {   
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(404, 'Not Found', 'User not found');
    }
    // Vérifier si l'utilisateur est administrateur
    if (user.dataValues.isAdmin) {
        console.log('User is admin');
        return { role: 'admin' };
    }
    if(!user.dataValues.isAdmin && !projectId) {
        throw new ApiError(403, 'Forbidden', 'You do not have the required permissions');

    }
    const project = await Project.findByPk(projectId, {
        include: [{
            model: User,
            as: 'collaborators',
            through: { attributes: [] },
            attributes: ['id'],
        }],
    });

    if (!project) {
        throw new ApiError(404, 'Not Found', 'Project not found');
    }
    
    // Vérifier si l'utilisateur est le propriétaire
    if (project.owner_id === user.id) {
      return { project, role: 'owner' };
    }
  
    // Vérifier si l'utilisateur est collaborateur
    const isCollaborator = project.collaborators.some(collaborator => collaborator.id === user.id);
  
    if (isCollaborator) {
      return { project, role: 'collaborator' };
    }
  
    // L'utilisateur n'a aucun rôle sur ce projet
    return { project, role: null };
  };