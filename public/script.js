// API Discovery and UI Rendering
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch API metadata
    const response = await fetch('/api/_meta');
    const data = await response.json();
    
    // Update statistics
    const totalEl = document.querySelector('.dashboard-stats .stat-value:first-child');
    const categoriesEl = document.querySelector('.dashboard-stats .stat-value:last-child');
    
    if (totalEl) totalEl.textContent = data.total;
    if (categoriesEl) categoriesEl.textContent = data.categories.length;
    
    // Render categories
    const categoryGrid = document.getElementById('categoryList');
    if (categoryGrid) {
      categoryGrid.innerHTML = data.categories.map(cat => `
        <div class="category-card" data-category="${cat.name}">
          <h3>${cat.name}</h3>
          <div class="api-count">${cat.count}</div>
        </div>
      `).join('');
      
      // Add click handlers
      document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
          const category = card.dataset.category;
          document.querySelectorAll('.endpoint-card').forEach(el => {
            el.style.display = el.dataset.category === category ? '' : 'none';
          });
        });
      });
    }
    
    // Render endpoints
    const endpointList = document.getElementById('endpointList');
    if (endpointList) {
      endpointList.innerHTML = data.endpoints.map(ep => `
        <div class="endpoint-card" 
             data-category="${ep.category}"
             data-path="${ep.path}">
          <div class="endpoint-method ${ep.method.toLowerCase()}">${ep.method}</div>
          <div class="endpoint-info">
            <h3>${ep.name}</h3>
            <p>${ep.description}</p>
            <div class="endpoint-path">${ep.path}</div>
          </div>
          <div class="endpoint-category">${ep.category}</div>
        </div>
      `).join('');
      
      // Add click handlers
      document.querySelectorAll('.endpoint-card').forEach(card => {
        card.addEventListener('click', () => {
          const apiPath = card.dataset.path;
          window.location.href = `api-detail.html?path=${encodeURIComponent(apiPath)}`;
        });
      });
    }
    
    // Load API details if on detail page
    if (window.location.pathname.includes('api-detail.html')) {
      loadApiDetails();
    }
    
  } catch (error) {
    console.error('API Error:', error);
  }
});

// Load API details for documentation page
async function loadApiDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const apiPath = urlParams.get('path');
  
  if (!apiPath) return;
  
  try {
    const response = await fetch(`/api/_meta?path=${encodeURIComponent(apiPath)}`);
    const apiData = await response.json();
    
    // Update page elements
    document.getElementById('apiTitle').textContent = apiData.name;
    document.getElementById('apiDescription').textContent = apiData.description;
    document.getElementById('apiMethod').textContent = apiData.method;
    document.getElementById('apiCategory').textContent = apiData.category;
    document.getElementById('apiPath').textContent = apiData.path;
    
    // Render parameters
    const paramsList = document.getElementById('parametersList');
    if (paramsList && apiData.parameters) {
      paramsList.innerHTML = `
        <div class="param-header">
          <span>Parameter</span>
          <span>Type</span>
          <span>Required</span>
          <span>Description</span>
        </div>
        ${apiData.parameters.map(param => `
          <div class="param-row">
            <code>${param.name}</code>
            <span>${param.type}</span>
            <span>${param.required ? 'Yes' : 'No'}</span>
            <span>${param.description || ''}${param.default ? ` (default: ${param.default})` : ''}</span>
          </div>
        `).join('')}
      `;
    }
    
    // Render examples
    const exampleRequest = document.getElementById('exampleRequest');
    const exampleResponse = document.getElementById('exampleResponse');
    
    if (exampleRequest) {
      exampleRequest.textContent = typeof apiData.exampleRequest === 'string' 
        ? apiData.exampleRequest
        : JSON.stringify(apiData.exampleRequest, null, 2);
    }
    
    if (exampleResponse) {
      exampleResponse.textContent = JSON.stringify(apiData.exampleResponse, null, 2);
    }
    
    // Setup try it button
    document.getElementById('tryBtn')?.addEventListener('click', async () => {
      const paramInput = document.getElementById('paramInput').value;
      const resultArea = document.getElementById('apiResult');
      
      try {
        let url = apiData.path;
        if (apiData.method === 'GET') {
          url += `${url.includes('?') ? '&' : '?'}param=${encodeURIComponent(paramInput)}`;
        }
        
        const response = await fetch(url, {
          method: apiData.method,
          headers: apiData.method === 'POST' ? {
            'Content-Type': 'application/json'
          } : undefined,
          body: apiData.method === 'POST' 
            ? JSON.stringify({ param: paramInput }) 
            : undefined
        });
        
        const data = await response.json();
        resultArea.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        resultArea.textContent = `Error: ${error.message}`;
      }
    });
    
  } catch (error) {
    console.error('Failed to load API details:', error);
  }
              }
