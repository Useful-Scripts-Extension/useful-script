// A set of rapidly prototyped sound visualizations
//
// By Jon Froehlich
// @jonfroehlich
// http://makeabilitylab.io/
//
// Feel free to use this source code for inspiration or in your
// own projects. If you do, I'd love to hear about it. Email me
// at jonf@cs.uw.edu or Tweet @jonfroehlich.
//
//  - why isn't this working in fullscreen in Chrome? Permissions issue?
//    -- https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
//    -- https://github.com/processing/processing-sound/issues/48
//  - [done] add axis labels to spectrogram
//  - [done] add x axis labels to scrolling waveform
//  - add y axis labels to scrolling waveform?
//  - add axis labels to spectrum?
//  - [done] add new bar graph fft (with log scale x axis so we have more bars for lower freq?)
//  - for spectrum bar graph fft:
//.    -- add linear x-axis option
//.    -- add color
//.    -- [done] add peak lines (that start to fall over time)
//  - play around with different scales for fft (linear vs. log)
//     -- add log y scale to spectrogram
//     -- add log x scale to spectrumvis?
//     -- log scale added via toggle here: https://therewasaguy.github.io/p5-music-viz/demos/04b_fft_spectrograph/
//  - [done] add background color to Rectangle class
//  - [in progress] add color? (right now, it's grayscale only)
//  - [done] if getNumSamplesInOnePixel() < 1024, need to update code
//     -- draw lines or rects for spectrogram to fill x
//  - [done] add in peak lines and average lines to spectrum vis (see GoldWave)
//  - should peak line refresh every N seconds in spectrum vis?
//  - just ran a few performance tests, need to add in drawing to offscreen buffer to scrolling waveform vis
//    -- if we do this, we can use draw line rather than vertex and draw each line by a diff color based on height
//       could also draw two lines (min and max in background and then interquartile range or something?). Audacity does
//       something like this
//  - fix scrolling spectrogram at seams between gfx buffers
//  - add setColorScheme function to Rectangle or some other class? Hit 'c' key to toggle color
//  - hit 'm' or something to toggle between mic and song?
//  - test with a lower sampling rate song
//  - hit 'c' to change color schemes
//
// How to comment javascript:
//  - https://gomakethings.com/whats-the-best-way-to-document-javascript/
//  - https://google.github.io/styleguide/jsguide.html#jsdoc-method-and-function-comments

class Rectangle {
  constructor(x, y, width, height, backgroundColor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }

  /**
   * Returns the left side of the rectangle
   * @return {Number} the left side of the rectangle
   */
  getLeft() {
    return this.x;
  }

  /**
   * Returns the right side of the rectangle
   * @return {Number} the right side of the rectangle
   */
  getRight() {
    return this.x + this.width;
  }

  /**
   * Returns the top of the rectangle
   * @return {Number} the top of the rectangle
   */
  getTop() {
    return this.y;
  }

  /**
   * Returns the bottom of the rectangle
   * @return {Number} the bottom of the rectangle
   */
  getBottom() {
    return this.y + this.height;
  }

  /**
   * Scales the rectangle width and height by the given fraction
   * @param {Number} fraction the fraction used for scaling
   */
  scale(fraction) {
    this.width *= fraction;
    this.height *= fraction;
  }

  /**
   * Increments the height by the given pixel amount. If lockAspectRatio
   * is true, also scales the width a proportional amount
   *
   * @param {Number} yIncrement the amount of pixels to increment height
   * @param {Number} lockAspectRatio if true, also increments width proportional amount
   */
  incrementHeight(yIncrement, lockAspectRatio) {
    let yIncrementFraction = yIncrement / this.height;
    this.height += yIncrement;
    if (lockAspectRatio) {
      let xIncrement = yIncrementFraction * this.width;
      this.width += xIncrement;
    }
  }

  /**
   * Increments the width by the given pixel amount. If lockAspectRatio
   * is true, also scales the height a proportional amount
   *
   * @param {Number} xIncrement the amount of pixels to increment width
   * @param {Number} lockAspectRatio if true, also increments height proportional amount
   */
  incrementWidth(xIncrement, lockAspectRatio) {
    let xIncrementFraction = xIncrement / this.width;
    this.width += xIncrement;
    if (lockAspectRatio) {
      let yIncrement = xIncrementFraction * this.height;
      this.height += yIncrement;
    }
  }

  /**
   * Returns true if this rectangle overlaps the rectangle r
   *
   * @param {Rectangle} r the rectangle to check for overlap
   * @return {boolean} true if there is overlap
   */
  overlaps(r) {
    // based on https://stackoverflow.com/a/4098512
    return !(
      this.getRight() < r.x ||
      this.getBottom() < r.y ||
      this.x > r.getRight() ||
      this.y > r.getBottom()
    );
  }

  /**
   * Returns true if this rectangle contains the point x,y
   *
   * @param {Number} x the x position of the point
   * @param {Number} y the y position of the point
   * @return {boolean} true if this rectangle contains the point
   */
  contains(x, y) {
    return (
      x >= this.x && // check within left edge
      x <= this.x + this.width && // check within right edge
      y >= this.y && // check within top edge
      y <= this.y + this.height
    ); // check within bottom edge
  }
}

