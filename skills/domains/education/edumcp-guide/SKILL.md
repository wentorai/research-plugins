---
name: edumcp-guide
description: "MCP server for educational content and learning management"
metadata:
  openclaw:
    emoji: "🎓"
    category: "domains"
    subcategory: "education"
    keywords: ["education MCP", "learning management", "course content", "educational AI", "tutoring", "assessment"]
    source: "https://github.com/edumcp/edumcp"
---

# EduMCP Guide

## Overview

EduMCP is an MCP server that provides educational content management and learning assistance capabilities to AI agents. It enables course content retrieval, quiz generation, learning progress tracking, and adaptive tutoring workflows. Designed for educational researchers and EdTech developers building AI-powered learning systems.

## MCP Configuration

```json
{
  "mcpServers": {
    "edumcp": {
      "command": "npx",
      "args": ["@edumcp/mcp-server"],
      "env": {
        "CONTENT_PATH": "./course_materials"
      }
    }
  }
}
```

## Features

```markdown
### Content Management
- Course material indexing and retrieval
- Lecture note search (full-text + semantic)
- Syllabus parsing and topic extraction
- Resource recommendation by topic

### Assessment Generation
- Quiz/exam question generation from content
- Multiple question types (MCQ, short answer, essay)
- Difficulty calibration
- Answer key generation with explanations

### Learning Analytics
- Student progress tracking
- Knowledge gap identification
- Learning path recommendations
- Performance analytics

### Tutoring Support
- Concept explanation at multiple levels
- Step-by-step problem solving
- Misconception detection
- Socratic questioning
```

## Use Cases

1. **Course design**: AI-assisted curriculum development
2. **Assessment**: Automated quiz and exam generation
3. **Tutoring**: Adaptive explanation and guidance
4. **Analytics**: Learning progress analysis
5. **Research**: Educational AI system development

## References

- [EduMCP GitHub](https://github.com/edumcp/edumcp)
- [MCP Specification](https://modelcontextprotocol.io/)
