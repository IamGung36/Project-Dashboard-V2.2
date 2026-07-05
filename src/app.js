/**
 * SolarTrack Dashboard Frontend Logic
 * Supports Real-time Google Apps Script execution and local mockup fallback
 */

// Global State
const state = {
  projects: [],
  filters: {
    search: '',
    region: 'All',
    status: 'All',
    engineer: 'All'
  },
  activeTab: 'overview',
  viewMode: 'grid',
  maps: {
    overview: null,
    fullScreen: null
  },
  mapMarkers: {
    overview: [],
    fullScreen: []
  },
  charts: {
    stages: null,
    regions: null
  }
};

// Mock Data for local preview
const MOCK_PROJECTS = [
  {
    "id": "P-001",
    "Project code": "G26-001",
    "name": "Solar Carpark Fashion Island",
    "region": "Central",
    "engineer": "Gung",
    "id engineer": "M-001",
    "businessType": "EPC",
    "investor": "GC",
    "client": "Land and Houses",
    "systems": "Carpark",
    "Solar capacity (kWp)": 1.8,
    "BESS capacity (kWh)": 0,
    "lat": 13.8248,
    "lng": 100.6782,
    "googleMapsLink": "https://maps.app.goo.gl/tBwGjQyFf46d1224",
    "image": "https://images.unsplash.com/photo-1594818379496-da1e345b06a9?w=600&auto=format&fit=crop&q=60",
    "deliverables": '[{"name":"Survey Reports","hours":4,"checked":true},{"name":"PV Layout","hours":4,"checked":true},{"name":"Single Line Diagram","hours":4,"checked":true},{"name":"PVSyst Simulation","hours":4,"checked":true},{"name":"Bill of Quantities (BOQ)","hours":4,"checked":true},{"name":"Load Profile Analysis","hours":4,"checked":true}]',
    "notes": "Premium installation completed.",
    "status": "In Progress",
    "stage": "Underdevelop",
    "deadline": "2026-10-30",
    "constructionDate": "",
    "codDate": "",
    "prTest": "",
    "pv": "",
    "inverter": "",
    "awardNote": "",
    "revisions": ""
  },
  {
    "id": "P-002",
    "Project code": "G26-002",
    "name": "BESS Microgrid Koh Samui",
    "region": "South",
    "engineer": "Hone",
    "id engineer": "M-002",
    "businessType": "EPC",
    "investor": "Other",
    "client": "Samui Resort Association",
    "systems": "Rooftop,BESS",
    "Solar capacity (kWp)": 5.0,
    "BESS capacity (kWh)": 1.0,
    "lat": 9.512,
    "lng": 100.0136,
    "googleMapsLink": "https://maps.app.goo.gl/tBwGjQyFf46d1225",
    "image": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&auto=format&fit=crop&q=60",
    "deliverables": '[{"name":"Survey Reports","hours":4,"checked":true},{"name":"PV Layout","hours":4,"checked":true},{"name":"Single Line Diagram","hours":4,"checked":true},{"name":"PVSyst Simulation","hours":4,"checked":true},{"name":"Bill of Quantities (BOQ)","hours":4,"checked":true},{"name":"Load Profile Analysis","hours":4,"checked":true}]',
    "notes": "Testing grid stability.",
    "status": "Standby",
    "stage": "Underdevelop",
    "deadline": "2026-11-15",
    "constructionDate": "",
    "codDate": "",
    "prTest": "",
    "pv": "",
    "inverter": "",
    "awardNote": "",
    "revisions": ""
  },
  {
    "id": "P-003",
    "Project code": "G26-003",
    "name": "Solar Farm Chiang Mai Agri",
    "region": "North",
    "engineer": "Golf",
    "id engineer": "M-003",
    "businessType": "PPA",
    "investor": "GPSC",
    "client": "Northern Agriculture Ltd",
    "systems": "Farm",
    "Solar capacity (kWp)": 8.5,
    "BESS capacity (kWh)": 0,
    "lat": 18.7883,
    "lng": 98.9853,
    "googleMapsLink": "https://maps.app.goo.gl/tBwGjQyFf46d1227",
    "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=60",
    "deliverables": '[{"name":"Survey Reports","hours":4,"checked":true},{"name":"PV Layout","hours":4,"checked":true},{"name":"Single Line Diagram","hours":4,"checked":true},{"name":"PVSyst Simulation","hours":4,"checked":true},{"name":"Bill of Quantities (BOQ)","hours":4,"checked":true},{"name":"Load Profile Analysis","hours":4,"checked":true}]',
    "notes": "Awaiting local permits.",
    "status": "In Progress",
    "stage": "Underdevelop",
    "deadline": "2027-02-15",
    "constructionDate": "",
    "codDate": "",
    "prTest": "",
    "pv": "",
    "inverter": "",
    "awardNote": "",
    "revisions": ""
  },
  {
    "id": "P-004",
    "Project code": "G26-004",
    "name": "Hybrid Floating & Carpark Rayong",
    "region": "East",
    "engineer": "Gung",
    "id engineer": "M-001",
    "businessType": "PPA",
    "investor": "PTT",
    "client": "Amata City Rayong",
    "systems": "Floating,Carpark",
    "Solar capacity (kWp)": 17.5,
    "BESS capacity (kWh)": 0,
    "lat": 13.0125,
    "lng": 101.1963,
    "googleMapsLink": "https://maps.app.goo.gl/tBwGjQyFf46d1228",
    "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=60",
    "deliverables": '[{"name":"Survey Reports","hours":4,"checked":true},{"name":"PV Layout","hours":4,"checked":true},{"name":"Single Line Diagram","hours":4,"checked":true},{"name":"PVSyst Simulation","hours":4,"checked":true},{"name":"Bill of Quantities (BOQ)","hours":4,"checked":true},{"name":"Load Profile Analysis","hours":4,"checked":true}]',
    "notes": "Large industrial project.",
    "status": "Standby",
    "stage": "Underdevelop",
    "deadline": "2026-09-01",
    "constructionDate": "",
    "codDate": "",
    "prTest": "",
    "pv": "",
    "inverter": "",
    "awardNote": "",
    "revisions": ""
  },
  {
    "id": "P-005",
    "Project code": "G26-005",
    "name": "Commercial Rooftop Bangkok Mall",
    "region": "Central",
    "engineer": "Gung",
    "id engineer": "M-001",
    "businessType": "EPC",
    "investor": "GPSC",
    "client": "Bangkok Plaza Corp",
    "systems": "Rooftop",
    "Solar capacity (kWp)": 5000,
    "BESS capacity (kWh)": 3000,
    "lat": 13.9257,
    "lng": 100.6104,
    "googleMapsLink": "",
    "image": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=60",
    "deliverables": '[{"name":"Survey Reports","hours":4,"checked":true},{"name":"PV Layout","hours":4,"checked":true},{"name":"Single Line Diagram","hours":4,"checked":true},{"name":"PVSyst Simulation","hours":4,"checked":true},{"name":"Bill of Quantities (BOQ)","hours":4,"checked":true},{"name":"Load Profile Analysis","hours":4,"checked":true}]',
    "notes": "Largest rooftop grid in Bangkok area.",
    "status": "In Progress",
    "stage": "Underdevelop",
    "deadline": "2026-06-29",
    "constructionDate": "",
    "codDate": "",
    "prTest": "",
    "pv": "",
    "inverter": "",
    "awardNote": "",
    "revisions": ""
  },
  {
    "id": "P-006",
    "Project code": "G26-006",
    "name": "Floating Solar Phitsanulok",
    "region": "North",
    "engineer": "Golf",
    "id engineer": "M-003",
    "businessType": "EPC",
    "investor": "GPSC",
    "client": "Phitsanulok Provincial Hospital",
    "systems": "Floating",
    "Solar capacity (kWp)": 1000,
    "BESS capacity (kWh)": 0,
    "lat": 18.785,
    "lng": 98.9823,
    "googleMapsLink": "",
    "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=60",
    "deliverables": '[]',
    "notes": "Pending environmental impact report.",
    "status": "In Progress",
    "stage": "Underdevelop",
    "deadline": "2026-06-29",
    "constructionDate": "",
    "codDate": "",
    "prTest": "",
    "pv": "",
    "inverter": "",
    "awardNote": "",
    "revisions": ""
  }
];

