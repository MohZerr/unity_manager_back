/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import { Message } from '../models/index.js';
import ApiError from '../errors/api.error.js';

const messageController = {

  async create(req, res) {
    const { id } = req.user;
    const input = req.body;
    const newMessage = new Message({ ...input, user_id: id });
    await newMessage.save();
    res.send(newMessage);
  },
  async getOne(req, res) {
    const { id } = req.params;
    const message = await Message.findById({ _id: id });
    res.send(message);
  },
  async getAll(req, res) {
    const messages = await Message.find();
    res.send(messages);
  },
  async deleteOne(req, res) {
    const { id } = req.params;
    const message = await Message.findById({ _id: id });
    if (!message) {
      throw new ApiError(404, 'Data not found', `${Message.name} not found with the provided the ID: ${id}`);
    }
    await message.deleteOne();
    res.send({ message: `${Message.name} deleted successfully!` });
  },
  async update(req, res) {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { ...req.body });
    const newMessage = await Message.findById({ _id: id });
    res.send(newMessage);
  },
  async getByProjectId(req, res) {
    const { id } = req.params;
    console.log('id de la requête get by project id :', req.params.id);
    const messages = await Message.find({ project_id: id });
    res.send(messages);
  },
  async getByUserId(req, res) {
    const { id } = req.params;
    const messages = await Message.findAll({ where: { user_id: id } });
    res.send(messages);
  },
};
export default messageController;
