@echo let backgrounds = [> bgs.js
for /R backgrounds %%a IN (*) DO @echo   '%%~nxa',>> bgs.js
@echo ]>> bgs.js