// "Abstract" class extended by WaveformVisualizer, Spectrogram, etc.
class SoundVisualizer extends Rectangle {
  constructor(x, y, width, height, backgroundColor, lengthInSeconds) {
    super(x, y, width, height, backgroundColor);

    this.samplingRate = sampleRate();
    this.lengthInSeconds = lengthInSeconds;

    print("One x pixel = " + this.getNumSamplesInOnePixel() + " values");
    print("One x pixel = " + this.getNumSecondsInOnePixel() + " secs");
    print(
      "Waveform buffer segment (1024) is " +
        nfc(1024 / this.samplingRate, 2) +
        " secs"
    );

    this.bDrawAxes = true;

    this.xTicks = [];
    this.tickLength = 3; // in pixels
    this.axisLabelsTextSize = 8;
    let numXAxisTicks = 4;
    this.xTickEveryNSec = lengthInSeconds / numXAxisTicks;
    for (
      let xTickInSecs = 0;
      xTickInSecs < lengthInSeconds;
      xTickInSecs += this.xTickEveryNSec
    ) {
      this.xTicks.push(xTickInSecs);
    }

    this.hasUpdateEverBeenCalled = false;
    this.bufferIndex = 0;
    this.curBuffer = null;
  }

  update(buffer) {
    this.curBuffer = buffer;

    if (this.hasUpdateEverBeenCalled == false) {
      // Helpful to understand length of fft buffer for debugging purposes
      let bufferLengthInXPixels = this.convertBufferLengthToXPixels(
        buffer.length
      );
      print(
        "The buffer segment is " +
          buffer.length +
          " samples, which is " +
          nfc(buffer.length / this.samplingRate, 2) +
          " secs and " +
          nfc(bufferLengthInXPixels, 2) +
          " x pixels"
      );
      this.hasUpdateEverBeenCalled = true;
    }

    this.bufferIndex += buffer.length;
  }

  getXAxisLengthInSeconds() {
    return this.lengthInSeconds;
  }

  getXAxisLengthInSamples() {
    return this.lengthInSeconds * this.samplingRate;
  }

  getNumSamplesInOnePixel() {
    return int(this.getXAxisLengthInSamples() / this.width);
  }

  getNumSecondsInOnePixel() {
    return this.getXAxisLengthInSeconds() / this.width;
  }

  getMinXAsTimeInSecs() {
    return this.convertBufferIndexToTime(this.getMinXAsSampleIndex());
  }

  getMaxXAsTimeInSecs() {
    return this.convertBufferIndexToTime(this.getMaxXAsSampleIndex());
  }

  getMinXAsSampleIndex() {
    if (this.bufferIndex < this.getXAxisLengthInSamples()) {
      return 0;
    }
    return this.bufferIndex - this.getXAxisLengthInSamples();
  }

  getMaxXAsSampleIndex() {
    if (this.bufferIndex < this.getXAxisLengthInSamples()) {
      return this.getXAxisLengthInSamples();
    }
    return this.bufferIndex;
  }

  convertBufferLengthToXPixels(bufferLength) {
    return (bufferLength / this.getXAxisLengthInSamples()) * this.width;
  }

  convertBufferIndexToTime(bufferIndex) {
    return bufferIndex / this.samplingRate;
  }

  getXPixelFromSampleIndex(sampleIndex) {
    let xVal = map(
      sampleIndex,
      this.getMinXAsSampleIndex(),
      this.getMaxXAsSampleIndex(),
      this.x,
      this.width
    );
    return xVal;
  }

  getXPixelFromTimeInSecs(timeInSecs) {
    let xVal = map(
      timeInSecs,
      this.getMinXAsTimeInSecs(),
      this.getMaxXAsTimeInSecs(),
      this.x,
      this.width
    );
    //print("xVal", xVal, "timeInSecs", timeInSecs, "minX", this.getMinXAsTimeInSecs(), "maxX", this.getMaxXAsTimeInSecs());
    return xVal;
  }

  drawXAxisTicksAndLabels() {
    push();

    // ** Draw x axis ticks and labels **
    let xTickBufferInPixels = 15;
    textSize(this.axisLabelsTextSize);
    for (let i = this.xTicks.length - 1; i >= 0; i--) {
      let xTickInSecs = this.xTicks[i];
      let xTick = this.getXPixelFromTimeInSecs(xTickInSecs);
      let y1 = this.getBottom() - this.tickLength;
      let y2 = this.getBottom();
      //print(xTick, y1, xTick, y2);

      stroke(220);
      noFill();
      line(xTick, y1, xTick, y2);

      noStroke();
      fill(220);
      let xTickStr = xTickInSecs + "s";
      let xTickStrWidth = textWidth(xTickStr);
      let xTickStrPos = xTick - xTickStrWidth / 2;
      text(xTickStr, xTickStrPos, this.getBottom() - (this.tickLength + 2));

      if (xTick < this.x) {
        let removedXTick = this.xTicks.splice(i, 1);
        this.xTicks.push(
          this.xTicks[this.xTicks.length - 1] + this.xTickEveryNSec
        );
      }
    }

    pop();
  }
}

class MinMaxRange {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  getRange() {
    return this.max - this.min;
  }

  getAbsRange() {
    return abs(this.getRange());
  }
}

