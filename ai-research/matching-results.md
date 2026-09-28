# Expected Matching Results

## Matching Scenarios with Dummy Profiles

### Scenario 1: Excellent Match - Alice Johnson (Student) ↔ Rahul Sharma (Alumni)
**Why**: Strong alignment across multiple criteria

| Criteria | Student | Alumni | Match | Points |
|----------|---------|--------|-------|--------|
| Branch | Computer Science | Computer Science | Exact | +25 |
| Grad Year | 2027 | 2023 | ±4 years | +5 |
| Skills Overlap | Python, React | Python, Go, Kubernetes | Python overlap | +20 |
| Career Domain | Web Development | Cloud Infrastructure & AI | Related | +8 |
| Location | Delhi NCR | Bangalore | Different | +4 |
| Availability | N/A | Available | Yes | +5 |
| **Total Score** | | | | **67/100** |

**Classification**: Good Match → Suggested for outreach
**Action**: Recommend connection with personalized message about web dev + AI interests

---

### Scenario 2: Excellent Match - Charlie Singh (Student) ↔ Vikram Patel (Alumni)
**Why**: Strong AI/ML alignment and significant skills overlap

| Criteria | Student | Alumni | Match | Points |
|----------|---------|--------|-------|--------|
| Branch | Computer Science | Computer Science | Exact | +25 |
| Grad Year | 2027 | 2021 | ±6 years | +5 |
| Skills Overlap | Python, TensorFlow, PyTorch | Python, TensorFlow, PyTorch | 80%+ overlap | +25 |
| Career Domain | AI/ML | Artificial Intelligence | Exact | +15 |
| Location | Mumbai | Bangalore | Different | +4 |
| Availability | N/A | Available | Yes | +5 |
| **Total Score** | | | | **79/100** |

**Classification**: Excellent Match → Recommended for immediate connection
**Action**: Prioritize for AI/mentoring connection; Charlie could get research guidance

---

### Scenario 3: Good Match - Bob Patel (Student) ↔ Priya Menon (Alumni)
**Why**: Related branch and decent skills overlap for backend roles

| Criteria | Student | Alumni | Match | Points |
|----------|---------|--------|-------|--------|
| Branch | Information Technology | Information Technology | Exact | +25 |
| Grad Year | 2027 | 2022 | ±5 years | +5 |
| Skills Overlap | Java, Spring Boot | JavaScript, React | Minimal overlap | +5 |
| Career Domain | Backend Development | Web & Mobile | Related | +8 |
| Location | Bangalore | Delhi NCR | Different | +4 |
| Availability | N/A | Available | Yes | +5 |
| **Total Score** | | | | **52/100** |

**Classification**: Fair Match → Optional, depends on preferences
**Action**: Could connect for general advice; Bob might get startup insights from Priya

---

### Scenario 4: Low Match - Alice Johnson (Student) ↔ Sneha Roy (Alumni)
**Why**: Branch mismatch and unavailable alumni

| Criteria | Student | Alumni | Match | Points |
|----------|---------|--------|-------|--------|
| Branch | Computer Science | Electronics & Communication | No match | 0 |
| Grad Year | 2027 | 2020 | ±7 years | +5 |
| Skills Overlap | Python, React | PowerPoint, Data Analysis | No overlap | 0 |
| Career Domain | Web Development | Consulting | No relation | 0 |
| Location | Delhi NCR | Delhi NCR | Same city | +10 |
| Availability | N/A | Not Available | No | 0 |
| **Total Score** | | | | **15/100** |

**Classification**: Low Match → Skip
**Action**: Do not recommend connection; Sneha is not available for mentoring

---

## Summary of Matching Behavior

| Student-Alumni Pair | Score | Action |
|---------------------|-------|--------|
| Alice ↔ Rahul | 67 | Connect (Good Match) |
| Charlie ↔ Vikram | 79 | Prioritize Connect (Excellent Match) |
| Bob ↔ Priya | 52 | Optional Connect (Fair Match) |
| Alice ↔ Sneha | 15 | Do Not Connect (Low Match) |

## Key Observations

1. **Branch match is the strongest single factor** (25 points) - prioritize same-branch connections
2. **Skills overlap heavily influences scoring** (25 points) - encourage students/alumni to list relevant skills
3. **Graduation year proximity matters** - final-year students benefit most from recent grads (1-3 years out)
4. **Availability gate** - unavailable alumni get capped at 60 max score regardless of other factors
5. **Location bonus is modest** (max 10 points) - used as tiebreaker, not primary driver
6. **Same-city same-branch alumni** score highest (70+ typical) - focus local networking first