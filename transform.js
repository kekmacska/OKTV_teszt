import fs from 'fs/promises';  // Use fs.promises for async file handling

const filePath = './questions/2025.json';  // Path to the original JSON file
const outputPath = './questions/2025_transformed.json';  // Path to output file

async function transformData() {
  try {
    // Step 1: Read the original JSON file
    const data = await fs.readFile(filePath, 'utf8');
    
    // Step 2: Parse the original JSON into a JavaScript object
    const jsonData = JSON.parse(data);
    
    // Step 3: Transform the data to include the id field
    const transformedData = Object.entries(jsonData).map(([key, value]) => ({
      id: parseInt(key, 10),  // Use the original key as 'id'
      ...value,               // Spread the rest of the question data
    }));

    // Step 4: Write the transformed data to a new file
    await fs.writeFile(outputPath, JSON.stringify(transformedData, null, 2), 'utf8');
    
    console.log('Transformation complete. Data written to ./questions/2025_transformed.json');
  } catch (error) {
    console.error('Error during transformation:', error);
  }
}

// Run the transformation function
transformData();
