(function() {

    window.addEventListener("load", function(event) {
        function EventData(type, timeStamp, data) {
            this.type = type;
            this.timeStamp = timeStamp;
            this.data = data;
        }

        function keyboardFilter(event) {
            return new EventData(event.type, event.timeStamp, {
                key: event.key,
                keyCode: event.keyCode,
                ctrl: event.ctrlKey,
                alt: event.altKey,
                meta: event.metaKey,
                shift: event.shiftKey,
            });
        }

        function mouseFilter(event) {
            return new EventData(event.type, event.timeStamp, {
                x: event.clientX,
                y: event.clientY,
                ctrl: event.ctrlKey,
                alt: event.altKey,
                meta: event.metaKey,
                shift: event.shiftKey
            });
        }

        function attachHandler(target, type, filter) {
            target.addEventListener(type, function(event) {
                buffer_event(event, filter);
            }, true)
        }

        var html = document.documentElement;
        //attachHandler(html, "keydown", keyboardFilter);
        //attachHandler(html, "keypress", keyboardFilte;r)
        //attachHandler(html, "keyup", keyboardFilter);
        attachHandler(html, "click", mouseFilter);
        //attachHandler(html, "mouseenter", keyboardFilter);
        //attachHandler(html, "mouseleave", keyboardFilter);
        //attachHandler(html, "mouseover", keyboardFilter);
        //attachHandler(html, "mouseout", keyboardFilter);
        //attachHandler(html, "mousemouve", keyboardFilter);

        // Event logging
        var eventSequence = 0;
        var lastSent = 0;
        var buffer = [];

        function send_event (event_buffer) {
          if (event_buffer.length == 0) {
            console.log('Buffer was empty')
            return false;
          }

          var httpRequest = new XMLHttpRequest();
          httpRequest.open('POST', 'http://localhost:9000/data');
          httpRequest.setRequestHeader('Content-Type', 'application/json');
          httpRequest.send(JSON.stringify({
              eventSequence: eventSequence, 
              events: event_buffer
          }));
        }

        // Save and clear the buffer
        function send_buffer () {
          tmp = buffer.slice();
          buffer = [];

          send_event(tmp);
        }

        // Send periodically
        setInterval(function(){
          console.log('Interval send');
          send_buffer();
        }, 5000);

        window.addEventListener("onbeforeunload",function() {
          lastSent = 0;
          console.log('Leaving page');
          send_buffer();
        })

        function buffer_event(e, filter) {
          eventSequence++;
          buffer.push(filter(e));

          if (buffer.length > 50 || lastSent < e.timeStamp - 3000) {
            // Update last sent
            lastSent = e.timeStamp

            // Send the shit
            send_buffer(buffer);
          }
        }
    });
})();