// Determine if we are running in Google Apps Script environment
function isGAS() {
  return typeof google !== 'undefined' && typeof google.script !== 'undefined';
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupFilters();
  setupFormTabs();
  setupEventListeners();
  
  // Set Environment Status indicator
  const indicator = document.getElementById('status-indicator');
  const label = document.getElementById('status-label');
  
  if (isGAS()) {
    indicator.className = 'status-dot online';
    label.innerText = 'Real-time (GAS)';
  } else {
    indicator.className = 'status-dot local';
    label.innerText = 'Local Preview (Mock)';
  }
  
  // Load initial data
  syncData();
});

// Setup Navigation Tab switching
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const tabName = item.getAttribute('data-tab');
      if (!tabName) return;
      
      // Update sidebar active state
      navItems.forEach(ni => ni.classList.remove('active'));
      item.classList.add('active');
      
      // Show tab content
      document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
      });
      document.getElementById(`tab-${tabName}`).classList.add('active');
      
      state.activeTab = tabName;
      
      // Customize Topbar Title
      if (tabName === 'overview') {
        pageTitle.innerText = 'Dashboard Overview';
        pageSubtitle.innerText = 'Real-time solar project metrics and statuses';
        // Redraw maps and charts to fit container
        setTimeout(refreshOverviewTabWidgets, 100);
      } else if (tabName === 'projects') {
        pageTitle.innerText = 'Project Catalog';
        pageSubtitle.innerText = 'Filter, edit, and manage individual project profiles';
      } else if (tabName === 'map-view') {
        pageTitle.innerText = 'Interactive Map';
        pageSubtitle.innerText = 'Visualise all solar sites across Thailand';
        setTimeout(initFullScreenMap, 100);
      }
    });
  });
}

