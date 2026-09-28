# Alumni Profile Information for AI Matching

## Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `fullName` | string | Alumni's full name | "Rahul Sharma" |
| `batchYear` | number | Graduation year | 2023 |
| `branch` | string | Department/Specialization | "Computer Science" |
| `currentCompany` | string | Current employer | "Google" |
| `currentRole` | string | Current job title | "Software Engineer" |
| `skills` | string[] | Technical skills & expertise | `["Python", "TensorFlow", "Kubernetes"]` |
| `careerDomain` | string | Primary field of work | "Artificial Intelligence" |
| `location` | string | Current working location | "Bangalore" |
| `profileImage` | string | URL or path to profile picture | `"https://example.com/rahul.jpg"` |
| `linkedinUrl` | string | LinkedIn profile URL | `"https://linkedin.com/in/rahulsharma"` |
| `resumeUrl` | string | Link to resume/CV | `"https://example.com/rahul-resume.pdf"` |
| `menteesServed` | number | Number of students mentored | 15 |
| `availability` | boolean | Open to mentoring/connection | true |
| `interests` | string[] | Areas willing to help with | `["Career Guidance", "Interview Prep", "Project Help"]` |
| `alumniType` | string | "Placed", "Higher Studies", "Entrepreneur" | "Placed" |

## Optional Fields

- `higherEducation`: University and course for further studies
- `foundedStartups`: Company names founded
- `patents`: List of patents filed
- `publications`: Research papers or articles
- `awards`: Recognition received from employer or industry
- `yearsOfExperience`: Total professional experience
- `previousBranches`: If switched domains/branches

## AI Matching Usage

Alumni profiles provide the **matching pool** data. The AI service uses:
- `batchYear` for year-level compatibility (recent grads vs. seniors)
- `branch` for domain-specific matching
- `careerDomain` for specialized expertise alignment
- `skills` for technical skill-based pairing
- `location` for geographical connection feasibility
- `availability` to filter who is open to mentoring
- `menteesServed` to gauge experience level

**Key Insight**: Alumni with `availability: true` and reasonable `menteesServed` counts are prioritized for student connections.

**Note**: Only include fields that are actually collected in the React UI to maintain data consistency.