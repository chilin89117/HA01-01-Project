$(function () {

  var roomId;

  $.ajax({type: "GET", url: "/api/rooms"})
   .done((rooms) => {
     roomId = rooms[0].id;
     getMessages();
     $.each(rooms, (key, room) => {
       let a = `<a href="#" data-room-id="${room.id}" class="room list-group-item">${room.name}</a>`;
       $("#rooms").append(a);
     });
   });

  $("#post").click(() => {
    let message = {text: $("#message").val()};
    $.ajax({type: "POST",
            url: `/api/rooms/${roomId}/messages`,
            data: JSON.stringify(message),  // Pass data in JSON format
            contentType : "application/json"})
     .done(() => {
       $("#message").val("");
       getMessages();
     });
  });

  $('body').on('click', 'a.room', (event) => {
    roomId = $(event.target).attr("data-room-id");
    getMessages();
  });

  function getMessages() {
    $.ajax({type: "GET", url: `/api/rooms/${roomId}/messages`})
     .done((data) => {
       $("#roomName").text(`Messages for ${data.room.name}`);
       let messages = "";
       $.each(data.messages, (key, message) => {
         messages += message.text + "\r";
       });
       $("#messages").val(messages);
     });
  }

  $("#delete").click(() => {
    $.ajax({type: "DELETE", url: `/api/rooms/${roomId}/messages`})
     .done(() => {
       $("#messages").val("");
     });
  });
});