const COLORSCHEME = {
  GRAYSCALE: "grayscale",
  PURPLEICE: "purpleice",
  RAINBOW: "rainbow",
  CUSTOM: "custom",
};

// TODO:
// - polish and change SoundVisualizer to ScrollingSoundVisualizer?
//   and move some of the offscreen buffer code there?
// - [done] erase offscreenbuffer once fully offscreen
class ScrollingWaveform extends SoundVisualizer {
  constructor(x, y, width, height, backgroundColor, lengthInSeconds) {
    super(x, y, width, height, backgroundColor, lengthInSeconds);

    this.colorScheme = COLORSCHEME.GRAYSCALE;
    this.strokeColor = color(255);

    // the scrolling waveform works by drawing on offscreen graphics
    // which is crucial to performance! the idea here is that we
    // draw each spectrum buffer once and only once to the offscreen
    // buffer and then just "paint" this image to the screen (which is fast)
    // we need two offscreen buffers to support our scrolling effect.
    this.offscreenGfxBuffer1 = createGraphics(this.width, this.height);
    this.offscreenGfxBuffer2 = createGraphics(this.width, this.height);

    this.offscreenGfxBuffer1.x = 0;
    this.offscreenGfxBuffer2.x = this.offscreenGfxBuffer1.width;

    this.resetGraphicsBuffer(this.offscreenGfxBuffer1);
    this.resetGraphicsBuffer(this.offscreenGfxBuffer2);

    this.previousOffScreenBuffer = this.offscreenGfxBuffer1;
  }

  resetGraphicsBuffer(gfxBuffer, clearColor) {
    gfxBuffer.push();

    if (clearColor) {
      gfxBuffer.background(clearColor);
    } else {
      gfxBuffer.background(this.backgroundColor);
    }

    gfxBuffer.pop();

    gfxBuffer.strokeWeight(1);
    gfxBuffer.stroke(this.strokeColor);
    gfxBuffer.noFill();
  }

  setupAndGetOffScreenBuffer(xBufferVal) {
    let selectOffscreenBuffer = int(xBufferVal / this.width) % 2;
    let offScreenBuffer = this.offscreenGfxBuffer1;
    let xVal = xBufferVal - floor(xBufferVal / this.width) * this.width;

    if (xBufferVal >= this.width) {
      // if we're here, then we need to start moving the offscreen gfx buffers
      // and swapping between them
      if (selectOffscreenBuffer == 0) {
        offScreenBuffer = this.offscreenGfxBuffer1;

        let newXPosForGfxBuffer1 = this.width - xVal;
        if (this.offscreenGfxBuffer1.x < newXPosForGfxBuffer1) {
          // if we're here, then this graphics buffer just looped around
          // and needs to be cleared
          this.resetGraphicsBuffer(this.offscreenGfxBuffer1); // color(100, 0, 0)
        }

        this.offscreenGfxBuffer1.x = newXPosForGfxBuffer1;
        this.offscreenGfxBuffer2.x = this.width - (xVal + this.width);
      } else {
        offScreenBuffer = this.offscreenGfxBuffer2;

        let newXPosForGfxBuffer2 = this.width - xVal;
        if (this.offscreenGfxBuffer2.x < newXPosForGfxBuffer2) {
          // if we're here, then this graphics buffer just looped around
          // and needs to be cleared
          this.resetGraphicsBuffer(this.offscreenGfxBuffer2); // color(100, 0, 100)
        }

        this.offscreenGfxBuffer1.x = this.width - (xVal + this.width);
        this.offscreenGfxBuffer2.x = newXPosForGfxBuffer2;
      }
    }

    return offScreenBuffer;
  }

  getColorForWaveformValue(waveformVal) {
    //TODO fix and test this
    colorMode(HSB);
    if (this.colorScheme == COLORSCHEME.GRAYSCALE) {
      return color(0, 0, 100);
    } else if (this.colorScheme == COLORSCHEME.RAINBOW) {
      let hue = map(waveformVal, 0, 1, 280, 0);
      return color(hue, 80, 90);
    } else if (this.colorScheme == COLORSCHEME.PURPLEICE) {
      let hue = map(waveformVal, 0, 1, 340, 240);
      return color(hue, 80, 90);
    } else {
      return color(0, 100, 100);
    }
  }

