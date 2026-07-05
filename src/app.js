/**
 * SolarTrack Dashboard Frontend Logic
 * Supports Real-time Google Apps Script execution and local mockup fallback
 */

// Global State
const state = {
  projects: [],
  filters: {
    search: '',
    portfolio: {
      region: 'All',
      engineer: 'All'
    },
    underdevelopment: {
      region: 'All',
      status: 'All',
      engineer: 'All'
    }
  },
  activeTab: 'overview',
  viewModes: {
    portfolio: 'grid',
    underdevelopment: 'grid'
  },
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
    "systems": '[{"type":"Carpark","capacity":0.0018}]',
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
    "revisions": "",
    "priceUpdates": '[{"bWp":15.76,"bath":15760000.00,"fx":32.30,"pvPrice":0.11}]'
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
    "systems": '[{"type":"Rooftop","capacity":0.005},{"type":"BESS","capacity":0.001}]',
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
    "revisions": "",
    "priceUpdates": '[]'
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
    "systems": '[{"type":"Farm","capacity":0.0085}]',
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
    "revisions": "",
    "priceUpdates": '[]'
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
    "systems": '[{"type":"Floating","capacity":0.0125},{"type":"Carpark","capacity":0.005}]',
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
    "revisions": "",
    "priceUpdates": '[]'
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
    "systems": '[{"type":"Rooftop","capacity":5.0},{"type":"BESS","capacity":3.0}]',
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
    "revisions": "",
    "priceUpdates": '[]'
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
    "systems": '[{"type":"Floating","capacity":1.0}]',
    "Solar capacity (kWp)": 1000,
    "BESS capacity (kWh)": 0,
    "lat": 18.785,
    "lng": 98.9823,
    "googleMapsLink": "",
    "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=60",
    "deliverables": '[]',
    "notes": "Pending environmental impact report.",
    "status": "Completed",
    "stage": "COD",
    "deadline": "2026-06-29",
    "constructionDate": "",
    "codDate": "",
    "prTest": "",
    "pv": "",
    "inverter": "",
    "awardNote": "",
    "revisions": "",
    "priceUpdates": '[]'
  }
];

// Determine if we are running in Google Apps Script environment
function isGAS() {
  return typeof google !== 'undefined' && typeof google.script !== 'undefined';
}

// Escape HTML utility to prevent XSS in dynamic DOM mapping
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupFilters();
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
        setTimeout(refreshOverviewTabWidgets, 100);
      } else if (tabName === 'portfolio') {
        pageTitle.innerText = 'Portfolio (Awarded Projects)';
        pageSubtitle.innerText = 'Manage and filter successfully awarded and COD projects';
        renderAll();
      } else if (tabName === 'underdevelopment') {
        pageTitle.innerText = 'Project Overview (Underdevelopment)';
        pageSubtitle.innerText = 'Track and update projects currently under development';
        renderAll();
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
  updateAutocompleteDatalist();
  updateFiltersDropdowns();
  renderAll();
}

