const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Recipes = require('./models/recipes')

const app = express();

mongoose
  .connect(
    "mongodb+srv://wincodes:mp9e9qvGmy8h37Qk@cluster0-0ogoh.mongodb.net/mean_stack?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch(error => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/recipes", (req, res, next) => {
  const recipes = new Recipes({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  recipes
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.get("/api/recipes/:id", (req, res, next) => {
  Recipes.findOne({
    _id: req.params.id
  })
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

app.put("/api/recipes/:id", (req, res, next) => {
  const recipes = new Recipes({
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  recipes.updateOne({ _id: req.params.id }, recipes)
    .then(() => {
      res.status(201).json({
        message: "recipes updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.delete("/api/recipes/:id", (req, res, next) => {
  Recipes.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.use("/api/recipes", (req, res, next) => {
  Recipes.find()
    .then(recipess => {
      res.status(200).json(recipess);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = app;
