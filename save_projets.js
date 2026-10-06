const sharp = require('sharp');
const path = require('path');

async function processProjects() {
  const images = [
    {
      src: 'C:\\Users\\Antonn\\.gemini\\antigravity-ide\\brain\\131258a4-492b-4edd-b4fa-b19d7d964316\\case_room_mockup_1791169907436.jpg',
      dest: 'assets/projets/case-room.jpg'
    },
    {
      src: 'C:\\Users\\Antonn\\.gemini\\antigravity-ide\\brain\\131258a4-492b-4edd-b4fa-b19d7d964316\\oryn_product_mockup_1791169966045.jpg',
      dest: 'assets/projets/oryn.jpg'
    },
    {
      src: 'C:\\Users\\Antonn\\.gemini\\antigravity-ide\\brain\\131258a4-492b-4edd-b4fa-b19d7d964316\\statwin_app_mockup_1791170033465.jpg',
      dest: 'assets/projets/statwin.jpg'
    },
    {
      src: 'C:\\Users\\Antonn\\.gemini\\antigravity-ide\\brain\\131258a4-492b-4edd-b4fa-b19d7d964316\\pipeline_ia_mockup_1791170098223.jpg',
      dest: 'assets/projets/pipeline-ia.jpg'
    }
  ];

  for (const item of images) {
    await sharp(item.src)
      .resize(800, 1000, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toFile(item.dest);
    console.log(`Saved 4:5 image: ${item.dest}`);
  }
}

processProjects().catch(console.error);
