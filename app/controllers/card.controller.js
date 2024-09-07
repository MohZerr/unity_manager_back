/* eslint-disable import/extensions */
/* eslint-disable max-len */
import {Card, Tag
} from '../../db/models/index.js';
import coreController from './core.controller.js';
import ApiError from '../errors/api.error.js';
import { getIOInstance } from '../sockets/app.socket.js';

export default class cardController extends coreController {
  static tableName = Card;

  static stringTableName = 'Card';

  static async create(req, res) {
    const {
      name,
      content,
      list_id,
      position,
      tags,
      project_id
    } = req.body;
  
    try {
      // Création de la carte
      const card = await Card.create({
        name, content, list_id, position,
      });
  
      card.dataValues.tags = [];
  
      // Ajouter tous les tags avec Promise.all
      if (tags && tags.length > 0) {
        const tagPromises = tags.map(async (tagz) => {
          const tag = await Tag.findByPk(tagz);
          if (!tag) {
            throw new Error(`Tag not found with the provided ID: ${tagz}`);
          }
          await card.addTag(tag);  // Ajout du tag à la carte
          card.dataValues.tags.push(tag.dataValues);     // Ajout du tag au tableau local
          return tag;
        });
  
        // Attendre que tous les tags soient ajoutés
        await Promise.all(tagPromises);
      }
  
      // Emission de l'événement avec les tags ajoutés
      getIOInstance().to(project_id).emit(`refresh${this.stringTableName}`, { verb: 'create', result: card });
  
      // Retour de la réponse HTTP avec la carte et les tags
      return res.status(201).json({ message: 'Card was successfully created', card });
    } catch (error) {
      console.error('Error creating card:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getOne(req, res, next) {
    const id = +req.params.id;
    if (!Number.isInteger(id)) {
      next(new ApiError(400, 'Bad Request', 'The provided ID is not a number'));
    }

    const card = await this.tableName.findByPk(id, {
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] },
      }],
    });

    if (!card) {
      return next(new ApiError(404, 'Data not found', `${this.stringTableName} not found with the provided the ID: ${id}`));
    }
    return res.json(card);
  }

  static async update(req, res, next) {
    const id = +req.params.id;
    if (!Number.isInteger(id)) {
      return next(new ApiError(400, 'Bad Request', 'The provided ID is not a number'));
    }
  
    const {
      name, content, list_id, position, project_id, tags
    } = req.body;
  
    const card = await this.tableName.findByPk(id);
    if (!card) {
      return next(new ApiError(404, 'Data not found', `${this.stringTableName} not found with the provided ID: ${id}`));
    }
  
    // Récupérer les tags actuels associés à la carte
    const currentTags = await card.getTags();
  
    // Vérifier si le contenu de la carte a changé
    const hasCardChanged = (
      card.name !== name ||
      card.content !== content ||
      card.list_id !== list_id ||
      card.position !== position
    );
  
    // Vérifier si les tags ont changé
    const tagsIds = tags ? tags.map(tag => tag.id) : [];
    const currentTagsIds = currentTags.map(tag => tag.id);
    const hasTagsChanged = JSON.stringify(currentTagsIds.sort()) !== JSON.stringify(tagsIds.sort());
  
    // Si rien n'a changé, renvoyer un 204 (No Content)
    if (!hasCardChanged && !hasTagsChanged) {
      return res.status(204).end();
    }

    // Mise à jour de la carte
  if(hasCardChanged){
    await card.update({
      name, content, list_id, position
    });
  }
  
    // Si les tags ont changé, mettre à jour les tags associés
    if (hasTagsChanged) {
      const tagsPromises = tags.map(async (tag) => {
        const comparedTag = await Tag.findByPk(tag.id);
        if (comparedTag && !currentTagsIds.includes(comparedTag.id)) {
          // Ajouter le tag s'il n'est pas déjà associé
          await card.addTag(comparedTag);
        }
      });
  
    
  
      await Promise.all([...tagsPromises]); // Attendre que toutes les modifications des tags soient faites
    }
    card.dataValues.tags = tags;
  
    // Émettre l'événement socket
    getIOInstance().to(project_id).emit(`refresh${this.stringTableName}`, { verb: 'update', result: card });
  
    return res.status(200).json({ message: 'Card was successfully updated' });
  }
}
