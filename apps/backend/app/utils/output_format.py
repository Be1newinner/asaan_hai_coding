import json


def extract_output_as_json(user_input):
    if isinstance(user_input, str):
        user_input_obj = json.loads(user_input)
        return user_input_obj
    else:
        raise ValueError("OUTPUT PARSING ERROR!")
