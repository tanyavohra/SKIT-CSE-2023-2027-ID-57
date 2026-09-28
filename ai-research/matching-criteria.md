# AI Matching Criteria

## Matching Score Calculation

The AI matching algorithm computes a **compatibility score** (0-100) based on weighted criteria:

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Branch Match** | 25% | Exact branch match vs. related domains |
| **Graduation Year** | 20% | Proximity in graduation years (closer = higher score) |
| **Skills Overlap** | 25% | Jaccard similarity of skills sets |
| **Career Domain** | 15% | Same career domain or related fields |
| **Location** | 10% | Same city/region or willingness to relocate |
| **Availability** | 5% | Alumni open to mentoring/connection |

## Scoring Rules

### Branch Match (25%)
- Exact match: +25 points
- Related domain (e.g., CS vs. IT): +15 points
- No match: 0 points

### Graduation Year (20)
- Same year: +20 points
- ±1 year: +15 points
- ±2 years: +10 points
- ±3+ years: +5 points
- Very distant (10+ years): 0 points

### Skills Overlap (25%)
- ≥50% skills overlap: +25 points
- 30-49% overlap: +15 points
- 10-29% overlap: +8 points
- <10% overlap: 0 points

### Career Domain (15%)
- Exact match: +15 points
- Related domain: +8 points
- No relation: 0 points

### Location (10%)
- Same city: +10 points
- Same state/region: +6 points
- Different but willing to relocate: +4 points
- No overlap: 0 points

### Availability (5%)
- Alumni available: +5 points
- Not available: 0 points

## Matching Thresholds

| Score Range | Classification |
|-------------|----------------|
| 80-100 | **Excellent Match** - Recommended for immediate connection |
| 60-79 | **Good Match** - Suggested for outreach |
| 40-59 | **Fair Match** - Optional, depends on preferences |
| 0-39 | **Low Match** - Skip or use as fallback |

## Example Matching Logic (Pseudo-code)

```python
def calculate_match_score(student, alumni):
    score = 0
    
    # Branch match
    if student.branch == alumni.branch:
        score += 25
    elif related_branches(student.branch, alumni.branch):
        score += 15
    
    # Graduation year
    diff = abs(student.graduationYear - alumni.batchYear)
    if diff == 0:
        score += 20
    elif diff <= 1:
        score += 15
    elif diff <= 2:
        score += 10
    elif diff <= 3:
        score += 5
    
    # Skills overlap
    student_skills = set(student.skills)
    alumni_skills = set(alumni.skills)
    overlap = len(student_skills & alumni_skills) / len(student_skills | alumni_skills)
    if overlap >= 0.5:
        score += 25
    elif overlap >= 0.3:
        score += 15
    elif overlap >= 0.1:
        score += 8
    
    # ... rest of criteria
    
    return min(score, 100)  # Cap at 100
```