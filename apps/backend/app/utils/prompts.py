from typing import Any, Iterable, List, Optional
from collections.abc import Mapping

# ---------- Safe accessors ----------


def _is_mapping(obj: Any) -> bool:
    return isinstance(obj, Mapping)


def _get(obj: Any, key: str, default: Any = None) -> Any:
    """
    Safe accessor that handles both dict-like objects and attribute-based objects.
    """
    if _is_mapping(obj):
        return obj.get(key, default)
    return getattr(obj, key, default)


def _to_int(value: Any, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _ids_equal(a: Any, b: Any) -> bool:
    try:
        return int(a) == int(b)
    except (TypeError, ValueError):
        return str(a) == str(b)


# ---------- Core extraction ----------


def get_sections(course_dic: Any) -> List[Any]:
    """
    Extract sections from dict or object. Returns [] if missing.
    """
    if _is_mapping(course_dic):
        return course_dic.get("sections", []) or []
    return getattr(course_dic, "sections", []) or []


def get_lesson_title_by_id(sections: Iterable[Any], lesson_id: int) -> Optional[str]:
    """
    Finds the lesson title by id from sections (dicts or objects).
    """
    for sec in sections or []:
        for les in _get(sec, "lessons", []) or []:
            lid = _get(les, "id", None)
            if lid is not None and _ids_equal(lid, lesson_id):
                return _get(les, "title", None)
    return None


def flatten_and_number_lessons(sections: Iterable[Any]) -> List[dict]:
    """
    Flattens all lessons, sorts by section_order then lesson_order, and assigns a global_number starting at 1.
    Handles missing orders by pushing items to the end deterministically.
    """
    items: List[dict] = []
    for sec in sections or []:
        section_order = _to_int(_get(sec, "section_order", None), default=10**6)
        for les in _get(sec, "lessons", []) or []:
            items.append(
                {
                    "id": _get(les, "id", None),
                    "title": _get(les, "title", None),
                    "section_order": section_order,
                    "lesson_order": _to_int(
                        _get(les, "lesson_order", None), default=10**6
                    ),
                }
            )

    # Stable sort: section_order, lesson_order, then title as tie-breaker
    items.sort(
        key=lambda x: (
            x["section_order"],
            x["lesson_order"],
            (x["title"] or "").lower(),
        )
    )
    for idx, item in enumerate(items, start=1):
        item["global_number"] = idx
    return items


def format_other_titles_with_numbers(
    sections: Iterable[Any], current_lesson_id: int, prefix: str = "Lesson"
) -> List[str]:
    """
    Returns strings like 'Lesson 3. Error Handling Basics' for all lessons except the current one.
    """
    numbered = flatten_and_number_lessons(sections)
    out = []
    for it in numbered:
        if not _ids_equal(it["id"], current_lesson_id):
            title = it["title"] or ""
            out.append(f"{prefix} {it['global_number']}. {title}")
    return out


# ---------- Prompt builder ----------


def course_prompt(course_dic: Any, lesson_id: int) -> str:
    title = _get(course_dic, "title", "").strip()
    description = _get(course_dic, "description", "").strip()
    sections = get_sections(course_dic)

    lesson_title = get_lesson_title_by_id(sections, lesson_id)
    if not lesson_title:
        # Keep your fail-fast contract (raise or return the exact string depending on your pipeline)
        raise ValueError("ERROR: lesson_id not found in course sections.")

    # Build the numbered list of all other lesson titles
    other_titles_num = format_other_titles_with_numbers(
        sections, lesson_id, prefix="Lesson"
    )
    other_titles_block = (
        "\n- " + "\n- ".join(other_titles_num) if other_titles_num else " (none)"
    )
    # print(other_titles_block)

    # (Optional) Include the full outline for scope awareness without reproducing it verbatim
    # sections_str = str(sections)  # Uncomment if you want to show outline in the prompt

    return f"""You are an expert course content creator. Produce a detailed, easy-to-understand lesson in Markdown for developers.

    Course title: {title}
    Course description: {description}

    Create the lesson content ONLY for lesson id {lesson_id} with lesson title "{lesson_title}".

    STRICT SCOPE RULES (must follow):
    - Teach ONLY the topic of "{lesson_title}".
    - The following lesson topics are OUT-OF-SCOPE for this lesson. Do NOT explain, define, or teach these. If absolutely necessary, mention by name only and move on:{other_titles_block}
    - Do NOT preview future lessons or recap past lessons beyond one brief sentence if required for context.
    - If a minimal example requires an out-of-scope concept, reference it by name in a single line without explanation.
    - If the requested lesson title is ambiguous or missing, DO NOT write content; instead respond exactly with: "ERROR: lesson_id not found in course sections."

    OUTPUT FORMAT (mandatory):
    - Start with a single H1 heading that matches the lesson title exactly: # {lesson_title}
    - Audience: developers refining MERN, NestJS, Next.js, and Python skills.
    - Sections (in this order): Overview, Key Concepts, Step-by-step, Code Examples, Pitfalls, Exercises.
    - Code: Runnable, minimal examples with language tags (js, ts, py, sql, bash). Favor realistic scenarios (REST/GraphQL APIs, DB access via Prisma/SQLAlchemy/Mongoose, Redis caching). Brief notes for Docker/Kubernetes when relevant.
    - Style: Clear, concise, practical; use bullet points where helpful.
    - Length: ~900–1400 words.
    - Constraints: No external links, no HTML, no placeholders.
    - Return only the lesson content as Markdown. No JSON, no preface, no trailing commentary.

    Before writing, silently verify you are only covering "{lesson_title}" and not explaining any out-of-scope topics.
    """
