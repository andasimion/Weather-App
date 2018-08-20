import requests

# the script will be run at 01 AM every day

url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?id=681290&units=metric&APPID=d5703e918780bc6b6597daaabda25b65'

with open('forecast_info.txt', 'w') as f:
    cluj_forecast = str(requests.get(url_forecast).json()).replace("'", '"')
    f.write(cluj_forecast)