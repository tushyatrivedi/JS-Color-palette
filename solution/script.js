document.getElementById('generate').addEventListener('click', function() {
  // 2.1 Retrieve the Palette Element
    const palette = document.getElementById('palette');
  // 2.2 Clear Pre-existing Palette
    palette.innerHTML = ''; // Clear existing colors
  // 2.3 Set up a Loop to Generate Colors
    for (let i = 0; i < 5; i++) { // Generate 5 colors
      // 3.1 Generate a Random Hexadecimal Color Code
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      // 3.2 Create a New <div> Element
        const div = document.createElement('div');
        div.style.backgroundColor = color;
      // 3.3 Create a New <span> Element
        const span = document.createElement('span');
        span.textContent = color;
      // 3.4 Append the <span> to the <div>
        div.appendChild(span);
      // 3.5 Append the <div> to the palette Element
        palette.appendChild(div);
      // 5.1 Add an Event Listener to Each Color Segment
        div.addEventListener('click', function() {
          // 5.2 Copy the Color Code to the Clipboard and Display a Notification
            navigator.clipboard.writeText(color);
            showNotification('Copied ' + color);
        });
    }
});

function showNotification(message) {
  // 4.1 Create a New <div> Element
    const notification = document.createElement('div');
    notification.className = 'notification';
  // 4.2 Set the Text Content of the Notification <div>
    notification.textContent = message;
  // 4.3 Append the Notification <div> to the Document Body
    document.body.appendChild(notification);
  // 4.4 Set the Display Style of the Notification <div> to 'block'
    notification.style.display = 'block';
  // 4.5 Set a Timer to Execute a Function After a Specified Time Interval
    setTimeout(function() {
      // 4.6 Remove the Notification <div> from the Document Body
        notification.style.display = 'none';
        document.body.removeChild(notification);
    }, 20000);
}
