const sharp = require('sharp');

async function processUserCutout() {
  const cutImg = await sharp('assets/user_cutout_raw.jpg').raw().toBuffer({ resolveWithObject: true });

  const { data: cutData, info } = cutImg;
  const W = info.width;
  const H = info.height;
  const ch = info.channels;

  const leftProfile = [
    [0, 1378],
    [45, 1350],
    [50, 1288],
    [65, 1245],
    [80, 1219],
    [95, 1198],
    [110, 1182],
    [125, 1168],
    [140, 1156],
    [155, 1147],
    [170, 1138],
    [185, 1131],
    [200, 1125],
    [215, 1120],
    [230, 1117],
    [245, 1114],
    [260, 1112],
    [275, 1106],
    [290, 1105],
    [305, 1104],
    [320, 1103],
    [335, 1096],
    [350, 1096],
    [380, 1108],
    [410, 1105],
    [430, 1104],
    [450, 1100],
    [475, 1100],
    [500, 1100],
    [525, 1105],
    [550, 1125],
    [575, 1120],
    [600, 1130],
    [625, 1135],
    [650, 1140],
    [675, 1145],
    [700, 1150],
    [725, 1150],
    [750, 1150],
    [775, 1190],
    [800, 1260],
    [825, 1260],
    [850, 1250],
    [875, 1220],
    [900, 1190],
    [925, 1165],
    [950, 1140],
    [1000, 1125],
    [1050, 1110],
    [1100, 1085],
    [1150, 1068],
    [1200, 1049],
    [1250, 1032],
    [1300, 1015],
    [1350, 1002],
    [1400, 989],
    [1450, 975],
    [1500, 963],
    [1536, 955]
  ];

  const rightProfile = [
    [0, 1378],
    [45, 1378],
    [65, 1442],
    [80, 1475],
    [100, 1505],
    [120, 1526],
    [150, 1551],
    [180, 1569],
    [200, 1573],
    [220, 1577],
    [240, 1580],
    [260, 1582],
    [280, 1584],
    [300, 1584],
    [320, 1582],
    [350, 1583],
    [380, 1598],
    [410, 1609],
    [450, 1604],
    [480, 1592],
    [510, 1565],
    [540, 1550],
    [580, 1550],
    [610, 1550],
    [640, 1550],
    [670, 1580],
    [700, 1595],
    [730, 1612],
    [760, 1658],
    [790, 1685],
    [820, 1732],
    [850, 1773],
    [880, 1805],
    [920, 1842],
    [960, 1871],
    [1000, 1891],
    [1050, 1907],
    [1100, 1920],
    [1150, 1926],
    [1200, 1925],
    [1250, 1925],
    [1300, 1929],
    [1350, 1918],
    [1400, 1916],
    [1450, 1912],
    [1500, 1907],
    [1536, 1904]
  ];

  function interpolate(table, y) {
    if (y <= table[0][0]) return table[0][1];
    if (y >= table[table.length - 1][0]) return table[table.length - 1][1];
    for (let i = 0; i < table.length - 1; i++) {
      if (y >= table[i][0] && y <= table[i + 1][0]) {
        const t = (y - table[i][0]) / (table[i + 1][0] - table[i][0]);
        return table[i][1] + t * (table[i + 1][1] - table[i][1]);
      }
    }
    return table[0][1];
  }

  // Precompute left and right profiles for all Y
  const interpLeft = new Float64Array(H);
  const interpRight = new Float64Array(H);
  for (let y = 0; y < H; y++) {
    interpLeft[y] = interpolate(leftProfile, y);
    interpRight[y] = interpolate(rightProfile, y);
  }

  // Smooth with 3-tap moving average
  const finalLeft = new Float64Array(H);
  const finalRight = new Float64Array(H);
  const R = 3;
  for (let y = 0; y < H; y++) {
    let sumL = 0, sumR = 0, count = 0;
    for (let dy = -R; dy <= R; dy++) {
      const ny = y + dy;
      if (ny >= 0 && ny < H) {
        const w = R + 1 - Math.abs(dy);
        sumL += interpLeft[ny] * w;
        sumR += interpRight[ny] * w;
        count += w;
      }
    }
    finalLeft[y] = sumL / count;
    finalRight[y] = sumR / count;
  }

  // Crop from 880 to 2000
  const cropLeft = 880;
  const cropWidth = 1120;
  const croppedRgba = Buffer.alloc(cropWidth * H * 4);

  for (let y = 0; y < H; y++) {
    const lX = finalLeft[y];
    const rX = finalRight[y];

    for (let cx = 0; cx < cropWidth; cx++) {
      const origX = cx + cropLeft;
      const srcIdx = (y * W + origX) * ch;
      const dstIdx = (y * cropWidth + cx) * 4;

      croppedRgba[dstIdx] = cutData[srcIdx];
      croppedRgba[dstIdx + 1] = cutData[srcIdx + 1];
      croppedRgba[dstIdx + 2] = cutData[srcIdx + 2];

      if (y < 45 || origX < lX - 1.2 || origX > rX + 1.2) {
        croppedRgba[dstIdx + 3] = 0;
      } else if (origX >= lX + 1.2 && origX <= rX - 1.2) {
        croppedRgba[dstIdx + 3] = 255;
      } else {
        // Feather 2.4px edge
        let alpha = 1.0;
        if (origX < lX + 1.2) {
          alpha = Math.min(alpha, (origX - (lX - 1.2)) / 2.4);
        }
        if (origX > rX - 1.2) {
          alpha = Math.min(alpha, ((rX + 1.2) - origX) / 2.4);
        }
        croppedRgba[dstIdx + 3] = Math.round(Math.max(0, Math.min(255, alpha * 255)));
      }
    }
  }

  await sharp(croppedRgba, { raw: { width: cropWidth, height: H, channels: 4 } })
    .trim()
    .png({ compressionLevel: 9 })
    .toFile('assets/portrait.png');

  console.log('SUBBLIME: assets/portrait.png successfully created!');
}

processUserCutout().catch(console.error);
