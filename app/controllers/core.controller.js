
import ApiError from '../errors/api.error.js';
import { getIOInstance } from '../sockets/app.socket.js';

export default class coreController {
  static tableName = null;

  static stringTableName = null;

  /**
   * Retrieves all data from the database and sends it as a JSON response.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @return {Object} The JSON response containing all retrieved data
   */
  static async getAll(req, res, next) {
    const results = await this.tableName.findAll();

    if (!results) {
      return next(new ApiError(404, 'Data not found', `${this.stringTableName} not found`));
    }

    return res.json(results);
  }

  /**
   * Retrieves all data from the database and sends it as a JSON response.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   * @return {Object} The JSON response containing all retrieved data
   */
  static async getOne(req, res, next) {
    const id = +req.params.id;
    if (!Number.isInteger(id)) {
      next(new ApiError(400, 'Bad Request', 'The provided ID is not a number'));
    }

    const result = await this.tableName.findByPk(id);

    if (!result) {
      return next(new ApiError(404, 'Data not found', `${this.stringTableName} not found with the provided the ID: ${id}`));
    }
    return res.json(result);
  }

  /**
   * Deletes a specific record from the database based on the provided ID.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @return {Object} No content response
   */
  static async deleteOne(req, res, next) {
    const id = +req.params.id;
    const project_id = +req.query.project_id;
    console.log("id",project_id)
    if (!Number.isInteger(id)) {
      next(new ApiError(400, 'Bad Request', 'The provided ID is not a number'));
    }
    const result = await this.tableName.findByPk(id);
    console.log(result.dataValues)
    if (!result) {
      next(new ApiError(404, 'Data not found', `${this.stringTableName} not found with the provided the ID: ${id}`));
    }
    await result.destroy();
      console.log(`refresh${this.stringTableName}`)
      getIOInstance().to(project_id).emit(`refresh${this.stringTableName}`,{verb:'delete',result:result});

    return res.status(204).end();
  }

  /**
   * Creates a new record in the database based on the input data.
   *
   * @param {Object} req - The request object containing the data to create the record.
   * @param {Object} res - The response object to send the result.
   * @return {Object} The created record as a JSON response with status code 201.
   */
  static async create(req, res) {
    const input = req.body;
    const result = await this.tableName.create(input);
    if(result){
      console.log(`refresh${this.stringTableName}`)
      getIOInstance().to(input.project_id).emit(`refresh${this.stringTableName}`,{verb:'create',result:result});
    }
    return res.status(201).json(result);
  }

  /**
   * A function to update a specific record in the database.
   *
   * @param {Object} req - The request object containing the ID and updated data
   * @param {Object} res - The response object to send the updated record
   * @return {Object} The updated record as a JSON response
   */
  static async update(req, res, next) {
    const id = +req.params.id;
    if (!Number.isInteger(id)) {
      return next(new ApiError(400, 'Bad Request', 'The provided ID is not a number'));
    }
    const input = req.body;
    console.log(input)
    const result = await this.tableName.findByPk(id);
    if (!result) {
      return next(new ApiError(404, 'Data not found', `${this.stringTableName} not found with the provided the ID: ${id}`));
    }
    await result.update(input);
    if(result){
      getIOInstance().to(input.project_id).emit(`refresh${this.stringTableName}`,{verb:'update',result:result});
    }
    // if the position is too small, reset the position of all the lists
    if(result.position<0.001){
      console.log("reset position",result.dataValues.project_id)

      const lists = await this.tableName.findAll({where:{project_id:result.project_id}});
      console.log(lists)

      lists.sort((a, b) => a.position - b.position);

      const updatePromises = lists.map((list, index) => {
        console.log(list.dataValues);
        return list.update({ position: index + 1 });
      });
    
      await Promise.all(updatePromises);
    }
    return res.json(result);
  }
}
