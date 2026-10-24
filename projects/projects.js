// Get the two functions from global.js
import { fetchJSON, renderProjects } from '../global.js';

// Load the project data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

// Find the box on the page where the projects go
const projectsContainer = document.querySelector('.projects');

// Show the projects, using <h2> for the titles
renderProjects(projects, projectsContainer, 'h2');

// show how many projects there are in the title
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;
