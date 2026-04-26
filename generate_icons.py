#!/usr/bin/env python3
"""
Hermes Cat Gatekeeper - Icon Generator
Run this once to create placeholder icons before loading the extension.
Replace icons/icon128.png with a real cat photo whenever you like.
"""

import os
import struct
import zlib

def create_png(size, filename):
    """Create a minimal valid PNG with a cat-orange color."""
    width = height = size
    
    # Orange-gold color (#FFB400) for Hermes
    r, g, b = 255, 180, 0
    
    raw_data = b""
    for y in range(height):
        raw_data += b"\x00"  # filter type None
        for x in range(width):
            # Draw a simple circle/paw shape
            cx, cy = width / 2, height / 2
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            radius = width * 0.4
            
            if dist <= radius:
                # Inside circle — orange
                raw_data += bytes([r, g, b, 255])
            else:
                # Outside — transparent
                raw_data += bytes([0, 0, 0, 0])
    
    def make_chunk(chunk_type, data):
        chunk_len = len(data)
        chunk_data = chunk_type + data
        crc = zlib.crc32(chunk_data) & 0xFFFFFFFF
        return struct.pack(">I", chunk_len) + chunk_data + struct.pack(">I", crc)
    
    # PNG signature
    png = b"\x89PNG\r\n\x1a\n"
    
    # IHDR chunk
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png += make_chunk(b"IHDR", ihdr_data)
    
    # IDAT chunk (compressed image data)
    compressed = zlib.compress(raw_data)
    png += make_chunk(b"IDAT", compressed)
    
    # IEND chunk
    png += make_chunk(b"IEND", b"")
    
    with open(filename, "wb") as f:
        f.write(png)
    
    print(f"  Created {filename} ({size}x{size})")

def main():
    os.makedirs("icons", exist_ok=True)
    print("Generating placeholder icons for Hermes Cat Gatekeeper...")
    
    create_png(16, "icons/icon16.png")
    create_png(48, "icons/icon48.png")
    create_png(128, "icons/icon128.png")
    
    print("\nDone! Icons created in icons/")
    print("Tip: Replace icons/icon128.png with a real cat photo for a better look!")

if __name__ == "__main__":
    main()
