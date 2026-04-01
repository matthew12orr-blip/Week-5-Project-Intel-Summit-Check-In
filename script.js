// Get all DOM/HTML elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");
const attendeeListEmpty = document.getElementById("attendeeListEmpty");

// Track attendance
let count = 0;
const maxCount = 50;
const storageKey = "intelSummitCheckInData";
const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

let attendees = [];

loadSavedData();
updatePage();

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (name === "" || team === "") {
    return;
  }

  count = count + 1;
  teamCounts[team] = teamCounts[team] + 1;
  attendees.push({
    name: name,
    team: team,
    teamName: teamName,
  });

  greeting.textContent = `Welcome, ${name} from ${teamName}!`;
  greeting.style.display = "block";
  greeting.classList.add("success-message");

  updatePage();
  saveData();

  form.reset();
  nameInput.focus();
});

function updatePage() {
  updateAttendanceDisplay();
  updateTeamCounts();
  renderAttendeeList();
  updateCelebrationMessage();
}

function updateAttendanceDisplay() {
  attendeeCount.textContent = count;

  const percentage = Math.min(Math.round((count / maxCount) * 100), 100);
  progressBar.style.width = `${percentage}%`;
}

function updateTeamCounts() {
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    attendeeListEmpty.style.display = "block";
    return;
  }

  attendeeListEmpty.style.display = "none";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.className = "attendee-list-item";

    const attendeeName = document.createElement("span");
    attendeeName.className = "attendee-name";
    attendeeName.textContent = attendee.name;

    const attendeeTeam = document.createElement("span");
    attendeeTeam.className = "attendee-team";
    attendeeTeam.textContent = attendee.teamName;

    listItem.appendChild(attendeeName);
    listItem.appendChild(attendeeTeam);
    attendeeList.appendChild(listItem);
  });
}

function updateCelebrationMessage() {
  if (count < maxCount) {
    celebrationMessage.style.display = "none";
    return;
  }

  const winningTeams = getWinningTeams();

  if (winningTeams.length === 1) {
    celebrationMessage.textContent = `Celebration! ${winningTeams[0]} wins the check-in challenge!`;
  } else {
    celebrationMessage.textContent = `Celebration! It is a tie between ${winningTeams.join(" and ")}!`;
  }

  celebrationMessage.style.display = "block";
}

function getWinningTeams() {
  const highestCount = Math.max(
    teamCounts.water,
    teamCounts.zero,
    teamCounts.power,
  );
  const winners = [];

  if (teamCounts.water === highestCount) {
    winners.push(teamNames.water);
  }

  if (teamCounts.zero === highestCount) {
    winners.push(teamNames.zero);
  }

  if (teamCounts.power === highestCount) {
    winners.push(teamNames.power);
  }

  return winners;
}

function saveData() {
  const appData = {
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(appData));
}

function loadSavedData() {
  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    return;
  }

  const parsedData = JSON.parse(savedData);

  count = parsedData.count || 0;
  teamCounts = parsedData.teamCounts || teamCounts;
  attendees = parsedData.attendees || [];
}
