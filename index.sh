#!/bin/bash
cat << EOF > game.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">

  <script src="MIDI.js/build/MIDI.js" type="text/javascript"></script>


  <!-- polyfill -->
  <script src="MIDI.js/inc/shim/Base64.js" type="text/javascript"></script>
  <script src="MIDI.js/inc/shim/Base64binary.js" type="text/javascript"></script>
  <script src="MIDI.js/inc/shim/WebAudioAPI.js" type="text/javascript"></script>
  <!-- midi.js package -->
  <script src="MIDI.js/js/midi/audioDetect.js" type="text/javascript"></script>
  <script src="MIDI.js/js/midi/gm.js" type="text/javascript"></script>
  <script src="MIDI.js/js/midi/loader.js" type="text/javascript"></script>
  <script src="MIDI.js/js/midi/plugin.audiotag.js" type="text/javascript"></script>
  <script src="MIDI.js/js/midi/plugin.webaudio.js" type="text/javascript"></script>
  <script src="MIDI.js/js/midi/plugin.webmidi.js" type="text/javascript"></script>
  <!-- utils -->
  <script src="MIDI.js/js/util/dom_request_xhr.js" type="text/javascript"></script>
  <script src="MIDI.js/js/util/dom_request_script.js" type="text/javascript"></script>

</head>
<body>
  <canvas  oncontextmenu="return false;"></canvas>
EOF

for file in $(ls js); do
  echo "<script src='js/$file'></script>" >> game.html
done

cat << EOF >> game.html
</body>
</html>
EOF
