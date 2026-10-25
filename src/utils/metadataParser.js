import ExifReader from 'exifreader';

/**
 * Format bytes into human readable format
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convert decimal degrees to Degrees Minutes Seconds (DMS) format
 */
export function toDMS(coordinate, type) {
  if (coordinate === undefined || coordinate === null || isNaN(coordinate)) return null;
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  let direction = '';
  if (type === 'lat') {
    direction = coordinate >= 0 ? 'N' : 'S';
  } else if (type === 'lon') {
    direction = coordinate >= 0 ? 'E' : 'W';
  }

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

/**
 * Calculate greatest common divisor for aspect ratio
 */
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateAspectRatio(width, height) {
  if (!width || !height) return null;
  const divisor = gcd(Math.round(width), Math.round(height));
  const wRatio = Math.round(width) / divisor;
  const hRatio = Math.round(height) / divisor;
  
  // Standard aspect ratio approximation
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.05) return '16:9';
  if (Math.abs(ratio - 4 / 3) < 0.05) return '4:3';
  if (Math.abs(ratio - 3 / 2) < 0.05) return '3:2';
  if (Math.abs(ratio - 1) < 0.05) return '1:1';
  if (Math.abs(ratio - 9 / 16) < 0.05) return '9:16';
  if (Math.abs(ratio - 21 / 9) < 0.05) return '21:9';
  
  return `${wRatio}:${hRatio}`;
}

/**
 * Parse metadata from an image File or ArrayBuffer
 */
