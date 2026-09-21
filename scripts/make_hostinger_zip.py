#!/usr/bin/env python3
import os
import zipfile
import shutil
import subprocess

print("Step 1: Building production bundle...")
result = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)
if result.returncode != 0:
    print("Build failed:", result.stderr)
    exit(1)
print("Vite build successful!")

dist_dir = "dist"
zip_path = "public/airtime-travel-hostinger.zip"
temp_zip = "airtime-travel-hostinger.zip"

print("Step 2: Ensuring all Hostinger files exist in dist...")
# Ensure public/ contents are in dist
for item in [".htaccess", "database.sql", "README_HOSTINGER.txt"]:
    src = os.path.join("public", item)
    dst = os.path.join(dist_dir, item)
    if os.path.exists(src):
        shutil.copy2(src, dst)

# Ensure api directory is in dist
api_src = os.path.join("public", "api")
api_dst = os.path.join(dist_dir, "api")
if os.path.exists(api_src):
    if os.path.exists(api_dst):
        shutil.rmtree(api_dst)
    shutil.copytree(api_src, api_dst)

print("Step 3: Creating Hostinger deployment zip file...")
with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(dist_dir):
        # Skip the zip file itself if it's in dist
        for file in files:
            if file == "airtime-travel-hostinger.zip":
                continue
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, dist_dir)
            zipf.write(file_path, arcname)

# Copy to public and dist
shutil.copy2(temp_zip, zip_path)
shutil.copy2(temp_zip, os.path.join(dist_dir, "airtime-travel-hostinger.zip"))

size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f"Hostinger deployment package created successfully at {zip_path} ({size_mb:.2f} MB)")
