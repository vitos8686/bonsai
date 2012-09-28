/**
 * Type handler for videos
 */
define([
  './asset_handler'
], function(AssetHandler) {
  'use strict';

  var domVideo;
  try {
    domVideo = document.createElement('video');
  } catch (e) {}

  var events = {
    'progress': 'progress',
    'loadstart': 'loadstart',
    'loadedmetadata': 'loadedmetadata',
    'loadeddata': 'loadeddata',
    'canplay': 'canplay',
    'canplaythrough': 'canplaythrough'
  };

  function VideoHandler() {
    AssetHandler.apply(this, arguments);
  }

  VideoHandler.prototype = Object.create(AssetHandler.prototype);

  VideoHandler.prototype.loadResource = function(resource, doDone, doError) {

    var video,
        assetId = this.id,
        loadLevel = this.request.loadLevel || 'canplay',
        mimeType = resource.type,
        src = resource.src;

    if (!domVideo.canPlayType(mimeType) || this.hasInitiatedLoad) {
      this.resourcesExpectedLength--;
      return;
    }

    this.hasInitiatedLoad = true;

    // start loading video
    video = document.createElement('video');
    video.setAttribute('id', assetId);
    video.setAttribute('type', mimeType);
    video.src = src;

    this.registerElement(video);

    function onload() {
      doDone({
        width: video.videoWidth,
        height: video.videoHeight
      });
    }

    video.addEventListener(events[loadLevel], onload, false);

    video.addEventListener('error', function(e) {
      doError('Could not load video.');
    }, false);

    // TODO: These events need to be passed to the worker somehow
    video.addEventListener('ended', function() {
      //console.log('ended');
    }, false);

    video.addEventListener('play', function() {
      //console.log('play');
    }, false);

    video.addEventListener('pause', function() {
      //console.log('paused');
    }, false);
  };

  return VideoHandler;
});