// Force Leaflet/ApexCharts to resize properly when switching tabs
function refreshOverviewTabWidgets() {
  if (state.maps.overview) {
    state.maps.overview.invalidateSize();
  }
  if (state.charts.stages) state.charts.stages.windowResizeHandler();
  if (state.charts.regions) state.charts.regions.windowResizeHandler();
}

// Synchronize Data
function syncData() {
  const syncBtn = document.getElementById('btn-sync');
  const syncIcon = document.getElementById('sync-icon');
  
  syncBtn.disabled = true;
  syncIcon.classList.add('fa-spin');
  showToast('info', 'Synchronizing data...');
  
  if (isGAS()) {
    google.script.run
      .withSuccessHandler((response) => {
        syncBtn.disabled = false;
        syncIcon.classList.remove('fa-spin');
        
        if (response.status === 'success') {
          state.projects = response.projects;
          showToast('success', 'Data loaded successfully from Google Sheets.');
          processAndRender();
        } else {
          showToast('error', 'Sync failed: ' + response.message);
          console.error(response);
          loadFallbackData();
        }
      })
      .withFailureHandler((error) => {
        syncBtn.disabled = false;
        syncIcon.classList.remove('fa-spin');
        showToast('error', 'Apps Script Server Connection Error: ' + error.toString());
        loadFallbackData();
      })
      .getProjectsData();
  } else {
    // Local simulation
    setTimeout(() => {
      syncBtn.disabled = false;
      syncIcon.classList.remove('fa-spin');
      if (state.projects.length === 0) {
        state.projects = JSON.parse(JSON.stringify(MOCK_PROJECTS)); // Deep clone
      }
      showToast('success', 'Local mock database loaded.');
      processAndRender();
    }, 800);
  }
}

// Fallback if Apps Script fails
function loadFallbackData() {
  console.log("Loading mock fallback data...");
  state.projects = JSON.parse(JSON.stringify(MOCK_PROJECTS));
  processAndRender();
}

// Process data and execute all renderings
function processAndRender() {
  updateFiltersDropdowns();
  renderAll();
}

// Calculate progress percent from deliverables JSON array
function calculateProgress(deliverablesJson) {
  if (!deliverablesJson) return 0;
  try {
    const list = typeof deliverablesJson === 'string' ? JSON.parse(deliverablesJson) : deliverablesJson;
    if (!Array.isArray(list) || list.length === 0) return 0;
    
    const checked = list.filter(d => d.checked).length;
    return Math.round((checked / list.length) * 100);
  } catch (e) {
    return 0;
  }
}

// Recalculates metrics and updates DOM
function renderAll() {
  const filtered = getFilteredProjects();
  
  // 1. Render KPI Metrics
  const totalProjects = state.projects.length;
  let totalSolar = 0;
  let totalBess = 0;
  let totalProgressPercentSum = 0;
  let progressCount = 0;
  
  state.projects.forEach(p => {
    // Handle capacity column names carefully due to trailing space in sheet
    const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
    const bessVal = parseFloat(p["BESS capacity (kWh)"] || p["BESS capacity"] || 0);
    
    totalSolar += isNaN(solarVal) ? 0 : solarVal;
    totalBess += isNaN(bessVal) ? 0 : bessVal;
    
    const prog = calculateProgress(p.deliverables);
    totalProgressPercentSum += prog;
    progressCount++;
  });
  
  const avgProgress = progressCount > 0 ? Math.round(totalProgressPercentSum / progressCount) : 0;
  
  document.getElementById('kpi-total-projects').innerText = totalProjects;
  document.getElementById('kpi-solar-capacity').innerHTML = `${formatNumber(totalSolar)} <span class="unit">kWp</span>`;
  document.getElementById('kpi-bess-capacity').innerHTML = `${formatNumber(totalBess)} <span class="unit">kWh</span>`;
  document.getElementById('kpi-avg-progress').innerText = `${avgProgress}%`;
  
  // 2. Render Project Catalog Views (Grid & Table)
  renderProjectsGrid(filtered);
  renderProjectsTable(filtered);
  
  // 3. Render Widgets (Overview Map, Charts)
  initOverviewMap();
  renderCharts();
  
  // If map tab is active, reload fullscreen map
  if (state.activeTab === 'map-view') {
    initFullScreenMap();
  }
}

// Filter projects list based on UI inputs
function getFilteredProjects() {
  return state.projects.filter(p => {
    // Search filter
    const query = state.filters.search.toLowerCase().trim();
    const matchesSearch = !query || 
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.id && p.id.toLowerCase().includes(query)) ||
      (p["Project code"] && p["Project code"].toLowerCase().includes(query)) ||
      (p.engineer && p.engineer.toLowerCase().includes(query)) ||
      (p.client && p.client.toLowerCase().includes(query));
      
    // Dropdowns filters
    const matchesRegion = state.filters.region === 'All' || p.region === state.filters.region;
    const matchesStatus = state.filters.status === 'All' || p.status === state.filters.status;
    const matchesEngineer = state.filters.engineer === 'All' || p.engineer === state.filters.engineer;
    
    return matchesSearch && matchesRegion && matchesStatus && matchesEngineer;
  });
}

