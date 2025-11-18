@echo off
echo ========================================
echo MongoDB Replica Set Setup
echo ========================================
echo.
echo This will configure your local MongoDB as a replica set
echo which is required for Prisma transactions.
echo.
pause

echo Stopping MongoDB service...
net stop MongoDB

echo.
echo Creating MongoDB config file...
set CONFIG_FILE=C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg

echo Starting MongoDB with replica set...
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --replSet rs0 --dbpath "C:\Program Files\MongoDB\Server\7.0\data" --logpath "C:\Program Files\MongoDB\Server\7.0\log\mongod.log" --port 27017 --bind_ip localhost --install --serviceName MongoDB

echo Starting MongoDB service...
net start MongoDB

timeout /t 5 /nobreak

echo.
echo Initializing replica set...
mongosh --eval "rs.initiate()"

echo.
echo ========================================
echo MongoDB Replica Set Setup Complete!
echo ========================================
echo.
echo You can now run: npm run seed
echo.
pause
