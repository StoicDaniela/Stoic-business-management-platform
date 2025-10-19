// =================================
// DATA EXPORT & BACKUP SYSTEM
// =================================

// Export functionality for business platform

// 1. CLIENT PROFILES EXPORT
function exportClientsToExcel() {
    console.log('Exporting clients to Excel...');
    
    // Prepare data for Excel format
    const excelData = [
        // Header row
        [
            'Client Name', 'Email', 'Phone', 'Company', 'Goals', 'Pain Points', 
            'Budget Range', 'Timeline', 'Personality', 'Meeting Prep', 
            'Current Status', 'Next Actions', 'Project Type', 'Project Phase', 'Created Date'
        ]
    ];
    
    // Add client data rows
    clientsData.forEach(client => {
        excelData.push([
            client.name || '',
            client.email || '',
            client.phone || '',
            client.company || '',
            client.goals || '',
            client.painPoints || '',
            client.budget || '',
            client.timeline || '',
            client.personality || '',
            client.meetingPrep || '',
            client.currentStatus || '',
            client.nextActions || '',
            client.projectType || '',
            client.projectPhase || '',
            client.createdAt || ''
        ]);
    });
    
    // Convert to CSV format
    const csvContent = excelData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    // Download file
    downloadFile(csvContent, 'client-profiles.csv', 'text/csv');
    
    showNotification('Client profiles exported successfully! 📊', 'success');
}

// 2. MEETINGS EXPORT
function exportMeetingsToCalendar() {
    console.log('Exporting meetings to calendar format...');
    
    // Create iCal format
    let icalContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Stoic11//Business Platform//EN\n';
    
    meetingsData.forEach(meeting => {
        const startDate = new Date(`${meeting.date}T${meeting.time}:00`);
        const endDate = new Date(startDate.getTime() + (meeting.duration || 60) * 60000);
        
        icalContent += 'BEGIN:VEVENT\n';
        icalContent += `UID:meeting-${meeting.id}@stoic11.com\n`;
        icalContent += `DTSTART:${formatDateForICal(startDate)}\n`;
        icalContent += `DTEND:${formatDateForICal(endDate)}\n`;
        icalContent += `SUMMARY:${meeting.type} - ${meeting.clientName}\n`;
        icalContent += `DESCRIPTION:${meeting.agenda || 'No agenda'}\n`;
        icalContent += `LOCATION:${meeting.location || 'TBD'}\n`;
        icalContent += 'END:VEVENT\n';
    });
    
    icalContent += 'END:VCALENDAR';
    
    // Download iCal file
    downloadFile(icalContent, 'meetings-calendar.ics', 'text/calendar');
    
    showNotification('Calendar exported successfully! 📅', 'success');
}

// 3. FULL DATA BACKUP
function exportFullBackup() {
    console.log('Creating full data backup...');
    
    const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        platform: 'Stoic11 Business Management',
        data: {
            clients: clientsData,
            meetings: meetingsData,
            projects: projectsData,
            settings: {
                lastBackup: new Date().toISOString(),
                totalClients: clientsData.length,
                totalMeetings: meetingsData.length
            }
        }
    };
    
    const jsonContent = JSON.stringify(backupData, null, 2);
    
    // Download backup file
    downloadFile(jsonContent, `stoic11-backup-${formatDateForFilename(new Date())}.json`, 'application/json');
    
    // Also save to localStorage for auto-backup
    localStorage.setItem('stoic11_last_backup', jsonContent);
    localStorage.setItem('stoic11_backup_date', new Date().toISOString());
    
    showNotification('Full backup created successfully! 💾', 'success');
}

