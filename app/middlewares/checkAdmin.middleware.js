/**
 * Check if the user has access to the resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */

import { User } from "../../db/models/index.js";
import ApiError from "../errors/api.error.js";
import Jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const userId = +req.user.id;
console.log("jesuisdanslemiddleware")
  if (!Number.isInteger(userId)) {
    next(new ApiError(400, 'Bad Request', 'The provided ID is not a number'));
  }

  User.findByPk(userId).then((user) => {
    if (!user) {
      next(new ApiError(404, 'Not Found', 'User not found'));
      }
      if(!user.isAdmin){
        const accessToken = Jwt.sign({ id: user.id, isAdmin: user.isAdmin,imUfoPorno:true }, process.env.JWT_SECRET);
        res.cookie('token', accessToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.ENV === "PROD" ? true : false,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        next(new ApiError(403, 'Forbidden', 'You do not have access to this resource'));
      }
      next();
      
      }).catch((error) => {
        console.error('Error while getting user:', error);
        next(new ApiError(500, 'Internal Server Error', 'An unexpected error occurred'));
      });
    };
