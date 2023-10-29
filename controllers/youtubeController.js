const Channel = require('../models/channelModel');
const base = require('./baseController');
const youtube = require('youtube-search-api');
const constants = require('../helpers/constants');
const { google } = require("googleapis");

// Python running libs.
const spawn = require('child_process').spawn;
const { time } = require('console');
const { connected } = require('process');

const youtubeApi = google.youtube({
    version: "v3",
    auth: constants.apiKey,
});

exports.channel = async (req, res, next) => {
    try {
        console.log(req.params.userName);
        const response = await youtubeApi.channels.list({
            part: "statistics,contentDetails,snippet",
            forUsername: req.params.userName,
        });

        res.send(response);
    } catch (err) {
        next(err);
    }
}

// exports.searchPy = async (req, res, next) => {
//     $.ajax({
//         type: "POST",
//         url: "~/searcher.py",
//         data: { param: text}
//     }).done(function( o ) {

//     });
// }

exports.searchPy = async (req, res, next) => {
    try {
        const t0 = performance.now();
        const promises = [];
        let channelList = [];
        
        // Reading Python files
        let pythonData = '';
        // spawn new child process to call the python script
        const python = spawn('python3', ['controllers/videoSearcher.py', req.query.q, req.query.depth ?? 1]);

        // collect data from script
        python.stdout.on('data', function (data) {
            pythonData += data.toString();
        });

        python.stderr.on('data', data => {
            console.error(`stderr: ${data}`);
        });

        // in close event we are sure that stream from child process is closed
        python.on('exit', async (code) => {
            console.log(`child process exited with code ${code}, ${pythonData}`);

            jsonSearchData = JSON.parse(pythonData);

            jsonSearchData.channelIds.forEach(a => promises.push(youtubeApi.channels.list({
                part: "statistics,contentDetails,snippet",
                id: a,
            })));

            await Promise.all(promises).then(values => {
                for(let value of values) {
                    delete value["etag"]
                    delete value["kind"]
                    delete value["id"]
                    channelList.push(value.data.items["0"]);
                }
            })
            
            delete jsonSearchData['channelIds'];

            jsonSearchData["channelList"] = channelList;

            res.status(200).json(jsonSearchData);

            const t1 = performance.now();
            console.log(`\nCall to search took ${t1 - t0} milliseconds.`);
        });
    } catch (err) {
        next(err);
    }
}

exports.searchApi = async (req, res, next) => {
    try {
        const items = [];
        const response = await youtubeApi.search.list({
            maxResults: 50,
            q: "videos about woods",
            part: ["snippet"],
        });
        items.push(response.data.items);

        const response1 = await youtubeApi.search.list({
            maxResults: 50,
            q: "videos about woods",
            part: ["snippet"],
            pageToken: response.data.nextPageToken
        });
        items.push(response1.data.items.map(a => a.snippet.title));
        res.send(items);
    } catch (err) {
        next(err);
    }
}

exports.search = async (req, res, next) => {
    try {
        const titleArray = new Set();
        youtube.GetListByKeyword(req.params.text, false).then(async result => {
            result.items.map(a => a.channelTitle).forEach(a => titleArray.add(a));

            let nextResult = result;
            var startTime = performance.now();
            for (let i = 0; i < constants.page.PAGE_SIZE - 1; i++) {

                await youtube.NextPage(nextResult.nextPage, false).then(result => {
                    result.items.map(a => a.channelTitle).forEach(a => titleArray.add(a));
                    nextResult = result;
                })
                var endTime = performance.now();

            };
            res.status(200).json({
                page: "Page 1",
                status: "success",
                data: {
                    titles: [...titleArray]
                },
            })
            console.log(`Call to search took ${endTime - startTime} milliseconds.`);
        }).catch(err => {
            console.log(err);
        });
    } catch (err) {
        next(err);
    }
};