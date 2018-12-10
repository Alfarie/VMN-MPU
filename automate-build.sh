# 1. npm run build 
# 2.  
# 3.


echo "build web server app..."
CMD="npm run build"
$CMD

# echo "build react app"
# CMD="sh /Users/alfarie/Documents/Grobot-Project/@Project/VMN/VMN-UI/deploy.sh"
# $CMD

echo "build react app successful"
CMD="cp -r build DB cert package.json ./Deploy"
$CMD