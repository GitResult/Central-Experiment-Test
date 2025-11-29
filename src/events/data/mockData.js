// Mock Data for Events Demo

export const MOCK_EVENT = {
  id: "cpa-2025",
  name: "2025 CPA Annual National Convention",
  startDate: "2025-06-12",
  endDate: "2025-06-14",
  venue: "St. John's Convention Centre",
  totalRevenue: 2340000,
};

// Deterministic pseudo-random generator for consistent data
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function weightedPick(seed, options) {
  const rand = seededRandom(seed);
  let cumulative = 0;
  for (const [value, weight] of options) {
    cumulative += weight;
    if (rand < cumulative) return value;
  }
  return options[options.length - 1][0];
}

// First/Last name pools
const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
  "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
  "Christopher", "Lisa", "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
  "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Wei", "Priya", "Mohammed", "Fatima", "Raj", "Aisha", "Chen", "Yuki", "Ahmed", "Mei",
  "Pierre", "Marie", "Jean", "Sophie", "François", "Isabelle", "André", "Nathalie", "Michel", "Julie",
  "Liam", "Emma", "Noah", "Olivia", "Oliver", "Ava", "Ethan", "Sophia", "Lucas", "Isabella",
  "Hiroshi", "Sakura", "Kenji", "Yuki", "Takeshi", "Hana", "Ravi", "Ananya", "Arjun", "Deepa"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Wang", "Li", "Zhang", "Chen", "Liu", "Yang", "Huang", "Wu", "Zhou", "Xu",
  "Tremblay", "Gagnon", "Roy", "Côté", "Bouchard", "Gauthier", "Morin", "Lavoie", "Fortin", "Gagné",
  "Patel", "Singh", "Kumar", "Sharma", "Gupta", "Khan", "Ali", "Ahmed", "Hassan", "Mohammed",
  "Kim", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim", "Han",
  "Tanaka", "Yamamoto", "Watanabe", "Suzuki", "Takahashi", "Sato", "Ito", "Nakamura", "Kobayashi", "Saito"
];

// Distribution configs
const MEMBER_TYPE_DIST = [["CPA", 0.55], ["Non-member", 0.18], ["Student", 0.17], ["Guest", 0.10]];
const AGE_GROUP_DIST = [["18-24", 0.12], ["25-34", 0.24], ["35-44", 0.28], ["45-54", 0.22], ["55-64", 0.10], ["65+", 0.04]];
const PROVINCE_DIST = [
  ["Ontario", 0.38], ["Quebec", 0.18], ["British Columbia", 0.14], ["Alberta", 0.12],
  ["Manitoba", 0.04], ["Saskatchewan", 0.03], ["Nova Scotia", 0.04], ["New Brunswick", 0.02],
  ["Newfoundland and Labrador", 0.03], ["Prince Edward Island", 0.02]
];
const EDUCATION_DIST = [["Undergrad", 0.15], ["Bachelors", 0.42], ["Masters", 0.33], ["PhD", 0.10]];
const DIETARY_DIST = [["None", 0.62], ["Vegetarian", 0.15], ["Vegan", 0.08], ["Gluten-free", 0.06], ["Halal", 0.05], ["Kosher", 0.04]];
const SESSION_DIST = [
  ["Audit Track", 0.18], ["Tax Track", 0.20], ["Leadership Track", 0.15], ["Technology Track", 0.12],
  ["Ethics Track", 0.10], ["Research Track", 0.08], ["Student Track", 0.10], ["Keynote", 0.04], ["Social Events", 0.03]
];
const PRIMARY_REASON_DIST = [
  ["Networking", 0.30], ["Professional Development", 0.25], ["Learning", 0.20], ["Career", 0.10],
  ["Thought Leadership", 0.05], ["Speaker", 0.03], ["Exploring Membership", 0.05], ["Guest", 0.02]
];

