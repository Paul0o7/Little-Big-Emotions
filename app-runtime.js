/*
 * Minimal standalone runtime replacing code.org's App Lab export bundle
 * (applab-api.js), which does not self-initialize when run outside
 * code.org's own site. This implements only the commands this specific
 * project's code.js actually calls: onEvent, setScreen, setProperty,
 * getProperty, getText, playSound, stopSound, randomNumber, timedLoop,
 * and stopTimedLoop.
 */
(function () {
  "use strict";

  // ---- screens ----------------------------------------------------------
  function setScreen(screenId) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].style.display = "none";
    }
    var target = document.getElementById(screenId);
    if (target) {
      target.style.display = "block";
    } else {
      console.warn("setScreen: no element with id \"" + screenId + "\"");
    }
  }

  // ---- events -------------------------------------------------------------
  function onEvent(elementId, eventName, handler) {
    var el = document.getElementById(elementId);
    if (!el) {
      console.warn("onEvent: no element with id \"" + elementId + "\"");
      return;
    }
    el.addEventListener(eventName, handler);
  }

  // ---- properties -----------------------------------------------------
  function setProperty(elementId, property, value) {
    var el = document.getElementById(elementId);
    if (!el) {
      console.warn("setProperty: no element with id \"" + elementId + "\"");
      return;
    }
    switch (property) {
      case "text":
        el.textContent = value;
        break;
      case "text-color":
        el.style.color = value;
        break;
      case "background-color":
        el.style.backgroundColor = value;
        break;
      case "font-family":
        el.style.fontFamily = value;
        break;
      case "font-size":
        el.style.fontSize = (typeof value === "number") ? value + "px" : value;
        break;
      case "text-align":
        el.style.textAlign = value;
        break;
      case "x":
        el.style.left = (typeof value === "number") ? value + "px" : value;
        break;
      case "y":
        el.style.top = (typeof value === "number") ? value + "px" : value;
        break;
      case "width":
        el.style.width = (typeof value === "number") ? value + "px" : value;
        el.style.overflow = "visible";
        break;
      case "height":
        el.style.height = (typeof value === "number") ? value + "px" : value;
        el.style.overflow = "visible";
        break;
      case "hidden":
        el.style.visibility = value ? "hidden" : "visible";
        break;
      case "options":
        el.innerHTML = "";
        (value || []).forEach(function (optionText) {
          var opt = document.createElement("option");
          opt.value = optionText;
          opt.textContent = optionText;
          el.appendChild(opt);
        });
        break;
      default:
        console.warn("setProperty: unsupported property \"" + property + "\"");
    }
  }

  function getProperty(elementId, property) {
    var el = document.getElementById(elementId);
    if (!el) {
      console.warn("getProperty: no element with id \"" + elementId + "\"");
      return null;
    }
    if (property === "value") return el.value;
    if (property === "text") return el.textContent;
    if (property === "hidden") return el.style.visibility === "hidden";
    return null;
  }

  function getText(elementId) {
    var el = document.getElementById(elementId);
    if (!el) {
      console.warn("getText: no element with id \"" + elementId + "\"");
      return "";
    }
    return (el.value !== undefined) ? el.value : el.textContent;
  }

  // ---- sound --------------------------------------------------------------
  var audioCache = {};

  function resolveAssetPath(src) {
    // The original code.js is inconsistent about whether it includes the
    // "assets/" prefix, so normalize it here rather than in every call site.
    return "assets/" + src.replace(/^assets\//, "");
  }

  function getAudio(resolvedSrc) {
    if (!audioCache[resolvedSrc]) {
      audioCache[resolvedSrc] = new Audio(resolvedSrc);
    }
    return audioCache[resolvedSrc];
  }

  function playSound(src, loop) {
    var resolved = resolveAssetPath(src);
    var audio = getAudio(resolved);
    audio.loop = !!loop;
    try {
      audio.currentTime = 0;
    } catch (e) {
      /* ignore - can throw before metadata is loaded */
    }
    var playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        /* autoplay can be blocked before the first user gesture; ignore */
      });
    }
  }

  function stopSound(src) {
    var resolved = resolveAssetPath(src);
    var audio = audioCache[resolved];
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch (e) {
        /* ignore */
      }
    }
  }

  // ---- misc -----------------------------------------------------------
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var timedLoopHandle = null;

  function timedLoop(intervalMs, callback) {
    if (timedLoopHandle) clearInterval(timedLoopHandle);
    timedLoopHandle = setInterval(callback, intervalMs);
  }

  function stopTimedLoop() {
    if (timedLoopHandle) {
      clearInterval(timedLoopHandle);
      timedLoopHandle = null;
    }
  }

  // Expose everything code.js expects as globals.
  window.setScreen = setScreen;
  window.onEvent = onEvent;
  window.setProperty = setProperty;
  window.getProperty = getProperty;
  window.getText = getText;
  window.playSound = playSound;
  window.stopSound = stopSound;
  window.randomNumber = randomNumber;
  window.timedLoop = timedLoop;
  window.stopTimedLoop = stopTimedLoop;
  // `open` is left as the browser's native window.open, which already
  // does what App Lab's "open" command needs.
})();
