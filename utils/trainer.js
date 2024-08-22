import sharp from 'sharp';
import faceapi from 'face-api.js';
import path from 'path';
import fs from 'fs';


// Load face-api.js models
async function loadModels() {
  const modelPath = path.join(__dirname, 'models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
}

// Process image with sharp and return face-api.js compatible data
async function processImage(imagePath) {
  const image = sharp(imagePath);
  const { data, info } = await image
    .resize({ width: 640 }) // Resize to a consistent width
    .raw() // Get raw pixel data
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const imageTensor = faceapi.tf.tensor3d(data, [info.height, info.width, channels]);

  return imageTensor;
}

// Train model with processed face images
async function trainModel(student) {
  await loadModels();

  const labeledDescriptors = [];

  for (const faceImage of student.faceImage) {
    const imagePath = path.join('C:/Users/hp/Desktop/uploads/faces', faceImage);

    // Process image with sharp and convert to tensor
    const imgTensor = await processImage(imagePath);

    const detections = await faceapi.detectSingleFace(imgTensor).withFaceLandmarks().withFaceDescriptor();
    imgTensor.dispose(); // Free up memory

    if (detections) {
      labeledDescriptors.push(
        new faceapi.LabeledFaceDescriptors(student.matricNo, [detections.descriptor])
      );
    }
  }

  const trainedModelPath = path.join('C:/Users/hp/Desktop/uploads/trained_models', `${student.matricNo}_model.json`);
  fs.writeFileSync(trainedModelPath, JSON.stringify(labeledDescriptors));
  console.log(`Model trained and saved for student: ${student.matricNo}`);
}

// Automate the training process
const automateTraining = async (student) => {
  try {
    await trainModel(student);
    console.log('Training process completed successfully.');
  } catch (error) {
    console.error('Error during training:', error);
  }
};

export default{ automateTraining };
