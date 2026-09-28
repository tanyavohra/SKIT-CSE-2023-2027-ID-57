# AI Use Cases to Test

## 1. Core Matching Algorithm

### Purpose
Validate the compatibility scoring system produces reasonable results across diverse profile combinations.

### Test Cases
| # | Student Profile | Alumni Profile | Expected Range | Success Criteria |
|---|-----------------|----------------|----------------|------------------|
| 1 | CSE, 2027, Python/React | CSE, 2023, Python/Go/K8s | 70-85 | Score ≥70, branch match + skills overlap recognized |
| 2 | IT, 2027, Java/Spring | IT, 2022, JS/React/Node | 60-75 | Score reflects related but not identical skills |
| 3 | ECE, 2027, Python basics | CSE, 2021, ML/DL | 40-60 | Lower score due to branch mismatch, but skills help |
| 4 | CSE, 2027, No skills listed | CSE, 2023, Any skills | 30-50 | Minimal skills = lower overlap score |
| 5 | CSE, 2027, Python | ECE, 2020, Embedded systems | 20-40 | Domain mismatch limits score despite Python |

### Edge Cases to Verify
- [ ] Student with empty skills list → lowest possible overlap score
- [ ] Alumni with `availability: false` → score capped at 60 max
- [ ] Very distant graduation years (10+ years) → year score → 0
- [ ] Same person as both student and alumni → should not match or flag

---

## 2. Batch Matching (All Students ↔ All Alumni)

### Purpose
Test the matching engine when processing large datasets (simulated).

### Test Scenarios
| Scenario | Students | Alumni | Expected Output |
|----------|----------|--------|-----------------|
| Small set | 3 students | 3 alumni | 9 match scores, top 3 recommendations |
| Medium set | 10 students | 10 alumni | 100 match scores, tiered recommendations (Excellent/Good/Fair) |
| Large set | 50 students | 50 alumni | 2500 match scores, filtered by threshold (80+, 60-79, 40-59) |

### Performance Requirements
- [ ] Process 50×50 matching in < 5 seconds
- [ ] Return top-5 matches per student in < 2 seconds
- [ ] Handle missing optional fields gracefully (no crashes)

### Output Format (Expected JSON Structure)
```json
{
  "matches": [
    {
      "studentId": "stu_001",
      "studentName": "Alice Johnson",
      "topMatches": [
        {
          "alumniId": "al_001",
          "alumniName": "Rahul Sharma",
          "score": 79,
          "classification": "Excellent Match",
          "matchingCriteria": {
            "branch": true,
            "skills": "Python, React overlap",
            "location": "Same city bonus"
          }
        }
      ]
    }
  ]
}
```

---

## 3. Career Chatbot Use Case

### Purpose
Test the AI FastAPI service's chatbot functionality for career guidance.

### Test Scenarios
| # | User Input | Expected System Response | Notes |
|---|------------|-------------------------|-------|
| 1 | "I'm a CSE student interested in AI/ML, what should I learn?" | Personalized learning path based on student profile + alumni mentoring paths | Use student's branch + interests + matching alumni data |
| 2 | "I have an interview at Google next week, help me prepare!" | Technical interview questions + alumni interview experiences | Look up alumni at Google from matching pool |
| 3 | "What's the difference between software engineer roles at startups vs. product companies?" | Comparative analysis + alumni career path stories | Use alumni currentCompany + careerDomain data |
| 4 | "I'm getting backlogs, should I worry about placements?" | Context-aware advice based on student's graduation year + backlog count | Integrate student profile data |
| 5 | "I want to switch from ECE to full-stack development, is it possible?" | Career transition guidance + which alumni made similar switches | Track alumni branch changes in profiles |

### Success Criteria
- [ ] Responses are relevant to student's branch and year
- [ ] References specific alumni where appropriate ("Alumni X from 2023 batch did...")
- [ ] No hallucinated facts about companies/alumni not in the system
- [ ] Handles unknown questions gracefully ("I don't have info on that, but here's what I can help with")

---

## 4. Matching Dashboard Use Case

### Purpose
Test the frontend display of matching results for students.

