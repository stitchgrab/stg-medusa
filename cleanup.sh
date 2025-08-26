#!/bin/bash

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
    echo "Usage: ./cleanup.sh [stitchgrab-staging|stitchgrab]"
    echo ""
    echo "This will remove ALL config vars, buildpacks, and drop all database tables."
    echo "This action cannot be undone!"
    exit 1
fi

echo "🧹 Cleaning up $APP_NAME..."
echo "⚠️  This will remove ALL config vars, buildpacks, and drop all database tables!"
echo ""

# Confirm before proceeding
read -p "Are you sure you want to continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""

# Clear buildpacks
echo "📦 Clearing buildpacks..."
heroku buildpacks:clear --app $APP_NAME

# Drop all tables in the database
echo "🗄️  Dropping all database tables..."
heroku pg:reset DATABASE_URL --app $APP_NAME --confirm $APP_NAME
echo "✅ All database tables dropped"

# Get all config vars and remove them individually
echo "🔧 Removing all config vars..."
CONFIG_VARS=$(heroku config --app $APP_NAME --json | jq -r 'keys[]' 2>/dev/null)

if [ -n "$CONFIG_VARS" ]; then
    echo "Found config vars: $CONFIG_VARS"
    
    # Remove each config var individually to handle protected vars
    for var in $CONFIG_VARS; do
        echo "Removing $var..."
        heroku config:unset $var --app $APP_NAME 2>/dev/null || echo "Could not remove $var (may be protected)"
    done
    
    echo "✅ Config vars removal attempted"
else
    echo "No config vars found"
fi

echo ""
echo "🎉 Cleanup complete for $APP_NAME!"
echo ""
echo "To verify cleanup:"
echo "  heroku config --app $APP_NAME"
echo "  heroku buildpacks --app $APP_NAME"
echo "  heroku addons --app $APP_NAME"
echo "  heroku pg:info --app $APP_NAME"