// Generate unique filter dropdown options
function updateFiltersDropdowns() {
  const regions = new Set();
  const engineers = new Set();
  
  state.projects.forEach(p => {
    if (p.region) regions.add(p.region);
    if (p.engineer) engineers.add(p.engineer);
  });
  
  const regionDropdown = document.getElementById('filter-region');
  const engineerDropdown = document.getElementById('filter-engineer');
  
  // Save active selections
  const currentRegion = state.filters.region;
  const currentEngineer = state.filters.engineer;
  
  // Reset
  regionDropdown.innerHTML = '<option value="All">All Regions</option>';
  engineerDropdown.innerHTML = '<option value="All">All Engineers</option>';
  
  Array.from(regions).sort().forEach(r => {
    regionDropdown.innerHTML += `<option value="${r}">${r}</option>`;
  });
  
  Array.from(engineers).sort().forEach(eng => {
    engineerDropdown.innerHTML += `<option value="${eng}">${eng}</option>`;
  });
  
  // Restore selections
  regionDropdown.value = currentRegion;
  engineerDropdown.value = currentEngineer;
}

// Render cards
function renderProjectsGrid(filtered) {
  const container = document.getElementById('projects-grid-container');
  const emptyState = document.getElementById('projects-empty-state');
  
  if (state.viewMode !== 'grid') {
    container.classList.add('d-none');
    return;
  }
  
  container.classList.remove('d-none');
  
  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('d-none');
    return;
  }
  
  emptyState.classList.add('d-none');
  
  let html = '';
  filtered.forEach(p => {
    const progress = calculateProgress(p.deliverables);
    const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
    const bessVal = parseFloat(p["BESS capacity (kWh)"] || p["BESS capacity"] || 0);
    
    // Status Badge classes
    let statusClass = 'badge-secondary';
    if (p.status === 'In Progress') statusClass = 'badge-info';
    else if (p.status === 'Standby') statusClass = 'badge-warning';
    else if (p.status === 'Completed') statusClass = 'badge-success';
    
    const defaultImage = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=60';
    const bgImage = p.image || defaultImage;
    const initial = p.engineer ? p.engineer.charAt(0).toUpperCase() : '?';
    
    html += `
      <div class="project-card glass-panel">
        <div class="project-card-image" style="background-image: url('${bgImage}')">
          <div class="project-card-overlay">
            <span class="project-card-code">${p["Project code"] || p.id}</span>
            <span class="badge ${statusClass}">${p.status || 'Unknown'}</span>
          </div>
        </div>
        
        <div class="project-card-body">
          <h3 class="project-card-title" title="${p.name}">${p.name || 'Unnamed Project'}</h3>
          
          <div class="project-specs-grid">
            <div class="spec-item">
              <span class="spec-label">Solar Capacity</span>
              <span class="spec-val"><i class="fa-solid fa-solar-panel"></i>${solarVal} kWp</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">BESS Capacity</span>
              <span class="spec-val"><i class="fa-solid fa-battery-three-quarters"></i>${bessVal} kWh</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Region</span>
              <span class="spec-val"><i class="fa-solid fa-earth-asia"></i>${p.region || '-'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Business Type</span>
              <span class="spec-val"><i class="fa-solid fa-briefcase"></i>${p.businessType || '-'}</span>
            </div>
          </div>
          
          <div class="project-progress-container">
            <div class="progress-info">
              <span>Progress</span>
              <span>${progress}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
          </div>
        </div>
        
        <div class="project-card-footer">
          <div class="engineer-badge" title="Engineer: ${p.engineer || 'Unassigned'}">
            <div class="engineer-avatar">${initial}</div>
            <span>${p.engineer || 'Unassigned'}</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-icon-only btn-edit" onclick="openEditModal('${p.id}')" title="Edit project">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-icon-only btn-delete" onclick="triggerDeleteProject('${p.id}')" title="Delete project" style="color: var(--danger);">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Render Table Row list
function renderProjectsTable(filtered) {
  const container = document.getElementById('projects-table-container');
  const tbody = document.getElementById('projects-table-body');
  const emptyState = document.getElementById('projects-empty-state');
  
  if (state.viewMode !== 'table') {
    container.classList.add('d-none');
    return;
  }
  
  container.classList.remove('d-none');
  
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('d-none');
    return;
  }
  
  emptyState.classList.add('d-none');
  
  let html = '';
  filtered.forEach(p => {
    const progress = calculateProgress(p.deliverables);
    const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
    const bessVal = parseFloat(p["BESS capacity (kWh)"] || p["BESS capacity"] || 0);
    
    let statusClass = 'badge-secondary';
    if (p.status === 'In Progress') statusClass = 'badge-info';
    else if (p.status === 'Standby') statusClass = 'badge-warning';
    else if (p.status === 'Completed') statusClass = 'badge-success';
    
    html += `
      <tr>
        <td><span class="project-card-code">${p["Project code"] || p.id}</span></td>
        <td class="td-project-name" title="${p.name}">${p.name || 'Unnamed Project'}</td>
        <td>${p.region || '-'}</td>
        <td>${p.engineer || 'Unassigned'}</td>
        <td class="td-capacity">${solarVal}</td>
        <td class="td-capacity">${bessVal}</td>
        <td><span class="badge ${statusClass}">${p.status || 'Unknown'}</span></td>
        <td><span class="badge badge-secondary">${p.stage || 'Underdevelop'}</span></td>
        <td style="white-space: nowrap;">${p.deadline || '-'}</td>
        <td>
          <div class="table-progress-bar">
            <div class="progress-track" style="width: 80px;">
              <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <span>${progress}%</span>
          </div>
        </td>
        <td>
          <div class="card-actions">
            <button class="btn btn-icon-only btn-sm" onclick="openEditModal('${p.id}')" title="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-icon-only btn-sm" onclick="triggerDeleteProject('${p.id}')" title="Delete" style="color: var(--danger);">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
}

// Initialize Overview Map (Renders Leaflet Map under geographic sections)
function initOverviewMap() {
  const mapElement = document.getElementById('overview-map');
  if (!mapElement) return;
  
  // Clear map markers if map exists
  if (state.maps.overview) {
    state.mapMarkers.overview.forEach(m => state.maps.overview.removeLayer(m));
    state.mapMarkers.overview = [];
  } else {
    // Bangkok coordinates center default
    state.maps.overview = L.map('overview-map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([13.7367, 100.5231], 6);
    
    // Add cartodb dark matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(state.maps.overview);
  }
  
  plotMarkers(state.maps.overview, state.mapMarkers.overview);
}

// Initialize Full-Screen Map under Map View tab
function initFullScreenMap() {
  const mapElement = document.getElementById('full-screen-map');
  if (!mapElement) return;
  
  if (state.maps.fullScreen) {
    state.mapMarkers.fullScreen.forEach(m => state.maps.fullScreen.removeLayer(m));
    state.mapMarkers.fullScreen = [];
    state.maps.fullScreen.invalidateSize();
  } else {
    state.maps.fullScreen = L.map('full-screen-map').setView([13.7367, 100.5231], 6);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(state.maps.fullScreen);
  }
  
  plotMarkers(state.maps.fullScreen, state.mapMarkers.fullScreen);
}

// Plot Leaflet Markers on provided map
function plotMarkers(mapObj, markerArray) {
  let validLocationsCount = 0;
  const bounds = [];
  
  state.projects.forEach(p => {
    const lat = parseFloat(p.lat);
    const lng = parseFloat(p.lng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      validLocationsCount++;
      const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
      const bessVal = parseFloat(p["BESS capacity (kWh)"] || p["BESS capacity"] || 0);
      
      const popupHtml = `
        <div class="map-popup-card">
          <div class="map-popup-title">${p.name || 'Unnamed Project'}</div>
          <div class="map-popup-row">
            <span>Project Code:</span>
            <strong>${p["Project code"] || p.id}</strong>
          </div>
          <div class="map-popup-row">
            <span>Solar Capacity:</span>
            <strong>${solarVal} kWp</strong>
          </div>
          <div class="map-popup-row">
            <span>BESS Capacity:</span>
            <strong>${bessVal} kWh</strong>
          </div>
          <div class="map-popup-row">
            <span>Region:</span>
            <strong>${p.region || '-'}</strong>
          </div>
          <div class="map-popup-row">
            <span>Engineer:</span>
            <strong>${p.engineer || 'Unassigned'}</strong>
          </div>
          <div class="map-popup-row">
            <span>Status:</span>
            <strong>${p.status || 'Unknown'}</strong>
          </div>
          ${p.googleMapsLink ? `<a href="${p.googleMapsLink}" target="_blank" class="map-popup-btn"><i class="fa-solid fa-map-pin"></i> Google Maps</a>` : ''}
        </div>
      `;
      
      // Determine marker color based on status
      let markerColor = '#64748b'; // standby / unknown (gray)
      if (p.status === 'In Progress') markerColor = '#0ea5e9'; // primary blue
      else if (p.status === 'Completed') markerColor = '#10b981'; // green
      
      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(popupHtml);
      
      marker.addTo(mapObj);
      markerArray.push(marker);
      bounds.push([lat, lng]);
    }
  });
  
  // Auto zoom to fit all markers if locations exist
  if (validLocationsCount > 0 && mapObj) {
    mapObj.fitBounds(bounds, { padding: [30, 30] });
  }
}

// Render ApexCharts data visualizations
function renderCharts() {
  const stagesData = {};
  const regionsData = {};
  
  state.projects.forEach(p => {
    // Stages count
    const stage = p.stage || 'Underdevelop';
    stagesData[stage] = (stagesData[stage] || 0) + 1;
    
    // Regions capacity calculation
    const region = p.region || 'Unknown';
    const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
    regionsData[region] = (regionsData[region] || 0) + (isNaN(solarVal) ? 0 : solarVal);
  });
  
  // 1. Stage Distribution Pie Chart
  const stageLabels = Object.keys(stagesData);
  const stageSeries = Object.values(stagesData);
  
  const stageOptions = {
    series: stageSeries,
    chart: {
      type: 'donut',
      height: 250,
      background: 'transparent',
      foreColor: '#94a3b8'
    },
    labels: stageLabels,
    theme: {
      mode: 'dark',
      palette: 'palette1'
    },
    colors: ['#0ea5e9', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      fontSize: '11px',
      fontFamily: 'Inter, sans-serif'
    },
    stroke: {
      show: true,
      colors: ['#1e293b'],
      width: 2
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: '#f8fafc',
              fontSize: '14px',
              fontFamily: 'Outfit, sans-serif',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    }
  };
  
  if (state.charts.stages) {
    state.charts.stages.updateOptions(stageOptions);
  } else if (document.getElementById('chart-stages')) {
    state.charts.stages = new ApexCharts(document.getElementById('chart-stages'), stageOptions);
    state.charts.stages.render();
  }
  
  // 2. Capacity by Region Bar Chart
  const regionLabels = Object.keys(regionsData);
  const regionSeries = Object.values(regionsData).map(v => Math.round(v * 100) / 100);
  
  const regionOptions = {
    series: [{
      name: 'Capacity (kWp)',
      data: regionSeries
    }],
    chart: {
      type: 'bar',
      height: 250,
      background: 'transparent',
      foreColor: '#94a3b8',
      toolbar: { show: false }
    },
    colors: ['#0ea5e9'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '45%'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: regionLabels,
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Solar capacity (kWp)',
        style: {
          color: '#94a3b8',
          fontSize: '12px',
          fontFamily: 'Outfit, sans-serif'
        }
      }
    },
    fill: {
      opacity: 0.85
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return val + " kWp";
        }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 4
    }
  };
  
  if (state.charts.regions) {
    state.charts.regions.updateOptions(regionOptions);
  } else if (document.getElementById('chart-regions')) {
    state.charts.regions = new ApexCharts(document.getElementById('chart-regions'), regionOptions);
    state.charts.regions.render();
  }
}

