import datetime
import json
import urllib.request

apikey = "945b577a8ebc5cbefad435d9c99fd684"
lat = 36.1519752
long = -96.1581974

data_file = open('my_weather_data.json', 'w')
data_file.seek(0)
data_file.truncate()

data = []

api_url_base = "https://api.darksky.net/forecast/%s/" % apikey
max_days_back = 365
start_date = datetime.datetime.today() - datetime.timedelta(days=(max_days_back + 1))
for days_back in range(max_days_back):
    date = start_date + datetime.timedelta(days=days_back)
    date_string = date.strftime('%Y-%m-%d')
    url = api_url_base + "%s,%s,%sT12:00:00" % (lat, long, date_string)
    res = urllib.request.urlopen(url).read()
    try:
        weather_data = json.loads(res)
        daily_weather_data = weather_data["daily"]["data"][0]
        daily_weather_data.update({ "date": date_string })
        data.append(daily_weather_data)
    except:
        print("Trouble loading data for %s" % date_string)

data_file.write(json.dumps(data))
