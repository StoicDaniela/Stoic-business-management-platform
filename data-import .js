// =================================
// DATA IMPORT SYSTEM
// =================================

// Import functionality for business platform

// 1. CLIENT IMPORT FUNCTIONS
function triggerFileInput(inputId) {
    document.getElementById(inputId).click();
}

function handleClientImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('Importing client data from:', file.name);
    
    // Show progress
    showProgress('clientsProgress');
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
        importClientsFromCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
        alert('Excel files require additional library. Please convert to CSV format and try again.');
        hideProgress('clientsProgress');
    } else {
        alert('Unsupported file format. Please use CSV or Excel files.');
        hideProgress('clientsProgress');
    }
}

function importClientsFromCSV(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const csvData = e.target.result;
            const lines = csvData.split('\n');
            
            if (lines.length < 2) {
                throw new Error('File must contain at least a header row and one data row.');
            }
            
            // Parse CSV
            const headers = parseCSVLine(lines[0]);
            const importedClients = [];
            
            // Expected headers mapping
            const headerMap = {
                'name': ['name', 'client name', 'full name'],
                'email': ['email', 'email address', 'e-mail'],
                'phone': ['phone', 'phone number', 'telephone'],
                'company': ['company', 'company name', 'organization'],
                'goals': ['goals', 'objectives', 'targets'],
                'painPoints': ['pain points', 'painpoints', 'challenges', 'problems'],
                'budget': ['budget', 'budget range', 'price range'],
                'timeline': ['timeline', 'timeframe', 'schedule'],
                'personality': ['personality', 'personality type', 'character'],
                'meetingPrep': ['meeting prep', 'preparation', 'meeting preparation'],
                'currentStatus': ['current status', 'status', 'project status'],
                'nextActions': ['next actions', 'next steps', 'actions'],
                'projectType': ['project type', 'type', 'service type'],
                'projectPhase': ['project phase', 'phase', 'stage']
            };
            
            // Map headers to expected fields
            const fieldMapping = {};
            headers.forEach((header, index) => {
                const normalizedHeader = header.toLowerCase().trim();
                Object.keys(headerMap).forEach(field => {
                    if (headerMap[field].includes(normalizedHeader)) {
                        fieldMapping[field] = index;
                    }
                });
            });
            
            // Process data rows
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = parseCSVLine(line);
                
                const client = {
                    id: Date.now() + i, // Generate unique ID
                    name: getFieldValue(values, fieldMapping, 'name') || '',
                    email: getFieldValue(values, fieldMapping, 'email') || '',
                    phone: getFieldValue(values, fieldMapping, 'phone') || '',
                    company: getFieldValue(values, fieldMapping, 'company') || '',
                    goals: getFieldValue(values, fieldMapping, 'goals') || '',
                    painPoints: getFieldValue(values, fieldMapping, 'painPoints') || '',
                    budget: getFieldValue(values, fieldMapping, 'budget') || '',
                    timeline: getFieldValue(values, fieldMapping, 'timeline') || '',
                    personality: getFieldValue(values, fieldMapping, 'personality') || '',
                    meetingPrep: getFieldValue(values, fieldMapping, 'meetingPrep') || '',
                    currentStatus: getFieldValue(values, fieldMapping, 'currentStatus') || '',
                    nextActions: getFieldValue(values, fieldMapping, 'nextActions') || '',
                    projectType: getFieldValue(values, fieldMapping, 'projectType') || '',
                    projectPhase: getFieldValue(values, fieldMapping, 'projectPhase') || '',
                    createdAt: new Date().toISOString().split('T')[0]
                };
                
                // Validate required fields
                if (client.name && client.email) {
                    importedClients.push(client);
                }
            }
            
            // Update progress to 100%
            updateProgress('clientsProgressFill', 100);
            
            setTimeout(() => {
                // Add to existing clients data
                clientsData.push(...importedClients);
                
                hideProgress('clientsProgress');
                showImportResults('clientsImportCard', `Successfully imported ${importedClients.length} clients!`, 'success');
                
                // Refresh client profiles if we're on that page
                if (typeof loadClientProfiles === 'function') {
                    loadClientProfiles();
                }
                
            }, 500);
            
        } catch (error) {
            console.error('Import error:', error);
            hideProgress('clientsProgress');
            showImportResults('clientsImportCard', `Import failed: ${error.message}`, 'error');
        }
    };
    
    reader.readAsText(file);
}

// 2. MEETING IMPORT FUNCTIONS
function handleMeetingImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('Importing meeting data from:', file.name);
    
    showProgress('meetingsProgress');
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'ics') {
        importMeetingsFromICal(file);
    } else if (fileExtension === 'csv') {
        importMeetingsFromCSV(file);
    } else {
        alert('Unsupported file format. Please use iCal (.ics) or CSV files.');
        hideProgress('meetingsProgress');
    }
}

function importMeetingsFromCSV(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const csvData = e.target.result;
            const lines = csvData.split('\n');
            const headers = parseCSVLine(lines[0]);
            const importedMeetings = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = parseCSVLine(line);
                
                const meeting = {
                    id: Date.now() + i,
                    date: values[0] || '',
                    time: values[1] || '',
                    clientName: values[2] || '',
                    type: values[3] || 'consultation',
                    location: values[4] || 'Office',
                    agenda: values[5] || '',
                    status: 'scheduled',
                    duration: 60
                };
                
                if (meeting.date && meeting.clientName) {
                    importedMeetings.push(meeting);
                }
            }
            
            updateProgress('meetingsProgressFill', 100);
            
            setTimeout(() => {
                meetingsData.push(...importedMeetings);
                hideProgress('meetingsProgress');
                showImportResults('meetingsImportCard', `Successfully imported ${importedMeetings.length} meetings!`, 'success');
            }, 500);
            
        } catch (error) {
            hideProgress('meetingsProgress');
            showImportResults('meetingsImportCard', `Import failed: ${error.message}`, 'error');
        }
    };
    
    reader.readAsText(file);
}