function generateAttendee(id) {
  const seed1 = id * 13;
  const seed2 = id * 17;
  const seed3 = id * 23;
  const seed4 = id * 29;
  const seed5 = id * 31;
  const seed6 = id * 37;
  const seed7 = id * 41;
  const seed8 = id * 43;
  const seed9 = id * 47;

  const firstName = FIRST_NAMES[Math.floor(seededRandom(seed1) * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(seededRandom(seed2) * LAST_NAMES.length)];
  const memberType = weightedPick(seed3, MEMBER_TYPE_DIST);
  const ageGroup = memberType === "Student" ? weightedPick(seed4, [["18-24", 0.7], ["25-34", 0.3]]) : weightedPick(seed4, AGE_GROUP_DIST);
  const province = weightedPick(seed5, PROVINCE_DIST);
  const education = memberType === "Student" ? "Undergrad" : weightedPick(seed6, EDUCATION_DIST);
  const dietary = weightedPick(seed7, DIETARY_DIST);
  const session = memberType === "Student" ? weightedPick(seed8, [["Student Track", 0.6], ["Keynote", 0.2], ["Technology Track", 0.2]]) : weightedPick(seed8, SESSION_DIST);
  const primaryReason = memberType === "Student" ? "Career" : memberType === "Guest" ? "Guest" : weightedPick(seed9, PRIMARY_REASON_DIST);

  let membershipStatus, isMember;
  if (memberType === "CPA") {
    const statusRand = seededRandom(id * 53);
    if (statusRand < 0.70) { membershipStatus = "Current"; isMember = true; }
    else { membershipStatus = "Lapsed"; isMember = false; }
  } else if (memberType === "Student") {
    membershipStatus = "Current"; isMember = true;
  } else {
    membershipStatus = "Non-member"; isMember = false;
  }

  let registrationType, ticketType, isComplimentary;
  if (memberType === "Student") {
    registrationType = "Student Pass"; ticketType = "Paid"; isComplimentary = false;
  } else if (memberType === "Guest") {
    registrationType = "Guest"; ticketType = "Complimentary"; isComplimentary = true;
  } else if (primaryReason === "Speaker") {
    registrationType = "Speaker"; ticketType = "Complimentary"; isComplimentary = true;
  } else {
    const regRand = seededRandom(id * 59);
    if (regRand < 0.65) registrationType = "Full Conference";
    else registrationType = "Workshop Only";
    ticketType = "Paid"; isComplimentary = false;
  }

  let renewed = false;
  if (membershipStatus === "Current") {
    renewed = seededRandom(id * 61) < 0.75;
  } else if (membershipStatus === "Lapsed") {
    renewed = seededRandom(id * 61) < 0.20;
  } else {
    renewed = seededRandom(id * 61) < 0.08;
  }

  return {
    id,
    name: `${firstName} ${lastName}`,
    memberType,
    membershipStatus,
    isComplimentary,
    isMember,
    ageGroup,
    province,
    education,
    primaryReason,
    registrationType,
    dietary,
    session,
    ticketType,
    renewed,
  };
}

// Generate 300 attendees
export const MOCK_ATTENDEES = Array.from({ length: 300 }, (_, i) => generateAttendee(i + 1));

// Company list for enrichment
const COMPANY_LIST = [
  "Deloitte Canada", "KPMG LLP", "PwC Canada", "Ernst & Young",
  "BDO Canada", "Grant Thornton", "MNP LLP", "RSM Canada",
  "Baker Tilly Canada", "Crowe Soberman", "Collins Barrow", "Richter LLP"
];

export function enrichAttendeesWithListData(attendees) {
  return attendees.map((a) => {
    const nameParts = a.name.split(" ");
    const firstName = nameParts[0]?.toLowerCase() || "user";
    const lastName = nameParts[nameParts.length - 1]?.toLowerCase() || "unknown";
    const companyIdx = (a.id * 7) % COMPANY_LIST.length;
    const regDay = 1 + (a.id % 28);
    const regMonth = 3 + Math.floor(a.id / 10);

    return {
      ...a,
      company: a.memberType === "Student" ? "N/A - Student" : COMPANY_LIST[companyIdx],
      email: `${firstName}.${lastName}@example.com`,
      phone: `(${500 + (a.id % 400)}) ${100 + (a.id * 3) % 900}-${1000 + (a.id * 7) % 9000}`,
      confirmationId: `CPA2025-${String(a.id).padStart(4, "0")}`,
      registrationDate: `2025-${String(regMonth).padStart(2, "0")}-${String(regDay).padStart(2, "0")}`,
    };
  });
}
