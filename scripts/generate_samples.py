import os
from PIL import Image, ImageDraw, ImageFont
import PIL.ExifTags as ExifTags
import math

os.makedirs('public/samples', exist_ok=True)

def create_gradient_img(width, height, color1, color2, title, subtitle):
    img = Image.new('RGB', (width, height), color1)
    draw = ImageDraw.Draw(img)
    # Draw horizontal gradient
    for y in range(height):
        r = int(color1[0] + (color2[0] - color1[0]) * (y / height))
        g = int(color1[1] + (color2[1] - color1[1]) * (y / height))
        b = int(color1[2] + (color2[2] - color1[2]) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Decorative elements
    draw.rectangle([40, 40, width-40, height-40], outline=(255, 255, 255, 120), width=3)
    draw.ellipse([width//2 - 120, height//2 - 180, width//2 + 120, height//2 + 60], outline=(255, 255, 255, 80), width=4)
    draw.line([(width//2 - 150, height//2 - 60), (width//2 + 150, height//2 - 60)], fill=(255, 255, 255, 100), width=2)
    
    # Add text banner
    draw.text((width//2, height//2 + 100), title, fill=(255, 255, 255), anchor="mm")
    draw.text((width//2, height//2 + 140), subtitle, fill=(200, 220, 255), anchor="mm")
    return img

# 1. Sony A7 IV Photo (Dhaka, Bangladesh)
def generate_sony():
    img = create_gradient_img(2400, 1600, (15, 23, 42), (49, 46, 129), "Sony Alpha A7 IV - Sample Photo", "Hatirjheel, Dhaka, Bangladesh")
    exif = Image.Exif()
    exif[ExifTags.Base.Make] = "Sony"
    exif[ExifTags.Base.Model] = "ILCE-7M4"
    exif[ExifTags.Base.Software] = "ILCE-7M4 v3.01"
    exif[ExifTags.Base.Artist] = "Fatin Ishraque"
    exif[ExifTags.Base.Copyright] = "© 2026 Fatin Ishraque. All Rights Reserved."
    exif[ExifTags.Base.ImageDescription] = "Evening twilight reflection at Hatirjheel Lake, Dhaka."
    
    # GPS: Hatirjheel, Dhaka (23.7723° N, 90.4147° E)
    exif[ExifTags.Base.GPSInfo] = {
        ExifTags.GPS.GPSLatitudeRef: 'N',
        ExifTags.GPS.GPSLatitude: (23, 46, 20.28),
        ExifTags.GPS.GPSLongitudeRef: 'E',
        ExifTags.GPS.GPSLongitude: (90, 24, 52.92),
        ExifTags.GPS.GPSAltitudeRef: 0,
        ExifTags.GPS.GPSAltitude: 14.5,
    }
    
    # SubIFD
    exif[ExifTags.Base.ExifOffset] = {
        ExifTags.Base.DateTimeOriginal: "2026:10:20 17:35:42",
        ExifTags.Base.DateTimeDigitized: "2026:10:20 17:35:42",
        ExifTags.Base.ExposureTime: (1, 640),
        ExifTags.Base.FNumber: (18, 10), # f/1.8
        ExifTags.Base.ISOSpeedRatings: 100,
        ExifTags.Base.FocalLength: (50, 1), # 50mm
        ExifTags.Base.FocalLengthIn35mmFilm: 50,
        ExifTags.Base.Flash: 0, # Did not fire
        ExifTags.Base.MeteringMode: 5, # Pattern
        ExifTags.Base.ExposureProgram: 3, # Aperture Priority
        ExifTags.Base.ExposureBiasValue: (0, 10), # 0 EV
        ExifTags.Base.WhiteBalance: 0, # Auto
        ExifTags.Base.LensModel: "FE 50mm F1.4 GM",
        ExifTags.Base.LensMake: "Sony",
    }
    img.save("public/samples/sony_a7iv_dhaka.jpg", exif=exif, quality=92)
    print("Sony sample generated")

# 2. Apple iPhone 15 Pro (Cox's Bazar Beach)
def generate_iphone():
    img = create_gradient_img(2048, 1536, (6, 78, 59), (16, 185, 129), "Apple iPhone 15 Pro - Beach Sunset", "Cox's Bazar Sea Beach, Bangladesh")
    exif = Image.Exif()
    exif[ExifTags.Base.Make] = "Apple"
    exif[ExifTags.Base.Model] = "iPhone 15 Pro"
    exif[ExifTags.Base.Software] = "iOS 18.2"
    exif[ExifTags.Base.ImageDescription] = "Golden hour ocean waves at Cox's Bazar longest sea beach."
    
    # GPS: Cox's Bazar (21.4272° N, 91.9722° E)
    exif[ExifTags.Base.GPSInfo] = {
        ExifTags.GPS.GPSLatitudeRef: 'N',
        ExifTags.GPS.GPSLatitude: (21, 25, 37.92),
        ExifTags.GPS.GPSLongitudeRef: 'E',
        ExifTags.GPS.GPSLongitude: (91, 58, 19.92),
        ExifTags.GPS.GPSAltitudeRef: 0,
        ExifTags.GPS.GPSAltitude: 4.2,
    }
    
    exif[ExifTags.Base.ExifOffset] = {
        ExifTags.Base.DateTimeOriginal: "2026:09:14 18:12:05",
        ExifTags.Base.DateTimeDigitized: "2026:09:14 18:12:05",
        ExifTags.Base.ExposureTime: (1, 2400),
        ExifTags.Base.FNumber: (178, 100), # f/1.78
        ExifTags.Base.ISOSpeedRatings: 50,
        ExifTags.Base.FocalLength: (686, 100), # 6.86mm
        ExifTags.Base.FocalLengthIn35mmFilm: 24, # 24mm equivalent
        ExifTags.Base.Flash: 16, # Flash did not fire, compulsory flash mode
        ExifTags.Base.MeteringMode: 5,
        ExifTags.Base.ExposureProgram: 2, # Normal program
        ExifTags.Base.LensModel: "iPhone 15 Pro back triple camera 6.86mm f/1.78",
        ExifTags.Base.LensMake: "Apple",
    }
    img.save("public/samples/iphone15_coxsbazar.jpg", exif=exif, quality=90)
    print("iPhone sample generated")

# 3. Canon EOS R5 (Sajek Valley)
def generate_canon():
    img = create_gradient_img(2560, 1440, (120, 53, 15), (217, 119, 6), "Canon EOS R5 - Cloud Valley", "Sajek Valley, Rangamati, Bangladesh")
    exif = Image.Exif()
    exif[ExifTags.Base.Make] = "Canon"
    exif[ExifTags.Base.Model] = "Canon EOS R5"
    exif[ExifTags.Base.Software] = "Firmware Version 1.9.0"
    exif[ExifTags.Base.Artist] = "Himalayan Explorer"
    exif[ExifTags.Base.Copyright] = "© 2026 Nature Photography Ltd."
    exif[ExifTags.Base.ImageDescription] = "Sea of clouds in Sajek Valley early morning sunrise."
    
    # GPS: Sajek Valley (23.3824° N, 92.2938° E)
    exif[ExifTags.Base.GPSInfo] = {
        ExifTags.GPS.GPSLatitudeRef: 'N',
        ExifTags.GPS.GPSLatitude: (23, 22, 56.64),
        ExifTags.GPS.GPSLongitudeRef: 'E',
        ExifTags.GPS.GPSLongitude: (92, 17, 37.68),
        ExifTags.GPS.GPSAltitudeRef: 0,
        ExifTags.GPS.GPSAltitude: 580.0,
    }
    
    exif[ExifTags.Base.ExifOffset] = {
        ExifTags.Base.DateTimeOriginal: "2026:10:05 06:14:33",
        ExifTags.Base.DateTimeDigitized: "2026:10:05 06:14:33",
        ExifTags.Base.ExposureTime: (1, 125),
        ExifTags.Base.FNumber: (80, 10), # f/8.0
        ExifTags.Base.ISOSpeedRatings: 200,
        ExifTags.Base.FocalLength: (35, 1), # 35mm
        ExifTags.Base.FocalLengthIn35mmFilm: 35,
        ExifTags.Base.Flash: 0,
        ExifTags.Base.MeteringMode: 5,
        ExifTags.Base.ExposureProgram: 1, # Manual
        ExifTags.Base.ExposureBiasValue: (-33, 100), # -0.33 EV
        ExifTags.Base.LensModel: "RF 24-70mm F2.8 L IS USM",
        ExifTags.Base.LensMake: "Canon",
    }
    img.save("public/samples/canon_r5_sajek.jpg", exif=exif, quality=92)
    print("Canon sample generated")

if __name__ == '__main__':
    generate_sony()
    generate_iphone()
    generate_canon()