// Add/Edit Project Form Actions
let formDeliverables = [];

// Opens Modal to Add/Edit project
function openEditModal(projectId = '') {
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('project-form');
  
  form.reset();
  formDeliverables = [];
  
  // Set basic tab active
  document.querySelectorAll('.form-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('[data-form-tab="basic-info"]').classList.add('active');
  document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('form-tab-basic-info').classList.add('active');
  
  if (projectId) {
    // Editing Mode
    title.innerText = 'Edit Project Profile';
    const project = state.projects.find(p => p.id === projectId);
    
    if (project) {
      document.getElementById('form-project-id').value = project.id;
      document.getElementById('form-code').value = project["Project code"] || '';
      document.getElementById('form-name').value = project.name || '';
      document.getElementById('form-region').value = project.region || '';
      document.getElementById('form-engineer').value = project.engineer || '';
      document.getElementById('form-engineer-id').value = project["id engineer"] || '';
      document.getElementById('form-business-type').value = project.businessType || 'EPC';
      document.getElementById('form-investor').value = project.investor || '';
      document.getElementById('form-client').value = project.client || '';
      
      const solarCapacity = parseFloat(project["Solar capacity (kWp) "] || project["Solar capacity (kWp)"] || 0);
      const bessCapacity = parseFloat(project["BESS capacity (kWh)"] || project["BESS capacity"] || 0);
      document.getElementById('form-solar-capacity').value = solarCapacity;
      document.getElementById('form-bess-capacity').value = bessCapacity;
      
      document.getElementById('form-systems').value = project.systems || '';
      document.getElementById('form-lat').value = project.lat || '';
      document.getElementById('form-lng').value = project.lng || '';
      document.getElementById('form-maps-link').value = project.googleMapsLink || '';
      document.getElementById('form-image').value = project.image || '';
      
      document.getElementById('form-status').value = project.status || 'Standby';
      document.getElementById('form-stage').value = project.stage || 'Underdevelop';
      document.getElementById('form-deadline').value = project.deadline || '';
      document.getElementById('form-construction-date').value = project.constructionDate || '';
      document.getElementById('form-cod-date').value = project.codDate || '';
      document.getElementById('form-pr-test').value = project.prTest || '';
      document.getElementById('form-pv').value = project.pv || '';
      document.getElementById('form-inverter').value = project.inverter || '';
      document.getElementById('form-award-note').value = project.awardNote || '';
      document.getElementById('form-revisions').value = project.revisions || '';
      document.getElementById('form-notes').value = project.notes || '';
      
      // Load deliverables list
      if (project.deliverables) {
        try {
          formDeliverables = typeof project.deliverables === 'string' ? JSON.parse(project.deliverables) : project.deliverables;
        } catch (e) {
          formDeliverables = [];
        }
      }
    }
  } else {
    // Add Mode
    title.innerText = 'Add New Project Profile';
    document.getElementById('form-project-id').value = '';
    // Auto-generate project code/ID if we want.
    // Set standard deliverables checklist automatically for new projects
    formDeliverables = [
      { name: "Survey Reports", hours: 4, checked: false },
      { name: "PV Layout", hours: 4, checked: false },
      { name: "Single Line Diagram", hours: 4, checked: false },
      { name: "PVSyst Simulation", hours: 4, checked: false },
      { name: "Bill of Quantities (BOQ)", hours: 4, checked: false },
      { name: "Load Profile Analysis", hours: 4, checked: false }
    ];
  }
  
  renderFormDeliverables();
  modal.classList.add('show');
}

// Renders the deliverables checklist inside edit modal
function renderFormDeliverables() {
  const container = document.getElementById('form-deliverables-list');
  container.innerHTML = '';
  
  if (!Array.isArray(formDeliverables) || formDeliverables.length === 0) {
    container.innerHTML = '<div class="text-center py-4 text-muted">No deliverables defined. Click "Add Item" to add one.</div>';
    return;
  }
  
  formDeliverables.forEach((item, index) => {
    const checkedAttr = item.checked ? 'checked' : '';
    const row = document.createElement('div');
    row.className = 'deliverable-form-row';
    row.innerHTML = `
      <div class="col-status">
        <input type="checkbox" ${checkedAttr} onchange="updateFormDeliverableStatus(${index}, this.checked)">
      </div>
      <div class="col-name">
        <input type="text" value="${item.name || ''}" placeholder="Deliverable name" onchange="updateFormDeliverableName(${index}, this.value)">
      </div>
      <div class="col-hours">
        <input type="number" value="${item.hours || 0}" min="0" onchange="updateFormDeliverableHours(${index}, this.value)">
      </div>
      <div class="col-action">
        <button type="button" class="btn-delete-row" onclick="removeFormDeliverable(${index})" title="Delete item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

function updateFormDeliverableStatus(index, isChecked) {
  if (formDeliverables[index]) formDeliverables[index].checked = isChecked;
}

function updateFormDeliverableName(index, val) {
  if (formDeliverables[index]) formDeliverables[index].name = val;
}

function updateFormDeliverableHours(index, val) {
  if (formDeliverables[index]) formDeliverables[index].hours = parseInt(val, 10) || 0;
}

function removeFormDeliverable(index) {
  formDeliverables.splice(index, 1);
  renderFormDeliverables();
}

// Event bindings & triggers
function setupEventListeners() {
  // Modal Closes
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
  
  // Submit project form
  document.getElementById('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveProjectForm();
  });
  
  // Add Deliverable row
  document.getElementById('btn-add-deliverable').addEventListener('click', () => {
    formDeliverables.push({ name: '', hours: 0, checked: false });
    renderFormDeliverables();
    // Scroll to bottom of list
    const container = document.getElementById('form-deliverables-list');
    container.scrollTop = container.scrollHeight;
  });
  
  // Delete project cancel & confirm
  document.getElementById('btn-close-delete-modal').addEventListener('click', closeDeleteModal);
  document.getElementById('btn-cancel-delete').addEventListener('click', closeDeleteModal);
  document.getElementById('btn-confirm-delete').addEventListener('click', executeDeleteProject);
  
  // Sync button
  document.getElementById('btn-sync').addEventListener('click', syncData);
  
  // Add project buttons
  document.getElementById('btn-add-project-sidebar').addEventListener('click', () => openEditModal());
}

// Closes modal
function closeModal() {
  document.getElementById('project-modal').classList.remove('show');
}

// Collects form inputs and saves project to sheet (or simulated database)
function saveProjectForm() {
  const saveBtn = document.getElementById('btn-save-project');
  saveBtn.disabled = true;
  saveBtn.innerText = 'Saving...';
  
  // Prepare project object
  const projectId = document.getElementById('form-project-id').value;
  
  // Ensure we serialize deliverables list as clean JSON string
  const cleanDeliverables = formDeliverables.filter(d => d.name.trim() !== '');
  
  const projectData = {
    "id": projectId,
    "Project code": document.getElementById('form-code').value.trim(),
    "name": document.getElementById('form-name').value.trim(),
    "region": document.getElementById('form-region').value,
    "engineer": document.getElementById('form-engineer').value.trim(),
    "id engineer": document.getElementById('form-engineer-id').value.trim(),
    "businessType": document.getElementById('form-business-type').value,
    "investor": document.getElementById('form-investor').value.trim(),
    "client": document.getElementById('form-client').value.trim(),
    "Solar capacity (kWp) ": parseFloat(document.getElementById('form-solar-capacity').value) || 0,
    "BESS capacity (kWh)": parseFloat(document.getElementById('form-bess-capacity').value) || 0,
    "systems": document.getElementById('form-systems').value.trim(),
    "lat": parseFloat(document.getElementById('form-lat').value) || 0,
    "lng": parseFloat(document.getElementById('form-lng').value) || 0,
    "googleMapsLink": document.getElementById('form-maps-link').value.trim(),
    "image": document.getElementById('form-image').value.trim(),
    "deliverables": JSON.stringify(cleanDeliverables),
    "status": document.getElementById('form-status').value,
    "stage": document.getElementById('form-stage').value,
    "deadline": document.getElementById('form-deadline').value,
    "constructionDate": document.getElementById('form-construction-date').value,
    "codDate": document.getElementById('form-cod-date').value,
    "prTest": document.getElementById('form-pr-test').value.trim(),
    "pv": document.getElementById('form-pv').value.trim(),
    "inverter": document.getElementById('form-inverter').value.trim(),
    "awardNote": document.getElementById('form-award-note').value.trim(),
    "revisions": document.getElementById('form-revisions').value.trim(),
    "notes": document.getElementById('form-notes').value.trim()
  };
  
  if (isGAS()) {
    google.script.run
      .withSuccessHandler((response) => {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Save Project';
        
        if (response.status === 'success') {
          showToast('success', 'Project details saved to Google Sheets successfully.');
          closeModal();
          // Reload state
          syncData();
        } else {
          showToast('error', 'Failed to save: ' + response.message);
          console.error(response);
        }
      })
      .withFailureHandler((error) => {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Save Project';
        showToast('error', 'Server Error: ' + error.toString());
      })
      .saveProject(projectData);
  } else {
    // Local Simulation
    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Save Project';
      
      if (projectId) {
        // Edit existing
        const idx = state.projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
          state.projects[idx] = projectData;
        }
      } else {
        // Add new (generate local ID)
        const ids = state.projects.map(p => {
          const m = p.id.match(/^P-(\d+)$/i);
          return m ? parseInt(m[1], 10) : 0;
        });
        const max = ids.length > 0 ? Math.max(...ids) : 0;
        const nextId = "P-" + ("000" + (max + 1)).slice(-3);
        projectData.id = nextId;
        state.projects.push(projectData);
      }
      
      showToast('success', 'Project details saved locally.');
      closeModal();
      processAndRender();
    }, 600);
  }
}

// Delete Project Triggering
let projectToDeleteId = '';

function triggerDeleteProject(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  projectToDeleteId = projectId;
  document.getElementById('delete-project-code').innerText = project["Project code"] || project.id;
  document.getElementById('delete-project-name').innerText = project.name || 'Unnamed Project';
  document.getElementById('delete-modal').classList.add('show');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('show');
  projectToDeleteId = '';
}

function executeDeleteProject() {
  const delBtn = document.getElementById('btn-confirm-delete');
  delBtn.disabled = true;
  delBtn.innerText = 'Deleting...';
  
  if (isGAS()) {
    google.script.run
      .withSuccessHandler((response) => {
        delBtn.disabled = false;
        delBtn.innerText = 'Delete Project';
        
        if (response.status === 'success') {
          showToast('success', 'Project row removed from Google Sheets.');
          closeDeleteModal();
          syncData();
        } else {
          showToast('error', 'Delete failed: ' + response.message);
          console.error(response);
        }
      })
      .withFailureHandler((error) => {
        delBtn.disabled = false;
        delBtn.innerText = 'Delete Project';
        showToast('error', 'Server error: ' + error.toString());
      })
      .deleteProject(projectToDeleteId);
  } else {
    // Local simulation
    setTimeout(() => {
      delBtn.disabled = false;
      delBtn.innerText = 'Delete Project';
      
      state.projects = state.projects.filter(p => p.id !== projectToDeleteId);
      showToast('success', 'Project deleted locally.');
      closeDeleteModal();
      processAndRender();
    }, 500);
  }
}

// Setup Filters binding logic
function setupFilters() {
  // Global search
  document.getElementById('global-search').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderAll();
  });
  
  // Dropdowns
  document.getElementById('filter-region').addEventListener('change', (e) => {
    state.filters.region = e.target.value;
    renderAll();
  });
  
  document.getElementById('filter-status').addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    renderAll();
  });
  
  document.getElementById('filter-engineer').addEventListener('change', (e) => {
    state.filters.engineer = e.target.value;
    renderAll();
  });
  
  // Card/Table View Toggles
  const gridToggle = document.getElementById('view-grid-toggle');
  const tableToggle = document.getElementById('view-table-toggle');
  
  gridToggle.addEventListener('click', () => {
    gridToggle.classList.add('active');
    tableToggle.classList.remove('active');
    state.viewMode = 'grid';
    renderAll();
  });
  
  tableToggle.addEventListener('click', () => {
    tableToggle.classList.add('active');
    gridToggle.classList.remove('active');
    state.viewMode = 'table';
    renderAll();
  });
}

// Setup Form Tabs sliding/toggling inside Modal
function setupFormTabs() {
  const tabs = document.querySelectorAll('.form-tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      
      const tabContentId = btn.getAttribute('data-form-tab');
      document.querySelectorAll('.form-tab-content').forEach(c => {
        c.classList.remove('active');
      });
      document.getElementById(`form-tab-${tabContentId}`).classList.add('active');
    });
  });
}

// Toast Notifications Helper
function showToast(type, message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-circle-info';
  if (type === 'success') iconClass = 'fa-circle-check';
  else if (type === 'error') iconClass = 'fa-circle-xmark';
  else if (type === 'warning') iconClass = 'fa-triangle-exclamation';
  
  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <div class="toast-message">${message}</div>
  `;
  
  container.appendChild(toast);
  
  // Remove toast after 4s
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Numbers Formatter
function formatNumber(num) {
  if (isNaN(num)) return '0';
  if (num >= 1000) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  return num.toFixed(1);
}
