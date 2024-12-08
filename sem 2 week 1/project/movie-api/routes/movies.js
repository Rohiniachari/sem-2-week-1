const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// GET /api/movies: Fetch all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movies', error: err.message });
    }
});

// GET /api/movies/:id: Fetch details of a specific movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movie', error: err.message });
    }
});

// POST /api/movies: Add a new movie
router.post('/', async (req, res) => {
    try {
        const { title, genre, releaseYear } = req.body;
        const newMovie = new Movie({ title, genre, releaseYear });
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(400).json({ message: 'Error adding movie', error: err.message });
    }
});

// PUT /api/movies/:id: Update a movie's information
router.put('/:id', async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(updatedMovie);
    } catch (err) {
        res.status(400).json({ message: 'Error updating movie', error: err.message });
    }
});

// DELETE /api/movies/:id: Remove a movie
router.delete('/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting movie', error: err.message });
    }
});

module.exports = router;
