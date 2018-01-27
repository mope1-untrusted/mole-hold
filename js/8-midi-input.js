
var evilSpeed=1000
var evilAngle=0
function handleMidi(evt){
  var note=evt[1]-36
  console.log((note-12))
  evilSpeed+=(note-12)*0.001

  var delay = 0; // play one note every quarter second
  var note = evt[1]; // the MIDI note
  var velocity = evt[2]; // how hard the note hits

  MIDI.setVolume(0, 127);
  MIDI.noteOn(0, note, velocity, delay);
  MIDI.noteOff(0, note, delay + 0.75);

}


window.onload = function () {
  MIDI.loadPlugin({
    soundfontUrl: "MIDI.js/examples/soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function(state, progress) {
    	console.log(state, progress);
    },
    onsuccess: function() {
    	var delay = 0; // play one note every quarter second
    	var note = evt[1]; // the MIDI note
    	var velocity = evt[2]; // how hard the note hits
    	// play the note
    	MIDI.setVolume(0, 127);
    	MIDI.noteOn(0, note, velocity, delay);
    	MIDI.noteOff(0, note, delay + 0.75);
    }
  });

};
