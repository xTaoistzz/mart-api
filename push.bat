#!/bin/bash

# ตั้งชื่อ branch ปัจจุบัน
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Push ขึ้น GitHub
echo "🚀 Pushing to GitHub..."
git push https://github.com/xTaoistzz/mart-api.git $BRANCH

# Push ขึ้น GitLab
echo "🚀 Pushing to GitLab..."
git push https://gitlab.com/xTaoistzz/mart-api.git $BRANCH

echo "✅ Done pushing to both remotes."
