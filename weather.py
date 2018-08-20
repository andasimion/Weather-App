import requests

# the script will be run every hour

url_weather = 'http://api.openweathermap.org/data/2.5/weather?id=681290&units=metric&APPID=d5703e918780bc6b6597daaabda25b65'

with open('weather_info.txt', 'w') as f:
    cluj_weather = str(requests.get(url_weather).json()).replace("'", '"')
    f.write(cluj_weather)
    

