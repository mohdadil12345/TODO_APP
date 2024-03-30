const express = require("express");
const { taskModel } = require("../models/task.model");

const taskRouter = express.Router();

// POST endpoint to add a task
taskRouter.post("/add",  async (req, res) => {


    try {
        const data = new taskModel({ ...req.body});
        await data.save();
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ error: "Failed to add todo"});
    }
});

// GET endpoint 
taskRouter.get("/",  async (req, res) => {
   

    try {
        const data = await taskModel.find() 
    

        res.status(200).json(data );
    } catch (err) {
        res.status(400).json({ error: "Failed to get todo"});
    }
});

// PATCH endpoint to update a task
taskRouter.patch("/update/:id",  async (req, res) => {
    const { id } = req.params;
   
    try {
     
            await taskModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).json({ msg: "Task updated successfully" });
       
    } catch (err) {
        res.status(400).json({ error: "Failed to update todo" });
    }
});

// DELETE endpoint to delete a task
taskRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
      
            await taskModel.findByIdAndDelete({ _id: id }, req.body);
            res.status(200).json({ msg: "todo deleted successfully" });
        
    } catch (err) {
        res.status(400).json({ error: "Failed to delete todo"});
    }
});

module.exports = {
    taskRouter
};
