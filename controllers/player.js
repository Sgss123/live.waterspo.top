import Player from 'xgplayer/dist/simple_player';
import volume from 'xgplayer/dist/controls/volume';
import playbackRate from 'xgplayer/dist/controls/playbackRate';

let player = new Player({
  id: 'player',
  url: '/videos/test.mp4',
  controlPlugins: [
    volume,
    playbackRate
  ],
  playbackRate: [0.5, 0.75, 1, 1.5, 2] //传入倍速可选数组
});