// Populate datalist with existing project names for search autocomplete suggestions
function updateAutocompleteDatalist() {
  const datalist = document.getElementById('project-names-datalist');
  if (!datalist) return;
  
  const names = new Set();
  state.projects.forEach(p => {
    if (p.name) names.add(p.name);
  });
  
  let html = '';
  Array.from(names).sort().forEach(name => {
    html += `<option value="${escapeHtml(name)}">`;
  });
  
  datalist.innerHTML = html;
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
  // Update general KPI metrics from all projects
  const totalProjects = state.projects.length;
  let totalSolar = 0;
  let totalBess = 0;
  let totalProgressPercentSum = 0;
  let progressCount = 0;
  
  state.projects.forEach(p => {
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
  
  // Render overview charts & overview maps
  initOverviewMap();
  renderCharts();
  
  // Render Portfolio and Underdevelopment Tabs
  if (state.activeTab === 'portfolio') {
    const portfolioFiltered = getFilteredPortfolioProjects();
    renderTabContent('portfolio', portfolioFiltered);
  } else if (state.activeTab === 'underdevelopment') {
    const underdevFiltered = getFilteredUnderdevelopmentProjects();
    renderTabContent('underdevelopment', underdevFiltered);
  } else if (state.activeTab === 'map-view') {
    initFullScreenMap();
  }
}

// Check if a project is categorized as Portfolio (Awarded)
function isPortfolioProject(p) {
  return p.stage === 'COD' || p.status === 'Completed' || p.status === 'Complete';
}

// Get filtered Portfolio projects list
function getFilteredPortfolioProjects() {
  const query = state.filters.search.toLowerCase().trim();
  const region = state.filters.portfolio.region;
  const engineer = state.filters.portfolio.engineer;
  
  return state.projects.filter(p => {
    if (!isPortfolioProject(p)) return false;
    
    // Search filter
    const matchesSearch = !query || 
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.id && p.id.toLowerCase().includes(query)) ||
      (p["Project code"] && p["Project code"].toLowerCase().includes(query)) ||
      (p.engineer && p.engineer.toLowerCase().includes(query)) ||
      (p.client && p.client.toLowerCase().includes(query));
      
    // Dropdowns
    const matchesRegion = region === 'All' || p.region === region;
    const matchesEngineer = engineer === 'All' || p.engineer === engineer;
    
    return matchesSearch && matchesRegion && matchesEngineer;
  });
}

// Get filtered Underdevelopment projects list
function getFilteredUnderdevelopmentProjects() {
  const query = state.filters.search.toLowerCase().trim();
  const region = state.filters.underdevelopment.region;
  const status = state.filters.underdevelopment.status;
  const engineer = state.filters.underdevelopment.engineer;
  
  return state.projects.filter(p => {
    if (isPortfolioProject(p)) return false;
    
    // Search filter
    const matchesSearch = !query || 
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.id && p.id.toLowerCase().includes(query)) ||
      (p["Project code"] && p["Project code"].toLowerCase().includes(query)) ||
      (p.engineer && p.engineer.toLowerCase().includes(query)) ||
      (p.client && p.client.toLowerCase().includes(query));
      
    // Dropdowns
    const matchesRegion = region === 'All' || p.region === region;
    const matchesStatus = status === 'All' || p.status === status;
    const matchesEngineer = engineer === 'All' || p.engineer === engineer;
    
    return matchesSearch && matchesRegion && matchesStatus && matchesEngineer;
  });
}

// Generate unique filters for both dropdown tables
function updateFiltersDropdowns() {
  const regions = new Set();
  const engineers = new Set();
  
  state.projects.forEach(p => {
    if (p.region) regions.add(p.region);
    if (p.engineer) engineers.add(p.engineer);
  });
  
  const rSorted = Array.from(regions).sort();
  const engSorted = Array.from(engineers).sort();
  
  // Update Portfolio filters
  const portRegion = document.getElementById('portfolio-filter-region');
  const portEng = document.getElementById('portfolio-filter-engineer');
  
  const savedPortReg = state.filters.portfolio.region;
  const savedPortEng = state.filters.portfolio.engineer;
  
  portRegion.innerHTML = '<option value="All">All Regions</option>';
  portEng.innerHTML = '<option value="All">All Engineers</option>';
  
  rSorted.forEach(r => portRegion.innerHTML += `<option value="${r}">${r}</option>`);
  engSorted.forEach(e => portEng.innerHTML += `<option value="${e}">${e}</option>`);
  
  portRegion.value = rSorted.includes(savedPortReg) ? savedPortReg : 'All';
  portEng.value = engSorted.includes(savedPortEng) ? savedPortEng : 'All';
  
  // Update Underdevelopment filters
  const devRegion = document.getElementById('underdev-filter-region');
  const devEng = document.getElementById('underdev-filter-engineer');
  
  const savedDevReg = state.filters.underdevelopment.region;
  const savedDevEng = state.filters.underdevelopment.engineer;
  
  devRegion.innerHTML = '<option value="All">All Regions</option>';
  devEng.innerHTML = '<option value="All">All Engineers</option>';
  
  rSorted.forEach(r => devRegion.innerHTML += `<option value="${r}">${r}</option>`);
  engSorted.forEach(e => devEng.innerHTML += `<option value="${e}">${e}</option>`);
  
  devRegion.value = rSorted.includes(savedDevReg) ? savedDevReg : 'All';
  devEng.value = engSorted.includes(savedDevEng) ? savedDevEng : 'All';
}

