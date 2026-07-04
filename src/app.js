import express from "express";

const app = express();
app.use(express.json())

const projects = [];
let nextProjectId = 1;

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to BuildBoard API"
    })
})

app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    })
})

app.get("/projects", (req, res) => {
    res.json(projects)
})

app.get("/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);

    console.log('Id:  ---->',id);
    const project = projects.find(p => p.id === id);

    if(!project) {
        return res.status(404).json({
            message: "Project Not Found"
        })
    }

    res.json(project)
})

app.post("/projects", (req, res) => {
    const projectName = req.body.projectName;

    const project = {
        id: nextProjectId++,
        projectName: projectName
    }

    projects.push(project);

    res.status(201).json(project);
})

app.patch("/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const projectName = req.body.projectName;

    const project = projects.find(p => p.id === id)

    if(!project) {
        return res.status(404).json({
            message: "Project Not Found"
        })
    }

    project.projectName = projectName;

    res.json(project);
})

app.delete("/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);
 
    const index = projects.findIndex(p => p.id === id);
     if(index === -1 ) {
        return res.status(404).json({
            message: "Project Not Found"
        })
    }

    const deletedProj = projects.splice(index, 1);
    res.json({message: "Project Deleted", project: deletedProj[0]});
})



export default app;