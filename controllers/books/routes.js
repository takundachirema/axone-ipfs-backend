import express from 'express';
const router = express.Router();
import * as controller from './books';

router.post('/books/create', async (req, res) => {
    try {
      const {
        title,
        summary,
        authorId
      } = req.body;
  
      const item = await controller.createBook({
        title,
        summary,
        authorId
      });
      
      res.json({
        item,
        status: 400,
        message: 'Book created successfully!'
      })
    } catch (err) {
      res.json({
        item: null,
        status: err.code || err.statusCode || 500,
        message: err.message || 'Something went wrong while creating new item!'
      });
    }
});

router.get('/books/home', async (req, res) => {
    try {
      const {
        hash
      } = req.params;
  
      const item = await controller.home();
      res.json({
        item,
        status: 200,
        message: 'Item read successfully!'
      });
    } catch (err) {
      res.json({
        item: null,
        status: err.code || err.statusCode || 500,
        message: err.message || 'Something went wrong while reading item from DB!'
      });
    }
});

router.get('/books/search/:query', async (req, res) => {
    try {
      const {
        query
      } = req.params;
  
      const item = await controller.searchForBooks(query)
      res.json({
        item,
        status: 200,
        message: 'Item read successfully!'
      });
    } catch (err) {
      res.json({
        item: null,
        status: err.code || err.statusCode || 500,
        message: err.message || 'Something went wrong while reading item from DB!'
      });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
      const {
        id
      } = req.params;
  
      const item = await controller.getBook(id)
      res.json({
        item,
        status: 200,
        message: 'Item read successfully!'
      });
    } catch (err) {
      res.json({
        item: null,
        status: err.code || err.statusCode || 500,
        message: err.message || 'Something went wrong while reading item from DB!'
      });
    }
});

router.get('/books/chapters/:id', async (req, res) => {
    try {
      const {
        id
      } = req.params;
  
      const item = await controller.getChapters(id)
      res.json({
        item,
        status: 200,
        message: 'Item read successfully!'
      });
    } catch (err) {
      res.json({
        item: null,
        status: err.code || err.statusCode || 500,
        message: err.message || 'Something went wrong while reading item from DB!'
      });
    }
});

export default router;