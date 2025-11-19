# Report Builder Phrase Test Plan

## Original 3 Test Queries

### Query 1: Current members with membership years
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Type = Members
4. Member Stats: Consecutive Membership Years = 5

**Expected Phrase:**
`Current members that are Members that have been members for 5 years`

**Connector Pattern:**
`[Current][Members] [that are][Member Type= Members] [And] [Member Stats: Consecutive Membership Years= 5]`

---

### Query 2: Current ECY1 practitioners with Masters from BC
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Type = Members
4. Member Type = ECY1 - Member Early Career Year 1
5. Occupation = Practitioner
6. Degree = Masters
7. Province/State = BC

**Expected Phrase:**
`Current members that are Members and member type ECY1 and occupation is Practitioner with a Degree: Masters from province/state BC`

**Connector Pattern:**
`[Current][Members][that are][Member Type= Members] [And] [Member Type = ECY1] [And] [Occupation = Practitioner] [AND] [Degree = Masters] [And] [Province/State = BC]`

---

### Query 3: 2019 members who renewed in Dec 2019 and Jan 2020
**Selections:**
1. Previous (Status)
2. Members (Starting Data)
3. Member Year = 2019
4. Member Type = All
5. Joined/Renewed = December 2019, January 2020
6. Member Year = 2020

**Expected Phrase:**
`2019 members that are All that renewed in December 2019, January 2020`

**Connector Pattern:**
`[Previous][Members][for][Member Year = 2019][that are][Member Type= All] [that] [Renewed] [in][December 2019, January 2020][for][Member Year 2020]`

---

## Additional 20 Test Queries

### Query 4: New members from Ontario
**Selections:**
1. New (Status)
2. Members (Starting Data)
3. Province/State = ON

**Expected Phrase:**
`New members from province/state ON`

---

### Query 5: Lapsed members with Clinical Psychology occupation
**Selections:**
1. Lapsed (Status)
2. Members (Starting Data)
3. Occupation = Clinical Psychologist

**Expected Phrase:**
`Lapsed members and occupation is Clinical Psychologist`

---

### Query 6: Current members who are Early Career
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Career Stage = Early Career

**Expected Phrase:**
`Current members and career stage Early Career`

---

### Query 7: Current members with PhD degree
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Degree = PhD

**Expected Phrase:**
`Current members with a Degree: PhD`

---

### Query 8: Current members with 10+ years membership
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Stats: Consecutive Membership Years = 10

**Expected Phrase:**
`Current members that have been members for 10 years`

---

### Query 9: Current Life Fellows
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Type = Life Fellow

**Expected Phrase:**
`Current members and member type Life Fellow`

---

### Query 10: Current members in academic settings
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Workplace Setting = Academic/University

**Expected Phrase:**
`Current members and workplace setting Academic/University`

---

### Query 11: Current researchers with Masters from BC
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Occupation = Researcher
4. Degree = Masters
5. Province/State = BC

**Expected Phrase:**
`Current members and occupation is Researcher with a Degree: Masters from province/state BC`

---

### Query 12: New members who joined in last 30 days
**Selections:**
1. New (Status)
2. Members (Starting Data)
3. Joined/Renewed = Last 30 days

**Expected Phrase:**
`New members that renewed in Last 30 days`

---

### Query 13: Current Fellows with Clinical Psychology interest
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Type = Fellow
4. Area of Interest = Clinical Psychology

**Expected Phrase:**
`Current members and member type Fellow and area of interest Clinical Psychology`

---

### Query 14: Previous members from 2018
**Selections:**
1. Previous (Status)
2. Members (Starting Data)
3. Member Year = 2018

**Expected Phrase:**
`2018 members`

---

### Query 15: Current Professional Members from Toronto
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Type = Professional Member
4. In City = Toronto

**Expected Phrase:**
`Current members and member type Professional Member and in city Toronto`

---

### Query 16: Current Early Career Year 1 students
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Type = ECY1 - Member Early Career Year 1
4. Career Stage = Student

**Expected Phrase:**
`Current members and member type ECY1 and career stage Student`

---

### Query 17: Current members with Cognitive Psychology education
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Education Received = Cognitive Psychology

**Expected Phrase:**
`Current members with education Cognitive Psychology`

---

### Query 18: Lapsed members from Vancouver with PhD
**Selections:**
1. Lapsed (Status)
2. Members (Starting Data)
3. In City = Vancouver
4. Degree = PhD

**Expected Phrase:**
`Lapsed members and in city Vancouver with a Degree: PhD`

---

### Query 19: Current members who are practitioners in clinical settings
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Occupation = Practitioner
4. Workplace Setting = Clinical/Hospital

**Expected Phrase:**
`Current members and occupation is Practitioner and workplace setting Clinical/Hospital`

---

### Query 20: New Student members with 1 year membership
**Selections:**
1. New (Status)
2. Members (Starting Data)
3. Member Type = Student
4. Member Stats: Consecutive Membership Years = 1

**Expected Phrase:**
`New members and member type Student that have been members for 1 year`

---

### Query 21: Current Associate members interested in Health Psychology
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Member Type = Associate
4. Area of Interest = Health Psychology

**Expected Phrase:**
`Current members and member type Associate and area of interest Health Psychology`

---

### Query 22: Previous 2020 members who renewed
**Selections:**
1. Previous (Status)
2. Members (Starting Data)
3. Member Year = 2020
4. Joined/Renewed = January 2020

**Expected Phrase:**
`2020 members that renewed in January 2020`

---

### Query 23: Current mid-career practitioners with Masters
**Selections:**
1. Current (Status)
2. Members (Starting Data)
3. Career Stage = Mid to Late Career
4. Occupation = Practitioner
5. Degree = Masters

**Expected Phrase:**
`Current members and career stage Mid to Late Career and occupation is Practitioner with a Degree: Masters`

---

## Test Verification Checklist

### For Each Query:
- [ ] Build query by selecting categories in Browse Mode
- [ ] Verify NO connector appears between Status and Members
- [ ] Verify first filter uses "that are" when appropriate
- [ ] Verify subsequent filters use "and" connector
- [ ] Verify special connectors (that have been, with a, from, etc.)
- [ ] Check phrase appears correctly in bottom panel
- [ ] Repeat test in Select/List Mode
- [ ] Verify both modes produce identical phrases

### Key Test Points:
1. **Status + Members**: NO connector between them
2. **First Member Type filter**: Uses "that are"
3. **Subsequent Member Type filters**: Use "and member type"
4. **Membership Years**: Uses "that have been members for"
5. **Degree**: Uses "with a Degree:"
6. **Province/State**: Uses "from province/state"
7. **Occupation**: Uses "and occupation is"
8. **Renewal dates**: Uses "who renewed in" or "that renewed in"
9. **Member Year**: Becomes part of opening phrase (e.g., "2019 members")
10. **Area of Interest**: Uses "and area of interest"
