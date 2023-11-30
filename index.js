const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://10.0.2.2:3000/",
  },
});

const PORT = 4000;

function createUniqueId() {
  return Math.random().toString(20).substring(2, 10);
}
let locations = {};
let chatgroups = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user is just connected`);
  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
    delete locations[`${socket.id}`];
    console.log(locations);
  });

  socket.on("getAllLocations", () => {
    socket.emit("locationList", locations);
  });
  socket.on(
    "addNewUserLocation",
    (
      id,
      name,
      email,
      profilePicture,
      latitude,
      longitude,
      altitudeAccuracy,
      accuracy
    ) => {
      // console.log(id, name, email, latitude, longitude);
      // JSON.stringify(id)
      const myId = id;
      locations = {
        ...locations,
        [socket.id]: {
          socketID: socket.id,
          id,
          name,
          email,
          profilePicture,
          latitude,
          longitude,
          altitudeAccuracy,
          accuracy,
        },
      };
      // locations.unshift({
      //   id: id,
      //   info: {
      //     name,
      //     email,
      //     latitude,
      //     longitude,
      //   },
      // });
      console.log("New.........................");
      console.log(locations);
      socket.emit("locationList", locations);
    }
  );
});

app.get("/api", (req, res) => {
  res.json(chatgroups);
});

http.listen(PORT, () => {
  console.log(`Server is listeing on ${PORT}`);
});

// socket.on("getAllGroups", () => {
//   socket.emit("groupList", chatgroups);
// });

// socket.on("createNewGroup", (currentGroupName) => {
//   console.log(currentGroupName);
//   chatgroups.unshift({
//     id: chatgroups.length + 1,
//     currentGroupName,
//     messages: [],
//   });
//   socket.emit("groupList", chatgroups);
// });

// socket.on("findGroup", (id) => {
//   const filteredGroup = chatgroups.filter((item) => item.id === id);
//   socket.emit("foundGroup", filteredGroup[0].messages);
// });

// socket.on("newChatMessage", (data) => {
//   const { currentChatMesage, groupIdentifier, currentUser, timeData } = data;
//   const filteredGroup = chatgroups.filter(
//     (item) => item.id === groupIdentifier
//   );
//   const newMessage = {
//     id: createUniqueId(),
//     text: currentChatMesage,
//     currentUser,
//     time: `${timeData.hr}:${timeData.mins}`,
//   };

//   socket
//     .to(filteredGroup[0].currentGroupName)
//     .emit("groupMessage", newMessage);
//   filteredGroup[0].messages.push(newMessage);
//   socket.emit("groupList", chatgroups);
//   socket.emit("foundGroup", filteredGroup[0].messages);
// });
