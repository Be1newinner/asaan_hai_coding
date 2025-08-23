import json


def extract_output_as_json(user_input):
    if isinstance(user_input, str):
        user_input_obj = json.loads(user_input)
    else:
        user_input_obj = user_input

    lesson_id = user_input_obj[0]["lesson_id"]

    with open(f"output_{lesson_id}.json", "w", encoding="utf-8") as f:
        json.dump(user_input_obj, f, ensure_ascii=False, indent=2)
