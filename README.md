# OscilloscopeMusic Visualization For Blender
## Prerequisites
need [Node.js](https://nodejs.org/) and audio-decode
## How to Use
1. Open the `·flac_to_pointcloud.js` file, then enter the path to your `.flac` file and the output path into `inputFile` and `outputFile` respectively.
2. Run the script, and you should get a `.csv` file.
3. Open `visualization.blend` . You’ll see an oscilloscope node group. Select the `.csv` file you just generated. Set the sample to **Audio Sample Rate / Frames per Second**, then play it back.
