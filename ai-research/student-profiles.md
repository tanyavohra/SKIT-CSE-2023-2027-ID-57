# Student Profile Information for AI Matching

## Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `fullName` | string | Student's full name | "Alice Johnson" |
| `branch` | string | Department/Specialization | "Computer Science" |
| `graduationYear` | number | Year of graduation | 2027 |
| `skills` | string[] | Technical skills (languages, frameworks, tools) | `["Python", "React", "SQL"]` |
| `interests` | string[] | Career interests & topics | `["Web Development", "AI/ML", "Cloud Computing"]` |
| `location` | string | Preferred working location | "Delhi NCR" |
| `profileImage` | string | URL or path to profile picture | `"https://example.com/alice.jpg"` |
| `resumeUrl` | string | Link to resume/CV | `"https://example.com/resume.pdf"` |
| `projects` | array | Brief project descriptions | `[{"name": "TaskFlow", "description": "Task management app", "tech": ["React", "Node"]}]` |
| `experienceLevel` | string | Junior/Senior/Placement ready | "Final Year" |
| `jobPreference` | string | Type of role sought | "Full-time", "Internship" |

## Optional Fields

- `backlogCount`: Number of backlogs (if any)
- `cgpa`: Cumulative Grade Point Average
- `certifications`: Array of completed certifications
- `achievements`: Notable awards or recognition
- `extraCurricular`: Sports, clubs, leadership roles

## AI Matching Usage

Student profiles provide the **input data** for the matching algorithm. The AI service uses:
- `branch` + `graduationYear` for domain/year-level matching
- `skills` for technical fit assessment
- `interests` for career path alignment
- `location` for geographical proximity
- `experienceLevel` for role appropriateness

**Note**: Only include fields that are actually collected in the React UI to keep the API lean and avoid unused data.