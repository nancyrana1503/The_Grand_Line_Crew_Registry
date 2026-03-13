const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const crewMembers = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    role: "Captain",
    bounty: 3000000000,
    devilFruit: "Hito Hito no Mi, Model: Nika",
    status: "active",
  },
  {
    id: 2,
    name: "Roronoa Zoro",
    role: "Swordsman",
    bounty: 1111000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 3,
    name: "Nami",
    role: "Navigator",
    bounty: 366000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 4,
    name: "Usopp",
    role: "Sniper",
    bounty: 500000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 5,
    name: "Vinsmoke Sanji",
    role: "Cook",
    bounty: 1032000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 6,
    name: "Tony Tony Chopper",
    role: "Doctor",
    bounty: 1000,
    devilFruit: "Hito Hito no Mi",
    status: "inactive",
  },
  {
    id: 7,
    name: "Nico Robin",
    role: "Archaeologist",
    bounty: 930000000,
    devilFruit: "Hana Hana no Mi",
    status: "active",
  },
  {
    id: 8,
    name: "Franky",
    role: "Shipwright",
    bounty: 394000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 9,
    name: "Brook",
    role: "Musician",
    bounty: 383000000,
    devilFruit: "Yomi Yomi no Mi",
    status: "active",
  },
  {
    id: 10,
    name: "Jinbe",
    role: "Helmsman",
    bounty: 1100000000,
    devilFruit: "None",
    status: "active",
  },
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//request logger middleware
app.use((req, res, next) => {
  const log = `Request from: ${req.headers["user-agent"]} at ${new Date()}`;
  console.log(log);
  req.log = log;
  next();
});

//route restricting middleware
function verifyBounty(req, res, next) {
  const random = Math.floor(Math.random() * 2);
  if (random === 1) {
    next();
  } else {
    res
      .status(403)
      .send("403 - The Marines have blocked your path. Turn back.");
  }
}

//home route
app.get("/", (req, res) => {
  res.render("index", { crew: crewMembers });
});

//crew route
app.get("/crew", (req, res) => {
  res.render("crew", { crew: crewMembers });
});

//recruit page
app.get("/recruit", (req, res) => {
  res.render("recruit", { errors: [] });
});

//recruit POST valid
app.post("/recruit", (req, res) => {
  const { applicantName, skill, role, message, sea, agreeTerms } = req.body;

  let errors = [];

  if (!applicantName || applicantName.trim() === "")
    errors.push("Name is required");

  if (!skill || skill.trim() === "") errors.push("Skill is required");

  if (!role || role === "Select a role") errors.push("Role is required");

  if (!message || message.trim() === "") errors.push("Message is required");

  if (!sea) errors.push("Sea selection required");

  if (!agreeTerms) errors.push("You must accept the risks");

  if (errors.length > 0) {
    return res.render("recruit", { errors });
  }

  crewMembers.push({
    id: crewMembers.length + 1,
    name: applicantName,
    role: role,
    bounty: 0,
    devilFruit: skill,
    status: "pending",
  });

  res.render("recruit", { errors: [], success: "Application submitted!" });
});

//restricted log pose route
app.get("/log-pose", verifyBounty, (req, res) => {
  res.render("logPose", {
    crew: crewMembers,
    log: req.log,
  });
});

//error testing route
app.get("/error-test", (req, res) => {
  throw new Error("Engine malfunction!");
});

//404
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Error 404",
  });
});

//middleware to handle error
app.use((err, req, res, next) => {
  res
    .status(500)
    .send(`500 - Something went wrong on the Thousand Sunny: ${err.message}`);
});

//server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
