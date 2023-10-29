from youtubesearchpython import Hashtag
import json
import sys
import time
import ast
import asyncio


start = time.time()

videoList = []
channelList = []
channelIdSet = set()
channelNamesList = []
dic = {}
videoCount = 0

videoSearch = Hashtag(sys.argv[1])
    
for i in range(int(sys.argv[2])-1):
    for x in videoSearch.result()['result']:
        videoList.append(x)
        if x['channel']['name'] not in channelNamesList:
            channelNamesList.append(x['channel']['name'])   
        
        channelIdSet.add(x['channel']['id'])
        videoCount += 1
    videoSearch.next()

for x in videoSearch.result()['result']:
    videoList.append(x)
    
    if x['channel']['name'] not in channelNamesList:
        channelNamesList.append(x['channel']['name'])

    channelIdSet.add(x['channel']['id'])
    videoCount += 1


end = time.time()

dic = {"videoCount" : videoCount, "timeTaken" : end - start, 
"channelNames" : channelNamesList, "channelIds" : list(channelIdSet), 
"videoList" : videoList}

print(json.dumps(dic))
sys.stdout.flush()


#async def channelSearchFunc(x):
#     return ChannelsSearch(x, 1).result()

# async def getChannels(channelIdList):
#     tasks = []
#     for x in channelIdList:
#         tasks.append(asyncio.create_task(channelSearchFunc(x)))
#     await asyncio.gather(*tasks)

# #asyncio.run(getChannels(list(channelIdSet)))

#  res = []
#  [res.append(x['title']) for x in search.result()['result']]
#  for i in range(int(sys.argv[2])-1):
#      [res.append(x['title']) for x in search.result()['result']]

# class handler(BaseHTTPRequestHandler):
#     def do_GET(self):
#         self.send_response(200)
#         self.send_header('Content-type','text/html')
#         self.end_headers()
#         search = VideosSearch('agac')
#         print(len(search.result()['result']))
#         start = time.time()
#         res = []
#         for i in range(5):
#             print(i)
#             [res.append(x['title']) for x in search.result()['result']]
#             search.next()
#         end = time.time()
#         print(end - start)
#         self.wfile.write(bytes('\n'.join(map(str, res)), "utf8"))

# with HTTPServer(('', 8000), handler) as server:
#     server.serve_forever()