// Render dynamic content for projects catalog (Portfolio or Underdev)
function renderTabContent(tabName, list) {
  const isPortfolio = tabName === 'portfolio';
  const containerId = isPortfolio ? 'portfolio-grid-container' : 'underdev-grid-container';
  const tableContainerId = isPortfolio ? 'portfolio-table-container' : 'underdev-table-container';
  const tableBodyId = isPortfolio ? 'portfolio-table-body' : 'underdev-table-body';
  const emptyStateId = isPortfolio ? 'portfolio-empty-state' : 'underdev-empty-state';
  
  const gridContainer = document.getElementById(containerId);
  const tableContainer = document.getElementById(tableContainerId);
  const tbody = document.getElementById(tableBodyId);
  const emptyState = document.getElementById(emptyStateId);
  
  const viewMode = state.viewModes[tabName];
  
  if (viewMode === 'grid') {
    gridContainer.classList.remove('d-none');
    tableContainer.classList.add('d-none');
  } else {
    gridContainer.classList.add('d-none');
    tableContainer.classList.remove('d-none');
  }
  
  if (list.length === 0) {
    gridContainer.innerHTML = '';
    tbody.innerHTML = '';
    emptyState.classList.remove('d-none');
    return;
  }
  
  emptyState.classList.add('d-none');
  
  // Render grid
  if (viewMode === 'grid') {
    let gridHtml = '';
    list.forEach(p => {
      const progress = calculateProgress(p.deliverables);
      const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
      const bessVal = parseFloat(p["BESS capacity (kWh)"] || p["BESS capacity"] || 0);
      
      let statusClass = 'badge-secondary';
      if (p.status === 'In Progress') statusClass = 'badge-info';
      else if (p.status === 'Standby') statusClass = 'badge-warning';
      else if (p.status === 'Completed' || p.status === 'Complete') statusClass = 'badge-success';
      
      const defaultImage = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=60';
      const bgImage = p.image || defaultImage;
      const initial = p.engineer ? p.engineer.charAt(0).toUpperCase() : '?';
      
      gridHtml += `
        <div class="project-card glass-panel animate-fade-in">
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
            <div class="engineer-badge" title="BD Engineer: ${p.engineer || 'Unassigned'}">
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
    gridContainer.innerHTML = gridHtml;
  } else {
    // Render table
    let tableHtml = '';
    list.forEach(p => {
      const progress = calculateProgress(p.deliverables);
      const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
      const bessVal = parseFloat(p["BESS capacity (kWh)"] || p["BESS capacity"] || 0);
      
      let statusClass = 'badge-secondary';
      if (p.status === 'In Progress') statusClass = 'badge-info';
      else if (p.status === 'Standby') statusClass = 'badge-warning';
      else if (p.status === 'Completed' || p.status === 'Complete') statusClass = 'badge-success';
      
      tableHtml += `
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
    tbody.innerHTML = tableHtml;
  }
}

// Initialize Overview Map
function initOverviewMap() {
  const mapElement = document.getElementById('overview-map');
  if (!mapElement) return;
  
  if (state.maps.overview) {
    state.mapMarkers.overview.forEach(m => state.maps.overview.removeLayer(m));
    state.mapMarkers.overview = [];
  } else {
    state.maps.overview = L.map('overview-map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([13.7367, 100.5231], 6);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(state.maps.overview);
  }
  
  plotMarkers(state.maps.overview, state.mapMarkers.overview);
}

// Initialize Full-Screen Map
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

// Plot Markers
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
          <div class="map-popup-title">${escapeHtml(p.name || 'Unnamed Project')}</div>
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
      
      // Determine marker color
      let markerColor = '#64748b';
      if (p.status === 'In Progress') markerColor = '#0ea5e9';
      else if (p.status === 'Completed' || p.status === 'Complete') markerColor = '#10b981';
      
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
  
  if (validLocationsCount > 0 && mapObj) {
    mapObj.fitBounds(bounds, { padding: [30, 30] });
  }
}

// Render ApexCharts
function renderCharts() {
  const stagesData = {};
  const regionsData = {};
  
  state.projects.forEach(p => {
    const stage = p.stage || 'Underdevelop';
    stagesData[stage] = (stagesData[stage] || 0) + 1;
    
    const region = p.region || 'Unknown';
    const solarVal = parseFloat(p["Solar capacity (kWp) "] || p["Solar capacity (kWp)"] || 0);
    regionsData[region] = (regionsData[region] || 0) + (isNaN(solarVal) ? 0 : solarVal);
  });
  
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

// Modal Form State & Dynamic lists
let formDeliverables = [];
let formSystems = [];
let formPriceUpdates = [];
let uploadedImageBase64 = '';

const STANDARD_SYSTEM_TYPES = ['Rooftop', 'Farm', 'Floating', 'Carpark', 'BESS'];

// Opens Modal
function openEditModal(projectId = '') {
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('project-form');
  
  form.reset();
  formDeliverables = [];
  formSystems = [];
  formPriceUpdates = [];
  uploadedImageBase64 = '';
  
  // Set default placeholder image state
  document.getElementById('form-image-preview').style.display = 'none';
  document.getElementById('form-image-placeholder').style.display = 'block';
  
  if (projectId) {
    // Editing Mode
    title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Project Details';
    const project = state.projects.find(p => p.id === projectId);
    
    if (project) {
      document.getElementById('form-project-id').value = project.id;
      document.getElementById('form-code').value = project["Project code"] || '';
      document.getElementById('form-name').value = project.name || '';
      document.getElementById('form-region').value = project.region || '';
      document.getElementById('form-engineer').value = project.engineer || 'Gung';
      document.getElementById('form-engineer-id').value = project["id engineer"] || 'M-001';
      document.getElementById('form-business-type').value = project.businessType || 'EPC';
      document.getElementById('form-investor').value = project.investor || 'GPSC';
      document.getElementById('form-client').value = project.client || '';
      
      // Coordinates mapping
      const latVal = parseFloat(project.lat);
      const lngVal = parseFloat(project.lng);
      document.getElementById('form-coordinates').value = (!isNaN(latVal) && !isNaN(lngVal) && latVal !== 0) ? `${latVal}, ${lngVal}` : '';
      
      document.getElementById('form-maps-link').value = project.googleMapsLink || '';
      document.getElementById('form-image-url').value = project.image || '';
      
      if (project.image) {
        document.getElementById('form-image-preview').src = project.image;
        document.getElementById('form-image-preview').style.display = 'block';
        document.getElementById('form-image-placeholder').style.display = 'none';
      }
      
      // Select Box mapping
      document.getElementById('form-status').value = (project.status === 'Completed' || project.status === 'Complete') ? 'Completed' : (project.status || 'Standby');
      document.getElementById('form-stage').value = project.stage || 'Underdevelop';
      document.getElementById('form-deadline').value = project.deadline || '';
      document.getElementById('form-notes').value = project.notes || '';
      
      // Parse systems array
      if (project.systems) {
        try {
          if (project.systems.trim().startsWith('[')) {
            formSystems = JSON.parse(project.systems);
          } else {
            // Comma separated fallback
            project.systems.split(',').forEach(s => {
              const type = s.trim();
              if (type) {
                let capacity = 0;
                if (type === 'BESS') {
                  capacity = (parseFloat(project['BESS capacity (kWh)']) || 0) / 1000;
                } else {
                  capacity = (parseFloat(project['Solar capacity (kWp) '] || project['Solar capacity (kWp)']) || 0) / 1000;
                }
                formSystems.push({ type, capacity });
              }
            });
          }
        } catch (e) {
          formSystems = [];
        }
      }
      
      // Parse deliverables
      if (project.deliverables) {
        try {
          formDeliverables = typeof project.deliverables === 'string' ? JSON.parse(project.deliverables) : project.deliverables;
        } catch (e) {
          formDeliverables = [];
        }
      }
      
      // Parse price updates
      if (project.priceUpdates) {
        try {
          formPriceUpdates = typeof project.priceUpdates === 'string' ? JSON.parse(project.priceUpdates) : project.priceUpdates;
        } catch (e) {
          formPriceUpdates = [];
        }
      }
    }
  } else {
    // Add Mode
    title.innerHTML = '<i class="fa-solid fa-plus"></i> Add New Project Profile';
    document.getElementById('form-project-id').value = '';
    document.getElementById('form-code').value = '';
    
    // Set standard deliverables
    formDeliverables = [
      { name: "Survey Reports", hours: 4, checked: false },
      { name: "PV Layout", hours: 4, checked: false },
      { name: "Single Line Diagram", hours: 4, checked: false },
      { name: "PVSyst Simulation", hours: 4, checked: false },
      { name: "Bill of Quantities (BOQ)", hours: 4, checked: false },
      { name: "Load Profile Analysis", hours: 4, checked: false }
    ];
  }
  
  renderFormSystems();
  renderFormDeliverables();
  renderFormPriceUpdates();
  
  modal.classList.add('show');
}

// Render systems checkboxes in modal form
function renderFormSystems() {
  const container = document.getElementById('form-systems-checkbox-list');
  container.innerHTML = '';
  
  // Form list standard + any custom ones parsed
  const activeTypes = formSystems.map(s => s.type);
  const typesToRender = [...STANDARD_SYSTEM_TYPES];
  
  formSystems.forEach(s => {
    if (!typesToRender.includes(s.type)) {
      typesToRender.push(s.type);
    }
  });
  
  typesToRender.forEach(type => {
    const isChecked = activeTypes.includes(type);
    const checkedAttr = isChecked ? 'checked' : '';
    const activeClass = isChecked ? 'active' : '';
    const systemData = formSystems.find(s => s.type === type);
    const capacityVal = systemData ? systemData.capacity : '';
    
    const row = document.createElement('div');
    row.className = `system-checkbox-row ${activeClass}`;
    row.innerHTML = `
      <input type="checkbox" id="system-check-${type}" class="system-checkbox" data-type="${type}" ${checkedAttr} onchange="toggleSystemCheckbox('${type}', this.checked)">
      <label for="system-check-${type}">${type}</label>
      <div class="system-capacity-wrapper">
        <input type="number" step="0.001" min="0" class="system-capacity-input" placeholder="0.0" value="${capacityVal}" oninput="updateSystemCapacity('${type}', this.value)">
        <span class="system-capacity-unit">MW</span>
      </div>
    `;
    container.appendChild(row);
  });
}

function toggleSystemCheckbox(type, isChecked) {
  const checkboxRow = document.getElementById(`system-check-${type}`).parentElement;
  if (isChecked) {
    checkboxRow.classList.add('active');
    const existing = formSystems.find(s => s.type === type);
    if (!existing) {
      formSystems.push({ type: type, capacity: 0 });
    }
  } else {
    checkboxRow.classList.remove('active');
    formSystems = formSystems.filter(s => s.type !== type);
  }
  
  // Checkboxes change will impact Solar capacity, recalculate prices
  recalculatePriceTableValues();
}

function updateSystemCapacity(type, value) {
  const numericVal = parseFloat(value) || 0;
  const systemData = formSystems.find(s => s.type === type);
  if (systemData) {
    systemData.capacity = numericVal;
  } else {
    formSystems.push({ type: type, capacity: numericVal });
  }
  
  recalculatePriceTableValues();
}

// Calculate on-the-fly Solar capacity in Watt-peak (Wp) for pricing calculations
function calculateFormSolarCapacityWp() {
  let solarCapacityMW = 0;
  formSystems.forEach(s => {
    if (s.type !== 'BESS') {
      solarCapacityMW += s.capacity;
    }
  });
  return solarCapacityMW * 1000 * 1000; // 1 MW = 1,000,000 Wp
}

// Re-computes all rows' Bath total price values based on current Solar Capacity
function recalculatePriceTableValues() {
  const capacityWp = calculateTotalSolarCapacityWpFromFormInputs();
  
  formPriceUpdates.forEach((row, idx) => {
    if (row.bWp > 0) {
      row.bath = row.bWp * capacityWp;
    }
  });
  
  renderFormPriceUpdates();
}

// Helper to sum current form system checkbox solar capacities
function calculateTotalSolarCapacityWpFromFormInputs() {
  let totalSolarMW = 0;
  const container = document.getElementById('form-systems-checkbox-list');
  if (!container) return 0;
  
  container.querySelectorAll('.system-checkbox-row').forEach(row => {
    const check = row.querySelector('.system-checkbox');
    const input = row.querySelector('.system-capacity-input');
    if (check && check.checked && check.dataset.type !== 'BESS') {
      totalSolarMW += parseFloat(input.value) || 0;
    }
  });
  return totalSolarMW * 1000 * 1000;
}

// Render deliverables checklist inside edit modal
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
        <input type="text" value="${escapeHtml(item.name || '')}" placeholder="Deliverable name" onchange="updateFormDeliverableName(${index}, this.value)">
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

// Renders the Price Updates Table inside edit modal
function renderFormPriceUpdates() {
  const tbody = document.getElementById('form-price-updates-body');
  tbody.innerHTML = '';
  
  if (!Array.isArray(formPriceUpdates) || formPriceUpdates.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">ไม่มีข้อมูลการอัพเดทราคา กดปุ่มเพื่อเพิ่มข้อมูล</td></tr>';
    return;
  }
  
  formPriceUpdates.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center; font-weight: 600;">${index + 1}</td>
      <td>
        <input type="number" step="0.01" class="price-bWp" placeholder="0.00" value="${row.bWp || ''}" oninput="updatePriceRowBWp(${index}, this.value)">
      </td>
      <td>
        <input type="number" step="1" class="price-bath" placeholder="0.00" value="${row.bath ? Math.round(row.bath) : ''}" oninput="updatePriceRowBath(${index}, this.value)">
      </td>
      <td>
        <input type="number" step="0.01" class="price-fx" placeholder="32.00" value="${row.fx || ''}" oninput="updatePriceRowFx(${index}, this.value)">
      </td>
      <td>
        <input type="number" step="0.01" class="price-pvPrice" placeholder="0.00" value="${row.pvPrice || ''}" oninput="updatePriceRowPV(${index}, this.value)">
      </td>
      <td class="col-action">
        <button type="button" class="btn-delete-row" onclick="removePriceRow(${index})" title="Delete row">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updatePriceRowBWp(index, val) {
  const numericBWp = parseFloat(val) || 0;
  formPriceUpdates[index].bWp = numericBWp;
  
  // Calculate Bath: bWp * capacityWp
  const capacityWp = calculateTotalSolarCapacityWpFromFormInputs();
  const calculatedBath = numericBWp * capacityWp;
  formPriceUpdates[index].bath = calculatedBath;
  
  // Update UI row input instantly
  const tr = document.getElementById('form-price-updates-body').children[index];
  if (tr) {
    tr.querySelector('.price-bath').value = calculatedBath ? Math.round(calculatedBath) : '';
  }
}

function updatePriceRowBath(index, val) {
  const numericBath = parseFloat(val) || 0;
  formPriceUpdates[index].bath = numericBath;
  
  // Calculate bWp: bath / capacityWp
  const capacityWp = calculateTotalSolarCapacityWpFromFormInputs();
  if (capacityWp > 0) {
    const calculatedBWp = numericBath / capacityWp;
    formPriceUpdates[index].bWp = Math.round(calculatedBWp * 100) / 100;
    
    // Update UI row input instantly
    const tr = document.getElementById('form-price-updates-body').children[index];
    if (tr) {
      tr.querySelector('.price-bWp').value = calculatedBWp.toFixed(2);
    }
  }
}

function updatePriceRowFx(index, val) {
  formPriceUpdates[index].fx = parseFloat(val) || 0;
}

function updatePriceRowPV(index, val) {
  formPriceUpdates[index].pvPrice = parseFloat(val) || 0;
}

function removePriceRow(index) {
  formPriceUpdates.splice(index, 1);
  renderFormPriceUpdates();
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
    const container = document.getElementById('form-deliverables-list');
    container.scrollTop = container.scrollHeight;
  });
  
  // Add System row
  document.getElementById('btn-add-system-type').addEventListener('click', () => {
    const newType = prompt("Enter new installation system type:");
    if (newType && newType.trim() !== "") {
      const formattedType = newType.trim();
      const existing = formSystems.find(s => s.type.toLowerCase() === formattedType.toLowerCase());
      if (!existing) {
        formSystems.push({ type: formattedType, capacity: 0 });
        renderFormSystems();
      } else {
        showToast('warning', 'This system type already exists.');
      }
    }
  });
  
  // Add Price Row
  document.getElementById('btn-add-price-row').addEventListener('click', () => {
    formPriceUpdates.push({ bWp: 0, bath: 0, fx: 0, pvPrice: 0 });
    renderFormPriceUpdates();
  });
  
  // File Upload image preview mapping
  const fileInput = document.getElementById('form-image-file');
  const urlInput = document.getElementById('form-image-url');
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedImageBase64 = event.target.result;
        
        // Show preview
        document.getElementById('form-image-preview').src = uploadedImageBase64;
        document.getElementById('form-image-preview').style.display = 'block';
        document.getElementById('form-image-placeholder').style.display = 'none';
        
        // Clear text field input
        urlInput.value = '';
      };
      reader.readAsDataURL(file);
    }
  });
  
  urlInput.addEventListener('input', (e) => {
    const urlVal = e.target.value.trim();
    if (urlVal) {
      uploadedImageBase64 = '';
      document.getElementById('form-image-preview').src = urlVal;
      document.getElementById('form-image-preview').style.display = 'block';
      document.getElementById('form-image-placeholder').style.display = 'none';
    } else {
      document.getElementById('form-image-preview').style.display = 'none';
      document.getElementById('form-image-placeholder').style.display = 'block';
    }
  });
  
  // Delete project modal events
  document.getElementById('btn-close-delete-modal').addEventListener('click', closeDeleteModal);
  document.getElementById('btn-cancel-delete').addEventListener('click', closeDeleteModal);
  document.getElementById('btn-confirm-delete').addEventListener('click', executeDeleteProject);
  
  // Sync refresh button
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
  
  // Clean lists
  const cleanDeliverables = formDeliverables.filter(d => d.name.trim() !== '');
  
  // Parse coordinates
  let lat = 0;
  let lng = 0;
  const coordVal = document.getElementById('form-coordinates').value.trim();
  if (coordVal) {
    const parts = coordVal.split(',');
    if (parts.length === 2) {
      lat = parseFloat(parts[0]) || 0;
      lng = parseFloat(parts[1]) || 0;
    }
  }
  
  // Calculate total capacities from checkbox selections
  let solarCapacitykWp = 0;
  let bessCapacitykWh = 0;
  const cleanSystems = [];
  
  const container = document.getElementById('form-systems-checkbox-list');
  container.querySelectorAll('.system-checkbox-row').forEach(row => {
    const checkbox = row.querySelector('.system-checkbox');
    const input = row.querySelector('.system-capacity-input');
    
    if (checkbox && checkbox.checked) {
      const type = checkbox.dataset.type;
      const capacityMW = parseFloat(input.value) || 0;
      cleanSystems.push({ type, capacity: capacityMW });
      
      if (type === 'BESS') {
        bessCapacitykWh += capacityMW * 1000;
      } else {
        solarCapacitykWp += capacityMW * 1000;
      }
    }
  });
  
  // BD Engineer and ID Engineer auto-mapping
  const engName = document.getElementById('form-engineer').value;
  let engId = 'M-001';
  if (engName === 'Hone') engId = 'M-002';
  else if (engName === 'Golf') engId = 'M-003';
  
  // Image URL selection
  let finalImage = document.getElementById('form-image-url').value.trim();
  if (uploadedImageBase64) {
    finalImage = uploadedImageBase64;
  }
  
  const projectData = {
    "id": projectId,
    "Project code": document.getElementById('form-code').value.trim(),
    "name": document.getElementById('form-name').value.trim(),
    "region": document.getElementById('form-region').value,
    "engineer": engName,
    "id engineer": engId,
    "businessType": document.getElementById('form-business-type').value,
    "investor": document.getElementById('form-investor').value,
    "client": document.getElementById('form-client').value.trim(),
    "Solar capacity (kWp) ": solarCapacitykWp,
    "Solar capacity (kWp)": solarCapacitykWp,
    "BESS capacity (kWh)": bessCapacitykWh,
    "systems": JSON.stringify(cleanSystems),
    "lat": lat,
    "lng": lng,
    "googleMapsLink": document.getElementById('form-maps-link').value.trim(),
    "image": finalImage,
    "deliverables": JSON.stringify(cleanDeliverables),
    "priceUpdates": JSON.stringify(formPriceUpdates),
    "status": document.getElementById('form-status').value,
    "stage": document.getElementById('form-stage').value,
    "deadline": document.getElementById('form-deadline').value,
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
        const idx = state.projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
          state.projects[idx] = projectData;
        }
      } else {
        const ids = state.projects.map(p => {
          const m = p.id.match(/^P-(\d+)$/i);
          return m ? parseInt(m[1], 10) : 0;
        });
        const max = ids.length > 0 ? Math.max(...ids) : 0;
        const nextId = "P-" + ("000" + (max + 1)).slice(-3);
        projectData.id = nextId;
        
        // Auto-generate project code for mockup local testing
        projectData["Project code"] = "G26-" + ("000" + (max + 1)).slice(-3);
        state.projects.push(projectData);
      }
      
      showToast('success', 'Project details saved locally.');
      closeModal();
      processAndRender();
    }, 600);
  }
}

