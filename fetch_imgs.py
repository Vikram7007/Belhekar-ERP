import urllib.request
import re

try:
    url = 'https://belhekargroupofinstitute.in/Polytechnic/'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    imgs = set(re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', html))
    for img in imgs:
        print(img)
except Exception as e:
    print(e)
