import Player from 'xgplayer/dist/simple_player';
import volume from 'xgplayer/dist/controls/volume';
import playbackRate from 'xgplayer/dist/controls/playbackRate';

var express = require('express');
var router = express.Router();

let player = new Player({
  id: 'player',
  url: '/videos/test.mp4',
  controlPlugins: [
    volume,
    playbackRate
  ],
  playbackRate: [0.5, 0.75, 1, 1.5, 2] //传入倍速可选数组
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('live', { title: `${user}的直播间` });
});

module.exports = router;
