// import dependencies
import { Voice } from "@signalwire/realtime-api";
import axios from 'axios';

// instantiate client
const client = new Voice.Client({
  project: process.env.PROJECT_ID,
  token: process.env.API_TOKEN,
  contexts: ["poc"],
});

// voice logic
try {
  // outbound call
  const call = await client.dialPhone({
    from: process.env.PHONE_NUMBER,
    to: process.env.DESTINATION,
    timeout: 30,
  });
  console.log("The call has been answered!", call);

  // play tts
  let message = await call.playTTS({
    text: "Hello! This is a test call.",
    gender: "female",
  });
  await message.ended();

  // request call info from Calls API
  await axios.get('https://' + process.env.SIGNALWIRE_SPACE_URL + '/api/laml/2010-04-01/Accounts/' + process.env.PROJECT_ID + '/Calls/' +  call.id, {
    auth: {
      username: process.env.PROJECT_ID,
      password: process.env.API_TOKEN
    }
  })
  .then(function (response) {
    // handle success from API request
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error from API request
    console.log(error);
  })
  .finally(function () {
    // always executed after API request
  });

  // hangup call
  await call.hangup();
} catch (error) {
  // error handling of call logic
  console.error(error);
}
