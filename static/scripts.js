
$(document).ready(function () {
    $("#send-button").click(function () {
        sendMessage();
    });

    function sendMessage() {
        var message = $("#message-input").val();
        // Send the message to the server as a POST request
        $.post("/api", {message: message}, function (data, status) {
            // If the request was successful, display the response
            if (status == "success") {

                // Add user's message to chat box
                var user_message = "<div class='message-from-user'>" + message + "</div><div style='clear:both;'></div>";
                $("#chat-box").append(user_message);

                // Add API's response to chat box
                // var api_response = "<div class='message-from-api'><pre style='color: #00ffef; white-space: pre-wrap;'>" + data + "</pre></div><div style='clear:both;'></div>";
                var api_response = "<div class='message-from-api'><pre style='color: #00FFEF; white-space: pre-wrap;'><span class='response-text'></span><span class='response-cursor'></span></pre></div><div style='clear:both;'></div>";
                $("#chat-box").append(api_response);

                // Animate the typing of each word in the response
                var words = data.split(" ");
                $.each(words, function(index, word) {
                  setTimeout(function() {
                    $(".message-from-api").last().find("pre").append(word + " ");
                    $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight); // scroll to bottom
                  }, index * 100);
                });

                // Clear the input field
                $("#message-input").val("");

                // Scroll to the bottom of the chat box
                $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight);

                // Read API response audibly if the read-aloud button is pressed
                if (!$("#read-aloud-button").hasClass("not-pressed")) {
                    // var utterance = new SpeechSynthesisUtterance(data);
                    // utterance.voice = speechSynthesis.getVoices().find(function(voice) { return voice.name === "Google UK English Female"; });
                    // window.speechSynthesis.speak(utterance);
                    var utterance = new SpeechSynthesisUtterance(data);
                    utterance.voice = window.speechSynthesis.getVoices().find(function (voice) {
                        return voice.lang === "en-GB";
                    });
                    window.speechSynthesis.speak(utterance);
                }
            }
        });
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    function startRecording() {
        $("#message-input").attr("placeholder", "Listening...");
        recognition.start();
    }

    function stopRecording() {
        recognition.stop();
        $("#message-input").attr("placeholder", "Type your message here...");
        sendMessage();
    }

    recognition.addEventListener("result", function (e) {
        const transcript = Array.from(e.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");

        $("#message-input").val(transcript);
    });

    $("#speech-button").click(function () {
        startRecording();
    });

    recognition.addEventListener("end", function () {
        stopRecording();
    });

    $("#message-input").on("keydown", function (e) {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            $(this).blur();
        }
    });

    $("#read-aloud-button").click(function () {
        $(this).toggleClass("not-pressed");
        if ($(this).hasClass("not-pressed")) {
            $(this).html('<i class="bi bi-volume-mute-fill"></i>');
            // // Add code here to stop reading API responses audibly
            // window.speechSynthesis.cancel();
        } else {
            $(this).html('<i class="bi bi-volume-up-fill"></i>');
            // // Add code here to read API responses audibly
            // var lastResponse = $(".message-from-api").last().text(); // get the last API response
            // var utterance = new SpeechSynthesisUtterance(lastResponse);
            // window.speechSynthesis.speak(utterance);
        }
    });
});