  update(waveform) {
    let xAxisLengthInSamples = this.getXAxisLengthInSamples();
    let xIndex = this.bufferIndex;
    let xIndexWithinAxis =
      xIndex - floor(xIndex / xAxisLengthInSamples) * xAxisLengthInSamples;
    let xBufferVal = map(xIndex, 0, xAxisLengthInSamples, 0, this.width);
    let xVal = xBufferVal - floor(xBufferVal / this.width) * this.width;
    let offScreenBuffer = this.setupAndGetOffScreenBuffer(xBufferVal);
    let numSamplesInOnePixel = this.getNumSamplesInOnePixel();
    let bufferLengthInXPixels = this.convertBufferLengthToXPixels(
      waveform.length
    );

    let debugLastX = null;
    let debugI = 0;
    let prevOffScreenBuffer = offScreenBuffer;

    // TODO:
    //  - Investigate and then address drawing across offscreen gfx buffer seams
    //  - Investigate and address starting shape with prev last vertex

    let swappedBuffers = false;
    let maxWaveformVal = max(waveform);
    offScreenBuffer.colorMode(HSB);

    // TODO integrate color schemes
    //rainbow
    //let hue = map(maxWaveformVal, 0, 1, 280, 0);

    // purple ice
    //let hue = map(maxWaveformVal, 0, 1, 340, 240);
    let col = this.getColorForWaveformValue(maxWaveformVal);
    offScreenBuffer.stroke(col);

    offScreenBuffer.beginShape();
    for (let waveformVal of waveform) {
      xBufferVal = map(xIndex, 0, xAxisLengthInSamples, 0, this.width);
      xIndexWithinAxis =
        xIndex - floor(xIndex / xAxisLengthInSamples) * xAxisLengthInSamples;
      offScreenBuffer = this.setupAndGetOffScreenBuffer(xBufferVal);

      if (prevOffScreenBuffer != offScreenBuffer) {
        prevOffScreenBuffer.endShape();

        //hue = map(maxWaveformVal, 0, 1, 360, 240);
        //offScreenBuffer.stroke(hue, 80, 90);

        col = this.getColorForWaveformValue(maxWaveformVal);
        offScreenBuffer.stroke(col);

        offScreenBuffer.beginShape();
        prevOffScreenBuffer = offScreenBuffer;
        swappedBuffers = true;
      } else {
        swappedBuffers = false;
      }

      let x = map(xIndexWithinAxis, 0, xAxisLengthInSamples, 0, this.width);
      let y = map(waveformVal, -1, 1, this.getBottom(), this.y);

      offScreenBuffer.vertex(x, y);

      xIndex++;

      if (debugLastX != null && abs(debugLastX - x) > 10) {
        print(
          "swappedBuffers",
          swappedBuffers,
          "x",
          x,
          "y",
          y,
          "lastX",
          debugLastX,
          "i",
          debugI,
          "waveform.length",
          waveform.length,
          "this.width",
          this.width
        );
        print(
          "xBufferVal",
          xBufferVal,
          "xIndex",
          xIndex,
          "xIndexWithinAxis",
          xIndexWithinAxis
        );
        let selectOffscreenBuffer = int(xBufferVal / this.width) % 2;
        print(
          "...start swapping buffers; xBufferVal",
          xBufferVal,
          "this.width",
          this.width,
          "selectOffscreenBuffer",
          selectOffscreenBuffer
        );
      }

      debugLastX = x;
      debugI++;
    }
    offScreenBuffer.endShape();

    this.previousOffScreenBuffer = offScreenBuffer;

    super.update(waveform);
  }

  draw() {
    // draw our offscreen buffers to the screen!
    image(this.offscreenGfxBuffer1, this.offscreenGfxBuffer1.x, this.y);
    image(this.offscreenGfxBuffer2, this.offscreenGfxBuffer2.x, this.y);
  }
}

class Spectrogram extends SoundVisualizer {
  constructor(x, y, width, height, backgroundColor, lengthInSeconds) {
    super(x, y, width, height, backgroundColor, lengthInSeconds);

    // the spectrogram works by drawing on offscreen graphics
    // which is crucial to performance! the idea here is that we
    // draw each spectrum buffer once and only once to the offscreen
    // buffer and then just "paint" this image to the screen (which is fast)
    // we need two offscreen buffers to support our scrolling effect.
    this.offscreenGfxBuffer1 = createGraphics(this.width, this.height);
    this.offscreenGfxBuffer2 = createGraphics(this.width, this.height);

    this.offscreenGfxBuffer1.x = 0;
    this.offscreenGfxBuffer2.x = this.offscreenGfxBuffer1.width;

    this.resetGraphicsBuffer(this.offscreenGfxBuffer1);
    this.resetGraphicsBuffer(this.offscreenGfxBuffer2);
    this.spectrum = null;

    this.colorScheme = COLORSCHEME.GRAYSCALE;
  }

  resetGraphicsBuffer(gfxBuffer) {
    gfxBuffer.push();
    gfxBuffer.background(this.backgroundColor);
    gfxBuffer.pop();
  }

