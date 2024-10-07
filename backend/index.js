
const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://Aman:qwe1234@cluster0.yb5qy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    dbName: 'SIM_Card_Activation',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDb connected!!')
  })
  .catch(err => {
    console.error('Failed to connect to database', err)
  });

const SIMCardSchema = new mongoose.Schema({
  sim_number: {
    type: Number,
    required: true,
    unique: true,
  },
  phone_number: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'inactive', 
  },
  activation_date: {
    type: Date,
  },
});

const SIMCard = mongoose.model('SIMCard', SIMCardSchema);

const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

console.log("App listening at port number 5000");


app.post("/register-sim", async (req, resp) => {
  const { sim_number, phone_number } = req.body;

  if (!sim_number || !phone_number) {
    return resp.status(400).json({ error: "SIM Number and Phone Number are required" });
  }

  try {
    const simCard = new SIMCard(req.body);
    const result = await simCard.save();
    resp.status(201).json(result);
  } catch (error) {
    resp.status(500).json({ error: "Error registering SIM card" });
    console.error(error);
  }
});


app.post("/activate", async (req, resp) => {
  const { sim_number } = req.body;

  if (!sim_number) {
    return resp.status(400).json({ error: "SIM Number is required" });
  }

  try {
    const simCard = await SIMCard.findOne({ sim_number });
    if (!simCard) {
      return resp.status(404).json({ error: "SIM card does not exist" });
    }
    if (simCard.status === 'active') {
      return resp.status(400).json({ error: "SIM card is already active" });
    }

    simCard.status = 'active';
    simCard.activation_date = new Date();
    await simCard.save();

    resp.status(200).json(simCard);
  } catch (error) {
    resp.status(500).json({ error: "Error activating SIM card" });
    console.error(error);
  }
});


app.post("/deactivate", async (req, resp) => {
  const { sim_number } = req.body;

  if (!sim_number) {
    return resp.status(400).json({ error: "SIM Number is required" });
  }

  try {
    const simCard = await SIMCard.findOne({ sim_number });
    if (!simCard) {
      return resp.status(404).json({ error: "SIM card does not exist" });
    }
    if (simCard.status === 'inactive') {
      return resp.status(400).json({ error: "SIM card is already inactive" });
    }

    simCard.status = 'inactive';
    simCard.activation_date = null; 
    await simCard.save();

    resp.status(200).json(simCard);
  } catch (error) {
    resp.status(500).json({ error: "Error deactivating SIM card" });
    console.error(error);
  }
});


app.get("/sim-details/:simNumber", async (req, resp) => {
  const { simNumber } = req.params;

  try {
    const simCard = await SIMCard.findOne({ sim_number: simNumber });
    if (!simCard) {
      return resp.status(404).json({ error: "SIM card not found" });
    }

    resp.status(200).json(simCard);
  } catch (error) {
    resp.status(500).json({ error: "Error retrieving SIM card details" });
    console.error(error);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

