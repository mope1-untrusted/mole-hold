#!/bin/bash
cat << EOF > index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas  oncontextmenu="return false;"></canvas>
EOF

for file in $(ls js); do
  echo "<script src='js/$file'></script>" >> index.html
done

cat << EOF >> index.html
</body>
</html>
EOF