  update(spectrum) {
    this.spectrum = spectrum; // grab cur ref to spectrum

    // convert buffer index to x pixel position in offscreen buffer
    let xBufferVal = map(
      this.bufferIndex,
      0,
      this.getXAxisLengthInSamples(),
      0,
      this.width
    );
    let xVal = xBufferVal - int(xBufferVal / this.width) * this.width;
    // print("xVal", xVal, "xVal/width", nfc((xVal / this.width),2),
    //       "gfx", int(xVal / this.width) % 2, "newX", xBufferVal - (int(xBufferVal / this.width))*this.width);

    let selectOffscreenBuffer = int(xBufferVal / this.width) % 2;
    //print("selectOffscreenBuffer", selectOffscreenBuffer);
    let offScreenBuffer = this.offscreenGfxBuffer1;

    // TODO: add in a clear for the offscreen background?
    if (xBufferVal > this.width) {
      if (selectOffscreenBuffer == 0) {
        offScreenBuffer = this.offscreenGfxBuffer1;
        this.offscreenGfxBuffer1.x = this.width - xVal;
        this.offscreenGfxBuffer2.x = this.width - (xVal + this.width);
      } else {
        offScreenBuffer = this.offscreenGfxBuffer2;
        this.offscreenGfxBuffer1.x = this.width - (xVal + this.width);
        this.offscreenGfxBuffer2.x = this.width - xVal;

        //print("this.offscreenGfxBuffer1.x", this.offscreenGfxBuffer1.x, "this.offscreenGfxBuffer2.x", this.offscreenGfxBuffer2.x);
      }
    }

    offScreenBuffer.push();
    offScreenBuffer.strokeWeight(1);
    offScreenBuffer.noFill();

    if (
      this.colorScheme == COLORSCHEME.RAINBOW ||
      this.colorScheme == COLORSCHEME.PURPLEICE
    ) {
      offScreenBuffer.colorMode(HSB);
    } else {
      offScreenBuffer.colorMode(RGB);
    }

    let bufferLengthInXPixels = this.convertBufferLengthToXPixels(
      spectrum.length
    );
    for (let i = 0; i < spectrum.length; i++) {
      let y = map(i, 0, spectrum.length, this.height, 0);
      //let col = map(spectrum[i], 0, 255, blue(this.backgroundColor), 255);
      let col;
      if (this.colorScheme == COLORSCHEME.RAINBOW) {
        let hue = map(spectrum[i], 0, 255, 0, 360);
        col = offScreenBuffer.color(hue, 80, 80);
      } else if (this.colorScheme == COLORSCHEME.PURPLEICE) {
        let hue = map(spectrum[i], 0, 255, 240, 360);
        col = offScreenBuffer.color(hue, 80, 90);
      } else {
        col = map(spectrum[i], 0, 255, blue(this.backgroundColor), 255);
      }
      offScreenBuffer.stroke(col);

      // TODO: if spectrum.length > this.height, draw rect instead of point or line
      if (bufferLengthInXPixels <= 1) {
        offScreenBuffer.point(xVal, y);
      } else {
        //TODO: this works *most* of the time unless the x1 and x2 values
        //fall exactly on the crease between the two offscreen buffers
        offScreenBuffer.line(xVal, y, xVal + bufferLengthInXPixels, y);
      }
    }
    //print(spectrum);

    offScreenBuffer.pop();

    //this.bufferIndex += spectrum.length;
    super.update(spectrum);
    //noLoop();
  }

  draw() {
    // draw our offscreen buffers to the screen!
    image(this.offscreenGfxBuffer1, this.offscreenGfxBuffer1.x, this.y);
    image(this.offscreenGfxBuffer2, this.offscreenGfxBuffer2.x, this.y);

    if (this.bDrawAxes) {
      this.drawAxes();
    }
  }

  drawAxes() {
    if (this.spectrum) {
      push();

      // ** Draw y axis ticks and labels **

      // The frequency resolution of each spectral line is equal to the
      // Sampling Rate divided by the FFT size
      // And according to the p5js docs, actual size of the FFT buffer is twice the
      // number of bins: https://p5js.org/reference/#/p5.FFT. Hmm, confusing! :)
      let fftBufferSize = 2 * this.spectrum.length;
      let nyquistFreq = this.samplingRate / 2.0;
      let freqResolution = nyquistFreq / this.spectrum.length;
      let freqRangeOfEachYPixel = nyquistFreq / this.height;
      let yTickFreqInPixels = 50;

      noFill();
      textSize(this.axisLabelsTextSize);
      //print("this.getTop()", this.getTop(), "this.getBottom()", this.getBottom());
      for (
        let yTick = this.getTop();
        yTick <= this.getBottom();
        yTick += yTickFreqInPixels
      ) {
        stroke(220);
        let yVal = this.getBottom() - yTick;
        let yFreqVal = yVal * freqRangeOfEachYPixel;
        line(this.x, yTick, this.x + this.tickLength, yTick);
        //print(this.x, yTick, this.x + tickLength, yTick);

        noStroke();
        fill(220);
        let xText = this.x + this.tickLength + 3;
        text(nfc(yFreqVal, 1) + " Hz", xText, yTick + 2.5);
        //print(yVal, yFreqVal);
      }
      pop();

      // draw x axis ticks and labels
      this.drawXAxisTicksAndLabels();
    }

    // print(nfc(this.convertBufferIndexToTime(this.bufferIndex), 1) +
    //       " secs " + this.convertBufferIndexToXPixel(this.bufferIndex));

    //let minXAsTime = this.getMinXAsTimeInSecs();
    //let maxXAsTime = this.getMaxXAsTimeInSecs();
    //print("minXAsTime", minXAsTime, "maxXAsTime", maxXAsTime, "length", (maxXAsTime - minXAsTime));
  }
}

class SpectrumBarGraph extends Rectangle {
  // see: https://p5js.org/reference/#/p5.FFT
  constructor(x, y, width, height, backgroundColor) {
    super(x, y, width, height, backgroundColor);

    this.spectrum = null;
    this.samplingRate = sampleRate();
    this.spectrumBars = [];

    this.mapSpectrumBars = new Map();

    this.mapSpectrumBarPeaks = new Map();

    this.strokeColor = color(255);
    this.fillColor = color(180);
    this.colorScheme = COLORSCHEME.GRAYSCALE;
    this.setFadeBackground(false);
  }

