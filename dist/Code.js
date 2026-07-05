/**
 * Google Apps Script Web App Server Backend
 * Project Dashboard Database Controller
 */

var SPREADSHEET_ID = "1oWbaz57b241i7KR9LI2jJvmLNGyLsEkPUrTmH4Irl1U";
var SHEET_GID = 1803614349;

/**
 * Serves the HTML file for the web app
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('Project Dashboard | SolarTrack')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper function to retrieve the active project sheet by GID or fall back
 */
function getProjectSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheets = ss.getSheets();
  var sheet = sheets.find(function(s) {
    return s.getSheetId() === SHEET_GID;
  });
  
  if (!sheet) {
    // Fallback if the sheet GID isn't found
    sheet = sheets[0];
  }
  return sheet;
}

/**
 * Fetches all project records from Google Sheets
 */
function getProjectsData() {
  try {
    var sheet = getProjectSheet();
    var values = sheet.getDataRange().getValues();
    
    if (values.length < 2) {
      return {
        status: "success",
        projects: [],
        headers: []
      };
    }
    
    // Normalize headers by trimming white spaces
    var headers = values[0].map(function(h) { 
      return h.toString().trim(); 
    });
    
    var projects = [];
    
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var project = {};
      var isEmpty = true;
      
      for (var j = 0; j < headers.length; j++) {
        var val = row[j];
        if (val !== "" && val !== null) {
          isEmpty = false;
        }
        
        // Serialize Dates properly to ISO format strings
        if (val instanceof Date) {
          // Keep local timezone date format yyyy-MM-dd
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
        }
        
        project[headers[j]] = val;
      }
      
      // Only add non-empty rows that have an ID
      if (!isEmpty && project.id) {
        projects.push(project);
      }
    }
    
    return {
      status: "success",
      projects: projects,
      headers: headers
    };
  } catch (error) {
    return {
      status: "error",
      message: error.toString()
    };
  }
}

/**
 * Saves a project (inserts if new, updates if exists)
 */
function saveProject(projectData) {
  try {
    var sheet = getProjectSheet();
    var values = sheet.getDataRange().getValues();
    var headers = values[0].map(function(h) { 
      return h.toString().trim(); 
    });
    
    var idIndex = headers.indexOf("id");
    if (idIndex === -1) {
      throw new Error("No column named 'id' was found in the sheet headers.");
    }
    
    var projectId = projectData.id ? projectData.id.toString().trim() : "";
    var foundRowIndex = -1;
    
    // Check if project already exists
    if (projectId) {
      for (var i = 1; i < values.length; i++) {
        if (values[i][idIndex].toString().trim() === projectId) {
          foundRowIndex = i + 1; // 1-indexed sheet row index
          break;
        }
      }
    }
    
    // If not found and ID is blank, auto-generate ID (P-XXX)
    if (foundRowIndex === -1 && !projectId) {
      var maxNum = 0;
      for (var i = 1; i < values.length; i++) {
        var currentId = values[i][idIndex].toString().trim();
        var match = currentId.match(/^P-(\d+)$/i);
        if (match) {
          var num = parseInt(match[1], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      }
      var nextNum = maxNum + 1;
      projectId = "P-" + ("000" + nextNum).slice(-3); // Pads to P-007, P-008, etc.
      projectData.id = projectId;
    }
    
    // Construct the row to write matching the exact headers in the spreadsheet
    var rowValues = [];
    for (var j = 0; j < headers.length; j++) {
      var headerName = headers[j];
      var val = projectData[headerName];
      
      if (val === undefined || val === null) {
        val = "";
      }
      
      // Parse numeric types for specific fields
      if (headerName === "Solar capacity (kWp) " || 
          headerName === "Solar capacity (kWp)" ||
          headerName === "BESS capacity (kWh)" || 
          headerName === "lat" || 
          headerName === "lng") {
        if (val !== "" && !isNaN(Number(val))) {
          val = Number(val);
        }
      }
      
      rowValues.push(val);
    }
    
    if (foundRowIndex !== -1) {
      // Update existing row
      sheet.getRange(foundRowIndex, 1, 1, headers.length).setValues([rowValues]);
    } else {
      // Append a new row to the sheet
      sheet.appendRow(rowValues);
    }
    
    return {
      status: "success",
      project: projectData
    };
  } catch (error) {
    return {
      status: "error",
      message: error.toString()
    };
  }
}

/**
 * Deletes a project by removing its row in the spreadsheet
 */
function deleteProject(projectId) {
  try {
    var sheet = getProjectSheet();
    var values = sheet.getDataRange().getValues();
    var headers = values[0].map(function(h) { 
      return h.toString().trim(); 
    });
    
    var idIndex = headers.indexOf("id");
    if (idIndex === -1) {
      throw new Error("No column named 'id' was found in the sheet headers.");
    }
    
    var foundRowIndex = -1;
    for (var i = 1; i < values.length; i++) {
      if (values[i][idIndex].toString().trim() === projectId) {
        foundRowIndex = i + 1;
        break;
      }
    }
    
    if (foundRowIndex !== -1) {
      sheet.deleteRow(foundRowIndex);
      return {
        status: "success",
        id: projectId
      };
    } else {
      throw new Error("Could not find project with ID: " + projectId);
    }
  } catch (error) {
    return {
      status: "error",
      message: error.toString()
    };
  }
}
