// Get the functions from global.js
import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// first 3 projects 
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');

// GitHub stats
// Get my profile data from the GitHub API
const githubData = await fetchGitHubData('trkieu-commits');

// Find the box on the page for the stats
const profileStats = document.querySelector('#profile-stats');

// Fill in the box (only if it exists on the page)
if (profileStats) {
  profileStats.innerHTML = `
    <h2>My GitHub Stats</h2>
    <dl>
      <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers</dt><dd>${githubData.followers}</dd>
      <dt>Following</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}