  update(spectrum) {
    this.spectrum = spectrum;

    let nyQuistFreq = this.samplingRate / 2.0;
    let numBars = floor(Math.log2(nyQuistFreq));
    let freqResolution = nyQuistFreq / this.spectrum.length;
    //print("Nyquist is", nyQuistFreq, "Hz and numBars=", numBars);
    //print("freqResolution", freqResolution);

    // calculate spectrum bars
    let mapSpectrumBarGraphBinToValues = new Map();
    for (let i = 1; i < this.spectrum.length; i++) {
      let freqAtSpectralBin = freqResolution * i;
      let barGraphBin = floor(Math.log2(freqAtSpectralBin));

      //print("freqAtSpectralBin", freqAtSpectralBin, "barGraphBin", barGraphBin);

      let valuesAtBin = [];
      if (!mapSpectrumBarGraphBinToValues.has(barGraphBin)) {
        mapSpectrumBarGraphBinToValues.set(barGraphBin, valuesAtBin);
        //print("Made a new bin at", barGraphBin);
      }

      valuesAtBin = mapSpectrumBarGraphBinToValues.get(barGraphBin);
      let spectralIntensity = this.spectrum[i];
      valuesAtBin.push(spectralIntensity);
    }

    for (let [
      barGraphBin,
      barGraphBinValues,
    ] of mapSpectrumBarGraphBinToValues) {
      // print(barGraphBin + ' = ' + barGraphBinValues)
      let sumOfValuesAtBin = barGraphBinValues.reduce((a, b) => a + b);
      let avgAtBin = sumOfValuesAtBin / barGraphBinValues.length;
      //print("sumOfValuesAtBin", sumOfValuesAtBin, "avgAtBin", avgAtBin);
      this.spectrumBars[barGraphBin] = avgAtBin;

      this.mapSpectrumBars.set(barGraphBin, avgAtBin);

      // check for peaks
      if (!this.mapSpectrumBarPeaks.has(barGraphBin)) {
        this.mapSpectrumBarPeaks.set(barGraphBin, avgAtBin);
      } else {
        let peakValue = this.mapSpectrumBarPeaks.get(barGraphBin);
        if (peakValue < avgAtBin) {
          this.mapSpectrumBarPeaks.set(barGraphBin, avgAtBin);
        } else {
          // start dropping the peak (results in animating peaks downward)
          this.mapSpectrumBarPeaks.set(barGraphBin, peakValue - 2);
        }
      }
    }
  }

  getMaxFreqAtBin(binIndex) {
    let minFreqAtBin = pow(2, binIndex);
    let maxFreqAtBin = pow(2, binIndex + 1);
    let nyQuistFreq = this.samplingRate / 2.0;
    if (maxFreqAtBin > nyQuistFreq) {
      maxFreqAtBin = nyQuistFreq;
    }
    return maxFreqAtBin;
  }

  //todo: maybe add min max here to make more reusuable?
  getFillColorForValue(val) {
    colorMode(HSB); //TODO should we just be setting colorMode like this?
    if (this.colorScheme == COLORSCHEME.GRAYSCALE) {
      return color(0, 0, 100);
    } else if (this.colorScheme == COLORSCHEME.RAINBOW) {
      let hue = map(val, 0, 255, 280, 0);
      return color(hue, 80, 90);
    } else if (this.colorScheme == COLORSCHEME.PURPLEICE) {
      let hue = map(val, 0, 255, 240, 340);
      return color(hue, 80, 90);
    } else {
      return this.fillColor;
    }
  }

  getStrokeColorForValue(val) {
    colorMode(HSB); //TODO should we just be setting colorMode like this?
    if (this.colorScheme == COLORSCHEME.GRAYSCALE) {
      return color(0, 0, 100);
    } else if (this.colorScheme == COLORSCHEME.RAINBOW) {
      let hue = map(val, 0, 255, 280, 0);
      return color(hue, 80, 90);
    } else if (this.colorScheme == COLORSCHEME.PURPLEICE) {
      let hue = map(val, 0, 255, 240, 340);
      return color(hue, 80, 90);
    } else {
      return this.strokeColor;
    }
  }

  setFadeBackground(turnOnFadeBackground) {
    if (turnOnFadeBackground) {
      this.backgroundColor = color(
        red(this.backgroundColor),
        green(this.backgroundColor),
        blue(this.backgroundColor),
        15
      );
    } else {
      this.backgroundColor = color(
        red(this.backgroundColor),
        green(this.backgroundColor),
        blue(this.backgroundColor)
      );
    }
  }

  draw() {
    push();

    // fill background
    noStroke();
    fill(this.backgroundColor);
    rect(this.x, this.y, this.width, this.height);

    let maxBarWidth = this.width / this.mapSpectrumBars.size;
    //print("this.width", this.width);
    //print("maxBarWidth", maxBarWidth, "this.mapSpectrumBars.size", this.mapSpectrumBars.size);
    let xPixelBufferBetweenBars = 2;
    let barWidth = max(1, maxBarWidth - xPixelBufferBetweenBars);
    let xBar = this.x;

    textSize(6);
    for (let [bin, binValue] of this.mapSpectrumBars) {
      let barHeight = map(binValue, 0, 255, 0, this.height);
      let yBar = this.getBottom() - barHeight;

      //fill(180);
      let fillColor = this.getFillColorForValue(binValue);
      fill(fillColor);
      noStroke();
      rect(xBar, yBar, barWidth, barHeight);
      //print(xBar, yBar, barWidth, barHeight);

      // get peak
      //stroke(255);
      let peakVal = this.mapSpectrumBarPeaks.get(bin);
      let strokeColor = this.getFillColorForValue(peakVal);
      stroke(strokeColor);
      let yPeak = map(peakVal, 0, 255, this.getBottom(), this.getTop());
      line(xBar, yPeak, xBar + barWidth, yPeak);

      // draw text
      fill(250);
      noStroke();
      let lbl = this.getMaxFreqAtBin(bin);

      lbl = nfc(lbl, 0);
      if (xBar == this.x) {
        lbl += " Hz"; // add Hz to first x label
      }

      let lblWidth = textWidth(lbl);
      let xLbl = xBar + barWidth / 2 - lblWidth / 2;
      text(lbl, xLbl, this.getBottom() - 2);

      xBar += maxBarWidth;
    }

    pop();
  }
}

