
import { Project, List, Card, Tag, User } from "../../db/models/index.js";
import ApiError from "../errors/api.error.js";

export default async (resourceType, resourceId, userId) => {
  let resource;
  let ownerId;
  let collaborators;
  let role = null;

//   Check if the user is an admin and early return if true
  const user = await User.findByPk(userId);
  
  if(user && user.isAdmin){
    role = 'admin';
    return { resource, role };
  } else if (!user) {
    throw new ApiError(404, 'User not Found', `Error checking permission ${resourceType}`);
    }


  if (!resourceId) {
    throw new ApiError(400, 'Bad Request', 'Resource ID is required');
  }

  switch (resourceType) {
    case 'project':
      resource = await Project.findByPk(resourceId, {
        include: [{
          model: User,
          as: 'collaborators',
          attributes: ['id'],
        }],
      });
      if (!resource) {
        throw new ApiError(404, 'Not Found', `Error checking permission ${resourceType}`);
      }
      ownerId = resource.owner_id;
      collaborators = resource.collaborators;
      
      break;

    case 'list':
      resource = await List.findByPk(resourceId, {
        include: [{
          model: Project,
          as: 'project',
          attributes : ['owner_id'],
          include: [{
            model: User,
            as: 'collaborators',
            attributes: ['id'],
          }],
        }],
      });
      if (!resource) {
        throw new ApiError(404, 'List not Found', `Error checking permission ${resourceType}`);
      }
      // assign the owner id and collaborators array
      ownerId = resource.project.owner_id;
      collaborators = resource.project.collaborators;

      break;

    case 'card':
        resource = await Card.findByPk(resourceId, {
            include: [{
            model: List,
            as: 'list',
            attributes: ['id'],
            include: [{
                model: Project,
                as: 'project',
                attributes : ['owner_id'],
                include: [{
                model: User,
                as: 'collaborators',
                attributes: ['id'],
                }],
            }],
            }],
        });
        if (!resource) {
            throw new ApiError(404, 'Card not Found', `Error checking permission ${resourceType}`);
        }

        // assign the owner id and collaborators array
        ownerId = resource.list.project.owner_id;
        collaborators = resource.list.project.collaborators;

        
      break;

    case 'tag':
        resource = await Tag.findByPk(resourceId, {
            include: [{
            model: Project,
            as: 'project',
            attributes : ['owner_id'],
            include: [{
                model: User,
                as: 'collaborators',
                attributes: ['id'],
            }],}],
        });
        if (!resource) {
            throw new ApiError(404, 'Tag not Found', `Error checking permission ${resourceType}`);
        }

        // assign the owner id and collaborators array
        ownerId = resource.project.owner_id;
        collaborators = resource.project.collaborators;
        // check if the user is the owner or a collaborator

        if(ownerId === userId){
            role = 'owner';
        }
        else if(collaborators.some(user => user.id === userId)){
            role = 'collaborator';
        }
      break;

    case 'user':
      resource = await User.findByPk(resourceId,{attributes: ['id']});
      if (!resource) {
        throw new ApiError(404, 'User not Found', `Error checking permission ${resourceType}`);
  
      }
      if (userId === resourceId) {
        role = 'self';
      }
      break;

    default:
      throw new ApiError(400, 'Bad Request', 'Invalid resource type');
  }

  if (!role && ownerId && collaborators) {
    role = determineUserRole(ownerId, collaborators, userId);
  }

  return { resource, role };
};

// Function to determine the user role
function determineUserRole(ownerId, collaborators, userId) {
    if (ownerId === userId) {
      return 'owner';
    } else if (collaborators.some(user => user.id === userId)) {
      return 'collaborator';
    }
    return null;
  }