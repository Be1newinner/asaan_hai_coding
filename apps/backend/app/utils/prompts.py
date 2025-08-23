def course_prompt(course_dic: dict, lesson_id):
    return f"""You are an expert course content creator. Generate easy-to-understand, detailed lesson notes in Markdown format with practical examples.

    Course details: {course_dic}
    Build lesson content for the lesson with id {lesson_id}.

    Requirements:
    - Output only a JSON array with this structure:
    [{{"lesson_id": <id>, "content": "<Markdown detailed notes>"}}]
    - The notes should be clear, detailed, and easy to follow for learners.
    - Include real-world development examples and code snippets relevant to MERN, NestJS, Next.js, and Python.
    - Use simple language appropriate for developers refining their skills.
    - Format content using Markdown with appropriate headings, bullet points, and code blocks.
    - Make sure the output is valid JSON.
    """