export async function parseImageMetadata(file) {
  // Read array buffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Load using ExifReader with expanded groups
  let tags = {};
  try {
    tags = ExifReader.load(arrayBuffer, { expanded: true });
  } catch (err) {
    console.warn('ExifReader basic parse warning:', err);
    try {
      // Fallback without expanded
      const simpleTags = ExifReader.load(arrayBuffer);
      tags = { exif: simpleTags };
    } catch (e2) {
      console.error('Failed to parse EXIF with ExifReader:', e2);
    }
  }

  // Get image native dimensions from Image object
  const dimensions = await getImageDimensions(file);

  // Extract flat tags for search & table
  const allTagsList = [];
  const rawGroupData = {};

  Object.entries(tags).forEach(([groupName, groupTags]) => {
    if (!groupTags || typeof groupTags !== 'object') return;
    rawGroupData[groupName] = {};

    Object.entries(groupTags).forEach(([tagName, tagObj]) => {
      if (!tagObj) return;
      const description = tagObj.description !== undefined ? tagObj.description : String(tagObj.value ?? '');
      const val = tagObj.value;

      rawGroupData[groupName][tagName] = {
        description,
        value: val
      };

      allTagsList.push({
        id: `${groupName}-${tagName}`,
        group: groupName.toUpperCase(),
        name: tagName,
        description: String(description),
        value: Array.isArray(val) ? val.join(', ') : (typeof val === 'object' ? JSON.stringify(val) : String(val ?? ''))
      });
    });
  });

  // Extract helper values
  const getTag = (group, name) => {
    return tags[group]?.[name]?.description || tags[group]?.[name]?.value || null;
  };

  const getAnyTag = (names) => {
    for (const name of names) {
      for (const group of ['exif', 'iptc', 'xmp', 'file', 'icc']) {
        const val = tags[group]?.[name]?.description || tags[group]?.[name]?.value;
        if (val !== undefined && val !== null && val !== '') return val;
      }
    }
    return null;
  };

  // Dimensions
  const imgWidth = dimensions.width || parseInt(getTag('file', 'Image Width') || getTag('exif', 'PixelXDimension') || getTag('exif', 'ImageWidth') || 0, 10);
  const imgHeight = dimensions.height || parseInt(getTag('file', 'Image Height') || getTag('exif', 'PixelYDimension') || getTag('exif', 'ImageLength') || 0, 10);
  const megapixels = (imgWidth && imgHeight) ? ((imgWidth * imgHeight) / 1000000).toFixed(2) : null;
  const aspectRatio = calculateAspectRatio(imgWidth, imgHeight);

  // GPS Data
  let latitude = null;
  let longitude = null;
  let altitude = null;

  if (tags.gps) {
    if (typeof tags.gps.Latitude === 'number') latitude = tags.gps.Latitude;
    if (typeof tags.gps.Longitude === 'number') longitude = tags.gps.Longitude;
    if (typeof tags.gps.Altitude === 'number') altitude = tags.gps.Altitude;
  }

  // Fallback check in exif or flat tags
  if (latitude === null && tags.exif?.GPSLatitude) {
    latitude = parseFloat(tags.exif.GPSLatitude.description);
  }
  if (longitude === null && tags.exif?.GPSLongitude) {
    longitude = parseFloat(tags.exif.GPSLongitude.description);
  }

  const hasGps = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

  // Camera & Shooting Information
  const make = getAnyTag(['Make']);
  const model = getAnyTag(['Model']);
  const lensMake = getAnyTag(['LensMake']);
  const lensModel = getAnyTag(['LensModel', 'LensInfo', 'Lens']);
  const software = getAnyTag(['Software', 'ProcessingSoftware', 'CreatorTool']);

  const shutterSpeed = getAnyTag(['ExposureTime', 'ShutterSpeedValue']);
  const aperture = getAnyTag(['FNumber', 'ApertureValue']);
  const iso = getAnyTag(['ISOSpeedRatings', 'PhotographicSensitivity', 'ISO']);
  const focalLength = getAnyTag(['FocalLength']);
  const focalLength35mm = getAnyTag(['FocalLengthIn35mmFilm', 'FocalLength35efl']);
  const exposureProgram = getAnyTag(['ExposureProgram']);
  const meteringMode = getAnyTag(['MeteringMode']);
  const flash = getAnyTag(['Flash']);
  const whiteBalance = getAnyTag(['WhiteBalance']);
  const exposureBias = getAnyTag(['ExposureBiasValue', 'ExposureCompensation']);

  // Timestamps
  const dateTaken = getAnyTag(['DateTimeOriginal', 'DateCreated', 'CreateDate']);
  const dateDigitized = getAnyTag(['DateTimeDigitized']);
  const dateModified = getAnyTag(['DateTime', 'ModifyDate']);

  // Copyright / Creator
  const artist = getAnyTag(['Artist', 'By-line', 'Creator']);
  const copyright = getAnyTag(['Copyright', 'Rights']);
  const description = getAnyTag(['ImageDescription', 'Description', 'Caption-Abstract']);
  const title = getAnyTag(['ObjectName', 'Headline', 'Title']);

  // Color & Quality
  const colorSpace = getAnyTag(['ColorSpace', 'ProfileDescription', 'ColorSpaceData']);
  const bitsPerSample = getAnyTag(['BitsPerSample', 'BitDepth']);

  return {
    fileInfo: {
      name: file.name,
      size: file.size,
      humanSize: formatBytes(file.size),
      type: file.type || 'image/jpeg',
      lastModified: file.lastModified ? new Date(file.lastModified).toLocaleString() : null,
      width: imgWidth,
      height: imgHeight,
      megapixels,
      aspectRatio,
    },
    cameraInfo: {
      make: cleanString(make),
      model: cleanString(model),
      lensMake: cleanString(lensMake),
      lensModel: cleanString(lensModel),
      software: cleanString(software),
    },
    exposureInfo: {
      shutterSpeed: cleanString(shutterSpeed),
      aperture: cleanAperture(aperture),
      iso: cleanString(iso),
      focalLength: cleanFocalLength(focalLength),
      focalLength35mm: cleanFocalLength(focalLength35mm),
      exposureProgram: cleanString(exposureProgram),
      meteringMode: cleanString(meteringMode),
      flash: cleanString(flash),
      whiteBalance: cleanString(whiteBalance),
      exposureBias: cleanString(exposureBias),
    },
    dateTimeInfo: {
      dateTaken: formatDate(dateTaken),
      dateDigitized: formatDate(dateDigitized),
      dateModified: formatDate(dateModified),
    },
    gpsInfo: hasGps ? {
      hasGps: true,
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      altitude: altitude !== null ? Number(altitude.toFixed(1)) : null,
      latitudeDMS: toDMS(latitude, 'lat'),
      longitudeDMS: toDMS(longitude, 'lon'),
      googleMapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
      openStreetMapUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`,
    } : { hasGps: false },
    copyrightInfo: {
      artist: cleanString(artist),
      copyright: cleanString(copyright),
      description: cleanString(description),
      title: cleanString(title),
    },
    colorInfo: {
      colorSpace: cleanString(colorSpace) || 'sRGB',
      bitsPerSample: cleanString(bitsPerSample),
    },
    allTags: allTagsList,
    rawGroups: rawGroupData,
  };
}

/**
 * Load image into Image element to determine true pixel dimensions
 */
function getImageDimensions(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: null, height: null });
    };
    img.src = url;
  });
}

function cleanString(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
}

function cleanAperture(val) {
  if (!val) return null;
  const str = String(val).trim();
  if (str.startsWith('f/')) return str;
  const num = parseFloat(str);
  return isNaN(num) ? str : `f/${num.toFixed(1)}`;
}

function cleanFocalLength(val) {
  if (!val) return null;
  const str = String(val).trim();
  if (str.endsWith('mm')) return str;
  return `${str} mm`;
}

function formatDate(val) {
  if (!val) return null;
  const str = String(val).trim();
  // EXIF format is usually YYYY:MM:DD HH:MM:SS
  const match = str.match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    const [_, y, m, d, hh, mm, ss] = match;
    try {
      const date = new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}`);
      return date.toLocaleString('bn-BD', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      }) + ` (${str})`;
    } catch {
      return str;
    }
  }
  return str;
}

/**
 * Privacy Stripper: Strip all EXIF / GPS / XMP by redrawing to clean canvas
 */
export async function stripMetadata(file, format = 'image/jpeg', quality = 0.95) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create stripped image blob'));
          return;
        }
        resolve(blob);
      }, format, quality);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Trigger file download helper
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
