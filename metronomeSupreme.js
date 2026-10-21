// Metronome: beeps at `bpm` while the face is on screen.
// L = -1 bpm, A = +1 bpm on release. Long-press either button to keep
// stepping every 100 ms until it's released.
var bpm = 80, tickId = -1, repeatId = -1, dir = 0, a_press = 0, l_press = 0, tapId = 1, state = 1, sub = 0, counter = 0, compas = 0;
var MIN_BPM = 20, MAX_BPM = 300, REPEAT_MS = 100;
const subscribe = E_BUTTONS + E_A_LONG + E_L_LONG + E_A_SHORT + E_L_SHORT + E_TAP;
let pressTimer;
var previousState;

function show() {
  Ollee.drawMain((bpm).toString() + "  " +(compas).toString());
  Ollee.drawDay(sub + 1)
}

function stopTimer(id) {
  if (id !== -1) Ollee.clearInterval(id);
  return -1;
}

function startTicking() {
  tickId = stopTimer(tickId);
  tickId = Ollee.setInterval('compasf()', Math.round(60000 / ((sub+1) * bpm)));
}

function step(d) {
  bpm = Math.min(MAX_BPM, Math.max(MIN_BPM, bpm + d));
  show();
}

function stepRepeat() {
  step(dir);
}

// Long press: step now, then keep stepping every REPEAT_MS until E_UP.
function startRepeat(d) {
  repeatId = stopTimer(repeatId);
  dir = d;
  step(dir);
  repeatId = Ollee.setInterval('stepRepeat()', REPEAT_MS);
}

function a_long() { if(state == 1) {startRepeat(1);} }
function l_long() { if(state == 1) {startRepeat(-1);} }

function button(btn, evt, ms) {

    if (btn === B_A && evt === E_UP) a_press = 0;
    if (btn === B_L && evt === E_UP) l_press = 0;
    if(state == 1) {
      if (evt !== E_UP) return;
      var d = btn === B_A ? 1 : -1;
      if (d === dir) {
        // Releasing the long-pressed button ends its repeat.
        repeatId = stopTimer(repeatId);
        dir = 0;
      } else {
        // A short press counts once, on release.
        step(d);
      }
      startTicking();
    }

    if (state == -1) {
        // Releasing the long-pressed button ends its repeat.
        repeatId = stopTimer(repeatId);
        dir = 0;
      }
}

// A button pressed: beep.
function a_short() {
  a_press = 1;
  doublePress();
}

// L button pressed: beep.
function l_short() {
  l_press = 1;
  doublePress();
}

function changeSub(prevState) {
//console.log("CHANGE SUB", prevState, state, a_press, l_press);
    if ( a_press === 1 && l_press === 0 && state === prevState ) {
      startSub();
      show();
    }
  }

function changeCompas(prevState) {
//console.log("CHANGE SUB", prevState, state, a_press, l_press);
    if ( a_press === 0 && l_press === 1 && state === prevState ) {
      compasMod();
      show();
    }
  }


function doublePress() {

  if (a_press === 1 && l_press === 1) {
    Ollee.clearTimeout(pressTimer);
    console.log("DOUBLE")
    state *= -1;
    return;
  }

  if (state == -1 && a_press === 1) {
    Ollee.clearTimeout(pressTimer);
     console.log('CHANGE')
    previousState = state;

    pressTimer = Ollee.setTimeout('changeSub(previousState)', 70);
  }

  if (state == -1 && l_press ===  1) {
    Ollee.clearTimeout();
     console.log('CHANGE')
    previousState = state;

    pressTimer = Ollee.setTimeout('changeCompas(previousState)', 70);
  }
}

function startSub() {
      sub += 1;

      sub = sub%3;
      
      startTicking();
}

function compasMod() {
  compas += 1;
  
  compas = compas%7;

      startTicking();


}

function compasf() {
  

  console.log(counter)
  if (compas !== 0) {
    if (counter == 0) {Ollee.beep(); Ollee.setTimeout('Ollee.beep()',5);}

    else {Ollee.beep();}
    counter += 1;
    counter = counter%(compas*(sub+1));
    }
  else if (compas == 0) {Ollee.beep();}

}

function tap(){
//Turn on and off with tap

  if (tapId == 1){
    tickId = stopTimer(tickId);
    tapId = -1;
  }
  else if (tapId == -1){
    startTicking();
    tapId = 1;
  }
}

function enter() {
  Ollee.clear();
  show();
  startTicking();
}

function exit() {
  tickId = stopTimer(tickId);
  repeatId = stopTimer(repeatId);
  dir = 0;
}
