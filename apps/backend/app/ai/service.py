from gemini_service import call_gemini
from app.ai.output_format import extract_output_as_json
from course_data import course_dic, lesson_id


prompt = f"""You are an expert course content creator. Generate easy-to-understand, detailed lesson notes in Markdown format with practical examples.

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


temperature, max_tokens = 0.2, 3000


async def main(api_key, prompt, temperature, max_tokens):
    def call_api(api_key, prompt, temperature, max_tokens):
        try:
            if api_key is None:
                return None

            response_text = call_gemini(prompt, temperature, max_tokens)

            extract_output_as_json(response_text[8:-3])
        except Exception as e:
            print(e)

    call_api(api_key, prompt, temperature, max_tokens)
