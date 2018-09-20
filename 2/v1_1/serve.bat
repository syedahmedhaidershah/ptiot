@echo off
D:
cd D:\MongoDB\Server\3.6\bin
mongod.exe --bind_ip 192.168.0.103 --auth --port 27017
pause