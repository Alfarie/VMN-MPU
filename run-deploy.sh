# 1. npm run build 
# 2.  
# 3.


BASEDIR=$(dirname "$0")
echo "$BASEDIR"

if [ ! -d $BASEDIR/Deploy ]; then
    mkdir $BASEDIR/Deploy
fi

# Build & deploy webapp
sh /Users/alfarie/Documents/Grobot-Project/@Project/VMN/VMN-UI/deploy.sh

npm run build
cp -r $BASEDIR/build $BASEDIR/Deploy


echo "[Info] Deployment success"