// 3. BACKUP RESTORE FUNCTION
function handleBackupRestore(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('Restoring from backup:', file.name);
    
    showProgress('backupProgress');
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            // Validate backup structure
            if (!backupData.data || !backupData.version) {
                throw new Error('Invalid backup file format.');
            }
            
            updateProgress('backupProgressFill', 50);
            
            setTimeout(() => {
                // Restore data
                if (backupData.data.clients) {
                    clientsData.length = 0; // Clear existing
                    clientsData.push(...backupData.data.clients);
                }
                
                if (backupData.data.meetings) {
                    meetingsData.length = 0; // Clear existing
                    meetingsData.push(...backupData.data.meetings);
                }
                
                if (backupData.data.projects) {
                    projectsData.length = 0; // Clear existing
                    projectsData.push(...backupData.data.projects);
                }
                
                updateProgress('backupProgressFill', 100);
                
                setTimeout(() => {
                    hideProgress('backupProgress');
                    showImportResults('backupImportCard', 'Backup restored successfully! Please refresh the page.', 'success');
                    
                    // Refresh page after 3 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }, 500);
                
            }, 1000);
            
        } catch (error) {
            hideProgress('backupProgress');
            showImportResults('backupImportCard', `Restore failed: ${error.message}`, 'error');
        }
    };
    
    reader.readAsText(file);
}

// TEMPLATE DOWNLOAD FUNCTIONS
function downloadClientTemplate() {
    const templateData = [
        ['Name', 'Email', 'Phone', 'Company', 'Goals', 'Pain Points', 'Budget', 'Timeline', 'Personality', 'Meeting Prep', 'Current Status', 'Next Actions', 'Project Type', 'Project Phase'],
        ['John Doe', 'john@example.com', '+359 888 123 456', 'Example Corp', 'Expand business operations', 'Limited capital', '100k-500k', 'normal', 'Detail-oriented', 'Always prepare financial reports', 'Initial consultation', 'Schedule market analysis', 'business-plan', 'analysis'],
        ['Jane Smith', 'jane@company.bg', '+359 887 654 321', 'Tech Solutions', 'Launch new product', 'Technology risks', '500k-1m', 'urgent', 'Quick decision maker', 'Focus on technical advantages', 'Ready for investment', 'Prepare pitch deck', 'investment-evaluation', 'implementation']
    ];
    
    const csvContent = templateData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    downloadFile(csvContent, 'client-import-template.csv', 'text/csv');
}

function downloadMeetingTemplate() {
    const templateData = [
        ['Date', 'Time', 'Client Name', 'Meeting Type', 'Location', 'Agenda'],
        ['2025-10-25', '10:00', 'John Doe', 'consultation', 'Office', 'Initial business plan discussion'],
        ['2025-10-26', '14:00', 'Jane Smith', 'presentation', 'Zoom', 'Investment pitch presentation']
    ];
    
    const csvContent = templateData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    downloadFile(csvContent, 'meeting-import-template.csv', 'text/csv');
}

// UTILITY FUNCTIONS
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

function getFieldValue(values, mapping, field) {
    const index = mapping[field];
    return index !== undefined ? values[index] : '';
}

function showProgress(progressId) {
    document.getElementById(progressId).style.display = 'block';
    updateProgress(progressId.replace('Progress', 'ProgressFill'), 20);
}

function updateProgress(fillId, percentage) {
    const fillElement = document.getElementById(fillId);
    if (fillElement) {
        fillElement.style.width = percentage + '%';
    }
}

function hideProgress(progressId) {
    setTimeout(() => {
        document.getElementById(progressId).style.display = 'none';
        updateProgress(progressId.replace('Progress', 'ProgressFill'), 0);
    }, 1000);
}

function showImportResults(cardId, message, type) {
    const card = document.getElementById(cardId);
    
    // Remove existing results
    const existingResult = card.querySelector('.import-results');
    if (existingResult) {
        existingResult.remove();
    }
    
    // Add new result
    const resultDiv = document.createElement('div');
    resultDiv.className = `import-results import-${type}`;
    resultDiv.innerHTML = `<strong>${type === 'success' ? 'Success!' : 'Error!'}</strong> ${message}`;
    
    card.appendChild(resultDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (resultDiv.parentElement) {
            resultDiv.remove();
        }
    }, 5000);
}

// Drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
    const importCards = document.querySelectorAll('.import-card');
    
    importCards.forEach(card => {
        card.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        card.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        card.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const cardId = this.id;
                
                if (cardId === 'clientsImportCard') {
                    handleClientImport({ target: { files: [files[0]] } });
                } else if (cardId === 'meetingsImportCard') {
                    handleMeetingImport({ target: { files: [files[0]] } });
                } else if (cardId === 'backupImportCard') {
                    handleBackupRestore({ target: { files: [files[0]] } });
                }
            }
        });
    });
});

console.log('Data Import System loaded successfully! 📥');