### Test Scenarios
| # | Feature | Expected Behavior |
|---|---------|-------------------|
| 1 | Student logs in → "Matches" section | Shows top 5 matches with scores and brief reasons |
| 2 | Filter by "Excellent matches only" (score ≥80) | Hides Fair/Low matches, shows only 80+ |
| 3 | Filter by "My branch only" | Only shows alumni from same branch |
| 4 | Click on a match → "Connect" modal | Shows common skills, shared interests, personalized message draft |
| 5 | Student sends connection request → Updates UI | Request pending, can cancel before alumni responds |

### UI/UX Requirements
- [ ] Score displayed as number + color code (Green ≥80, Yellow 60-79, Orange 40-59, Red <40)
- [ ] Match reason summary (e.g., "3/5 criteria matched: same branch, Python skills, Bangalore location")
- [ ] "Connect" button only enabled for matches ≥40 score
- [ ] Loading state while matching calculates (show spinner for >2 seconds)

---

## 5. Notification Use Case

### Purpose
Test alumni-student connection notifications.

### Test Scenarios
| # | Event | Expected Trigger |
|---|-------|------------------|
| 1 | Alumni accepts connection request | Student receives "Alumni accepted your connection request" notification |
| 2 | Alumni declines connection request | Student receives "Alumni declined your connection request" notification |
| 3 | New match calculated (student logs in after 24h) | Student sees "New matches available!" with count |
| 4 | Student messages alumni first | Alumni receives "New message from student" notification |
| 5 | Weekly digest email | Summary of top 3 matches + action buttons |

### Technical Requirements
- [ ] Socket.io events: `match_calculated`, `connection_accepted`, `connection_declined`, `new_message`
- [ ] Backend polling fallback if Socket.io fails (every 6 hours)
- [ ] Notifications respect `alumni.availability: false` (no notifications sent)
- [ ] All notifications include deep link to relevant profile/match page

---

## 6. Profile Enhancement Use Case

### Purpose
Test if adding new profile fields improves matching accuracy.

### Test Scenerios
| # | Added Field | Expected Impact |
|---|-------------|-----------------|
| 1 | `certifications` array | Students with relevant certs get higher scores for matching alumni with those certs |
| 2 | `higherEducation` field | Alumni from top universities get matched with students targeting those universities |
| 3 | `yearsOfExperience` for alumni | More experienced alumni (5+ years) get prioritized for final-year students |
| 4 | `foundedStartups` | Entrepreneurial alumni matched with students interested in startups |
| 5 | `backlogCount` for students | Students with 0 backlogs get slight score boost for competitive roles |

### A/B Testing Plan
- Group A: Original matching (5 fields: branch, year, skills, domain, location)
- Group B: Enhanced matching (5 fields + 2 new fields of choice)
- Measure: Increase in "Excellent Match" (≥80) percentage, user satisfaction

### Success Metric
- [ ] ≥15% increase in Excellent Match rate with enhanced profiles
- [ ] No decrease in match quality diversity (still match across branches/years)

---

## 7. Real-time Chat Integration Use Case

### Purpose
Test Socket.io real-time chat between matched students and alumni.

### Test Scenarios
| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| 1 | Student clicks "Chat" on match → opens chat page | Connects via Socket.io, shows "Connected to Alumni Name" |
| 2 | Alumni types → student sees typing indicator | Real-time typing status |
| 3 | Student sends message → alumni sees it instantly | No page refresh needed |
| 4 | Alumni closes chat → student sees "Alumni offline" | Graceful disconnection handling |
| 5 | Student refreshes page → chat history preserved | Last 50 messages retained in localStorage/Supabase |

### Technical Requirements
- [ ] Socket.io namespace: `/chat`
- [ ] Room per match: `match_{studentId}_{alumniId}`
- [ ] Message schema: `{id, sender, receiver, text, timestamp, read}`
- [ ] Max message length: 2000 characters
- [ ] Automatic removal of inactive rooms after 24h of no activity

### Success Criteria
- [ ] Chat connects within 2 seconds of opening
- [ ] Messages deliver < 1 second latency on same network
- [ ] Works across Chrome, Firefox, Safari mobile/desktop
- [ ] No message loss on temporary network disconnect (reconnect & resume)