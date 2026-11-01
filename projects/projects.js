// Get the two functions from global.js
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Load the project data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

// Find the box on the page where the projects go
const projectsContainer = document.querySelector('.projects');

// show how many projects there are in the title
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

// pie chart + search + click-to-filter 

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// give each year its own color
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// The two filters. Both are kept here so they can be combined.
let query = '';
let selectedIndex = -1; // which wedge is selected (-1 = none)
let selectedYear = null; // the year that wedge stands for

// case-insensitive search across all project fields
function filterByQuery(projectsGiven) {
  return projectsGiven.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

// 5.4 fix: apply BOTH filters every time either one changes.
// The pie shows the search results; the project list shows
// the search results narrowed down to the selected year.
function updatePage() {
  let searched = filterByQuery(projects);
  renderPieChart(searched);

  let visible =
    selectedYear === null
      ? searched
      : searched.filter((project) => project.year === selectedYear);
  renderProjects(visible, projectsContainer, 'h2');
}

// Select (or deselect) a wedge, then re-apply the filters
function toggleWedge(i, label) {
  selectedIndex = selectedIndex === i ? -1 : i;
  selectedYear = selectedIndex === -1 ? null : label;
  updatePage();
}


function renderPieChart(projectsGiven) {
  // count projects per year
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // turn [year, count] pairs into { value, label } objects
  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  // The wedges may have moved, so find the selected year's new index.
  // If that year isn't in the search results anymore, clear the selection.
  selectedIndex = data.findIndex((d) => d.label === selectedYear);
  if (selectedIndex === -1) selectedYear = null;

  // clear the old wedges and legend before drawing new ones
  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // draw the wedges 
  arcs.forEach((arc, i) => {
    let label = data[i].label;
    svg
      .append('path')
      .attr('d', arc)
      .attr('style', `--color:${colors(label)}`)
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => toggleWedge(i, label));
  });

  // move the selected slice to the front so its outline isn't covered
  svg.select('path.selected').raise();

  // draw the legend 
  data.forEach((d, i) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(d.label)}`)
      .attr('class', i === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => toggleWedge(i, d.label));
  });
}

//  re-filter as the user types
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  updatePage();
});

// first render on page load
updatePage();