class SpectrumVisualizer extends Rectangle {
  // see: https://p5js.org/reference/#/p5.FFT
  constructor(x, y, width, height, backgroundColor) {
    super(x, y, width, height, backgroundColor);

    print("Created SpectrumVisualizer:", x, y, width, height);

    this.spectrum = null;
    this.samplingRate = sampleRate();

    this.spectrumPeaks = null;

    // in secs, amount of spectrum history to save
    // this is used to calculate the average spectrum
    this.spectrumHistoryTime = 1;
    this.spectrumHistory = [];
    this.spectrumAvg = [];

    this.isStrokeOn = true;
    this.isFillOn = true;

    this.colorScheme = COLORSCHEME.GRAYSCALE;
    this.strokeColor = color(255);
    this.setupColors();
  }

  setupColors() {
    if (this.colorScheme == COLORSCHEME.CUSTOM) {
      // no op; in this mode, we let user select color via this.strokeColor
    } else if (this.colorScheme == COLORSCHEME.PURPLEICE) {
      colorMode(HSB);
      this.spectrumStrokeColor = color(340, 80, 90, 0.8);
      this.spectrumPeaksStrokeColor = color(240, 80, 90);
      this.spectrumAvgStrokeColor = color(280, 80, 90);

      colorMode(RGB);
      this.spectrumFillColor = color(
        red(this.spectrumStrokeColor),
        green(this.spectrumStrokeColor),
        blue(this.spectrumStrokeColor),
        120
      );
      this.spectrumPeaksFillColor = color(
        red(this.spectrumPeaksStrokeColor),
        green(this.spectrumPeaksStrokeColor),
        blue(this.spectrumPeaksStrokeColor),
        140
      );
      this.spectrumAvgFillColor = color(
        red(this.spectrumAvgStrokeColor),
        green(this.spectrumAvgStrokeColor),
        blue(this.spectrumAvgStrokeColor),
        150
      );
    } else if (this.colorScheme == COLORSCHEME.RAINBOW) {
      colorMode(HSB);
      this.spectrumStrokeColor = color(50, 80, 90, 0.8);
      this.spectrumPeaksStrokeColor = color(0, 80, 90);
      this.spectrumAvgStrokeColor = color(200, 80, 90);

      colorMode(RGB);
      this.spectrumFillColor = color(
        red(this.spectrumStrokeColor),
        green(this.spectrumStrokeColor),
        blue(this.spectrumStrokeColor),
        120
      );
      this.spectrumPeaksFillColor = color(
        red(this.spectrumPeaksStrokeColor),
        green(this.spectrumPeaksStrokeColor),
        blue(this.spectrumPeaksStrokeColor),
        140
      );
      this.spectrumAvgFillColor = color(
        red(this.spectrumAvgStrokeColor),
        green(this.spectrumAvgStrokeColor),
        blue(this.spectrumAvgStrokeColor),
        150
      );
    } else {
      //default to grayscale
      colorMode(RGB);
      this.spectrumStrokeColor = color(225, 225, 225, 150);
      this.spectrumPeaksStrokeColor = color(50);
      this.spectrumAvgStrokeColor = color(160);

      this.spectrumFillColor = color(
        red(this.spectrumStrokeColor),
        green(this.spectrumStrokeColor),
        blue(this.spectrumStrokeColor),
        50
      );
      this.spectrumPeaksFillColor = color(
        red(this.spectrumPeaksStrokeColor),
        green(this.spectrumPeaksStrokeColor),
        blue(this.spectrumPeaksStrokeColor),
        128
      );
      this.spectrumAvgFillColor = color(
        red(this.spectrumAvgStrokeColor),
        green(this.spectrumAvgStrokeColor),
        blue(this.spectrumAvgStrokeColor),
        128
      );
    }
  }

