const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtener todas las tareas
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         description: Filtrar tareas por estado (true o false)
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', async (req, res) => {
  const { status } = req.query;

  try {
    let tasks;
    if (status !== undefined) {
      tasks = await Task.find({ status: status === 'true' });
    } else {
      tasks = await Task.find();
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tarea
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la tarea
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ id: parseInt(id) });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tarea creada
 *       400:
 *         description: Error de validación
 */
router.post(
  '/',
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  body('status').optional().isBoolean().withMessage('El estado debe ser un valor booleano'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, status, description } = req.body;
    try {
      const newTask = new Task({ title, status, description });
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tarea a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *       404:
 *         description: Tarea no encontrada
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { id: parseInt(id) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tarea a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ id: parseInt(id) });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
