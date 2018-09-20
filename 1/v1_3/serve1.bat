@echo off
D:
cd D:\MongoDB\Server\3.6\bin
mongod.exe --port 9999 --dbpath D:/data2/db
pause