  update(spectrum) {
    this.spectrum = spectrum;
    this.setupColors();

    let bufferLengthInSecs = spectrum.length / this.samplingRate;
    let numOfHistoricalRecords = int(
      this.spectrumHistoryTime / bufferLengthInSecs
    );
    this.spectrumHistory.push(this.spectrum);

    //print("Saving", numOfHistoricalRecords, " records");

    if (this.spectrumHistory.length > numOfHistoricalRecords) {
      let deleteCount = this.spectrumHistory.length - numOfHistoricalRecords;
      let removedRecords = this.spectrumHistory.splice(0, deleteCount);
    }

    // calculate average for each index
    // See: https://stackoverflow.com/a/32141173

    let calculateVerticalSum = (r, a) => r.map((b, i) => a[i] + b);
    let spectrumSums = this.spectrumHistory.reduce(calculateVerticalSum);

    // This is the same code as above but doing it the more "traditional way"
    // let spectrumSums = new Array(this.spectrum.length).fill(0);;
    // for(let col = 0; col < this.spectrum.length; col++){
    //   for(let row = 0; row < this.spectrumHistory.length; row++){
    //     spectrumSums[col] += this.spectrumHistory[row][col];
    //   }
    // }

    for (let i = 0; i < spectrumSums.length; i++) {
      this.spectrumAvg[i] = spectrumSums[i] / numOfHistoricalRecords;
    }

    if (this.spectrumPeaks == null) {
      this.spectrumPeaks = this.spectrum;
    }

    for (let i = 0; i < this.spectrumPeaks.length; i++) {
      if (this.spectrumPeaks[i] < this.spectrum[i]) {
        this.spectrumPeaks[i] = this.spectrum[i];
      }
    }
  }

  draw() {
    if (this.spectrum) {
      push();

      // draw background
      noStroke();
      fill(this.backgroundColor);
      rect(this.x, this.y, this.width, this.height);

      // draw spectrums
      this.drawSpectrum(
        this.spectrumPeaks,
        this.spectrumPeaksFillColor,
        this.spectrumPeaksStrokeColor
      );
      this.drawSpectrum(
        this.spectrumAvg,
        this.spectrumAvgFillColor,
        this.spectrumAvgFillColor
      );
      this.drawSpectrum(
        this.spectrum,
        this.spectrumFillColor,
        this.spectrumStrokeColor
      );

      pop();

      this.drawAxes();
    }
  }

  drawSpectrum(spectrum, fillColor, strokeColor) {
    //noFill();
    if (this.isFillOn && fillColor) {
      fill(fillColor);
    } else {
      noFill();
    }

    if (this.isStrokeOn && strokeColor) {
      stroke(strokeColor);
    } else {
      noStroke();
    }

    beginShape();
    vertex(this.getLeft(), this.getBottom());
    for (let i = 0; i < spectrum.length; i++) {
      let x = map(i, 0, spectrum.length, this.x, this.getRight());
      let y = map(spectrum[i], 0, 255, this.getBottom(), this.y);
      vertex(x, y);
    }
    vertex(this.getRight(), this.getBottom());
    endShape();
  }

  drawAxes() {
    // draw x axis
    // TODO: finish this

    // The frequency resolution of each spectral line is equal to the
    // Sampling Rate divided by the FFT size
    let nyQuistFreq = this.samplingRate / 2.0;
    let freqResolution = nyQuistFreq / this.spectrum.length;

    //print(freqResolution);
  }
}

class InstantWaveformVis extends SoundVisualizer {
  // see: https://p5js.org/reference/#/p5.FFT
  constructor(x, y, width, height, backgroundColor, lengthInSeconds) {
    super(x, y, width, height, backgroundColor, lengthInSeconds);
    this.waveform = null;
    this.maxWaveformVal = 0;

    // create fade
    // TODO: still experimenting
    this.setFadeBackground(true);
    this.strokeColor = color(255);
    this.colorScheme = COLORSCHEME.GRAYSCALE;
  }

  setFadeBackground(turnOnFadeBackground) {
    if (turnOnFadeBackground) {
      this.backgroundColor = color(
        red(this.backgroundColor),
        green(this.backgroundColor),
        blue(this.backgroundColor),
        20
      );
    } else {
      this.backgroundColor = color(
        red(this.backgroundColor),
        green(this.backgroundColor),
        blue(this.backgroundColor)
      );
    }
  }

  getColorForWaveformValue(waveformVal) {
    //TODO fix and test this
    colorMode(HSB);
    if (this.colorScheme == COLORSCHEME.GRAYSCALE) {
      return color(0, 0, 100);
    } else if (this.colorScheme == COLORSCHEME.RAINBOW) {
      let hue = map(waveformVal, 0, 1, 280, 0);
      return color(hue, 80, 90);
    } else if (this.colorScheme == COLORSCHEME.PURPLEICE) {
      let hue = map(waveformVal, 0, 1, 340, 240);
      return color(hue, 80, 90);
    } else {
      return this.strokeColor;
    }
  }

  // not sure if I should pass the fft reference to InstanveWaveformVis
  // in the constructor or this waveform in update
  update(waveform) {
    // clone array by slice: https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array/
    this.waveform = waveform.slice();
    this.maxWaveformVal = max(waveform);
    this.strokeColor = this.getColorForWaveformValue(this.maxWaveformVal);
  }

  draw() {
    if (this.waveform) {
      push();

      // draw background
      noStroke();
      fill(this.backgroundColor);
      rect(this.x, this.y, this.width, this.height);

      noFill();
      beginShape();
      //stroke(255);
      stroke(this.strokeColor);
      strokeWeight(3);
      for (let i = 0; i < this.waveform.length; i++) {
        let x = map(i, 0, this.waveform.length, this.x, this.width);
        let y = map(this.waveform[i], -1, 1, this.getBottom(), this.y);
        vertex(x, y);
      }
      endShape();
      pop();
    }
  }
}
