#!/bin/bash
# Restore the 'origin' remote after git filter-repo

git remote add origin https://github.com/behark/AutoSallonPro.git

git add .
git commit -m "Restore all project files after filter-repo"
git push -u origin main --force
