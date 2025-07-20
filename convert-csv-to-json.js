const fs = require('fs');
const csv = require('csv-parser');

const diseases = [];

fs.createReadStream('Diseases_Symptoms.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (row.Name && row.Disease_Code) {
      const disease = {
        id: diseases.length + 1,
        name: row.Name,
        disease_code: row.Disease_Code,
        symptoms: row.Symptoms || '',
        treatments: row.Treatments || '',
        contagious: ['true', '1', 'yes'].includes(String(row.Contagious || '').toLowerCase()),
        chronic: ['true', '1', 'yes'].includes(String(row.Chronic || '').toLowerCase()),
        symptoms_list: row.Symptoms ? row.Symptoms.split(',').map(s => s.trim()) : [],
        treatments_list: row.Treatments ? row.Treatments.split(',').map(t => t.trim()) : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      diseases.push(disease);
    }
  })
  .on('end', () => {
    // Write the data to a JSON file
    const output = {
      diseases: diseases,
      stats: {
        total_diseases: diseases.length,
        contagious_diseases: diseases.filter(d => d.contagious).length,
        chronic_diseases: diseases.filter(d => d.chronic).length,
        non_contagious_diseases: diseases.filter(d => !d.contagious).length,
        non_chronic_diseases: diseases.filter(d => !d.chronic).length
      }
    };
    
    fs.writeFileSync('disease-diagnosis-frontend/src/data/diseases.json', JSON.stringify(output, null, 2));
    console.log(`Converted ${diseases.length} diseases to JSON`);
  });