// Delete Project
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

// Setup Filters
function setupFilters() {
  // Global search datalist mapping
  document.getElementById('global-search').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderAll();
  });
  
  // Portfolio tab region and engineer filters
  document.getElementById('portfolio-filter-region').addEventListener('change', (e) => {
    state.filters.portfolio.region = e.target.value;
    renderAll();
  });
  document.getElementById('portfolio-filter-engineer').addEventListener('change', (e) => {
    state.filters.portfolio.engineer = e.target.value;
    renderAll();
  });
  
  // Underdevelopment tab region, status, and engineer filters
  document.getElementById('underdev-filter-region').addEventListener('change', (e) => {
    state.filters.underdevelopment.region = e.target.value;
    renderAll();
  });
  document.getElementById('underdev-filter-status').addEventListener('change', (e) => {
    state.filters.underdevelopment.status = e.target.value;
    renderAll();
  });
  document.getElementById('underdev-filter-engineer').addEventListener('change', (e) => {
    state.filters.underdevelopment.engineer = e.target.value;
    renderAll();
  });
  
  // Set view toggles
  document.querySelectorAll('.grid-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.targetTab;
      state.viewModes[tab] = 'grid';
      
      // Toggle active visual classes
      const parent = btn.parentElement;
      parent.querySelector('.grid-view-btn').classList.add('active');
      parent.querySelector('.table-view-btn').classList.remove('active');
      
      renderAll();
    });
  });
  
  document.querySelectorAll('.table-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.targetTab;
      state.viewModes[tab] = 'table';
      
      const parent = btn.parentElement;
      parent.querySelector('.table-view-btn').classList.add('active');
      parent.querySelector('.grid-view-btn').classList.remove('active');
      
      renderAll();
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