// 4. PDF REPORTS GENERATION
function generateClientReport(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) {
        alert('Client not found!');
        return;
    }
    
    console.log('Generating PDF report for:', client.name);
    
    // Create HTML content for PDF
    const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Client Report - ${client.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 20px; }
                .section { margin: 30px 0; }
                .section h3 { color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .info-item { background: #f8f9fa; padding: 15px; border-radius: 5px; }
                .label { font-weight: bold; color: #2c3e50; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Client Profile Report</h1>
                <h2>${client.name}</h2>
                <p>Generated on ${new Date().toLocaleDateString('bg-BG')}</p>
            </div>
            
            <div class="section">
                <h3>📋 Basic Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Name:</div>
                        <div>${client.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Email:</div>
                        <div>${client.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Phone:</div>
                        <div>${client.phone || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Company:</div>
                        <div>${client.company || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>🎯 Buyer Persona</h3>
                <div class="info-item">
                    <div class="label">Goals:</div>
                    <div>${client.goals || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="label">Pain Points:</div>
                    <div>${client.painPoints || 'Not specified'}</div>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Budget Range:</div>
                        <div>${client.budget || 'Not specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Timeline:</div>
                        <div>${client.timeline || 'Not specified'}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>💡 Smart Meeting Hints</h3>
                <div class="info-item">
                    <div class="label">Personality:</div>
                    <div>${client.personality || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="label">Meeting Preparation:</div>
                    <div>${client.meetingPrep || 'Not specified'}</div>
                </div>
            </div>
            
            <div class="section">
                <h3>📊 Project Status</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Current Status:</div>
                        <div>${client.currentStatus || 'Not specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Next Actions:</div>
                        <div>${client.nextActions || 'Not specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Project Type:</div>
                        <div>${client.projectType || 'Not specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Project Phase:</div>
                        <div>${client.projectPhase || 'Not specified'}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Auto-trigger print dialog
    setTimeout(() => {
        printWindow.print();
    }, 500);
    
    showNotification(`PDF report generated for ${client.name}! 📄`, 'success');
}

// 5. EXPORT ALL DATA TO EXCEL
function exportAllDataToExcel() {
    console.log('Exporting all data to Excel...');
    
    // Create comprehensive Excel data
    const summaryData = [
        ['Stoic11 Business Platform - Complete Data Export'],
        ['Generated on:', new Date().toLocaleDateString('bg-BG')],
        [''],
        ['SUMMARY'],
        ['Total Clients:', clientsData.length],
        ['Total Meetings:', meetingsData.length],
        ['Total Projects:', projectsData.length],
        [''],
        [''],
        ['CLIENT PROFILES'],
        ['Name', 'Email', 'Company', 'Budget', 'Timeline', 'Project Phase', 'Status']
    ];
    
    // Add client summary data
    clientsData.forEach(client => {
        summaryData.push([
            client.name || '',
            client.email || '',
            client.company || '',
            client.budget || '',
            client.timeline || '',
            client.projectPhase || '',
            client.currentStatus || ''
        ]);
    });
    
    summaryData.push(['']);
    summaryData.push(['MEETINGS']);
    summaryData.push(['Date', 'Time', 'Client', 'Type', 'Location', 'Status']);
    
    // Add meetings data
    meetingsData.forEach(meeting => {
        summaryData.push([
            meeting.date || '',
            meeting.time || '',
            meeting.clientName || '',
            meeting.type || '',
            meeting.location || '',
            meeting.status || ''
        ]);
    });
    
    // Convert to CSV
    const csvContent = summaryData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    downloadFile(csvContent, `stoic11-complete-export-${formatDateForFilename(new Date())}.csv`, 'text/csv');
    
    showNotification('Complete data export ready! 📊', 'success');
}

// UTILITY FUNCTIONS
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatDateForICal(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatDateForFilename(date) {
    return date.toISOString().split('T')[0];
}

// AUTO-BACKUP SYSTEM
function initAutoBackup() {
    console.log('Initializing auto-backup system...');
    
    // Check last backup date
    const lastBackup = localStorage.getItem('stoic11_backup_date');
    const now = new Date();
    
    if (!lastBackup) {
        console.log('No previous backup found. Creating initial backup...');
        createAutoBackup();
    } else {
        const lastBackupDate = new Date(lastBackup);
        const hoursSinceBackup = (now - lastBackupDate) / (1000 * 60 * 60);
        
        if (hoursSinceBackup >= 24) {
            console.log('Creating daily auto-backup...');
            createAutoBackup();
        }
    }
    
    // Set up periodic backup (every 24 hours)
    setInterval(createAutoBackup, 24 * 60 * 60 * 1000);
}

function createAutoBackup() {
    const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        type: 'auto-backup',
        data: {
            clients: clientsData,
            meetings: meetingsData,
            projects: projectsData
        }
    };
    
    localStorage.setItem('stoic11_auto_backup', JSON.stringify(backupData));
    localStorage.setItem('stoic11_backup_date', new Date().toISOString());
    
    console.log('Auto-backup completed successfully!');
}

// Initialize auto-backup when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAutoBackup, 2000); // Wait 2 seconds after page load
});

console.log('Data Export & Backup System loaded successfully! 💾');