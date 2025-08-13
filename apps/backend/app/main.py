from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)

# hashed = "$2b$12$p884VDsG9UrKLgKi2cDC2OECVNbyrvhWSdz/KbrZACBnnSZWZVle2"

# print(get_password_hash("PASSWORD"))
# print(verify_password("PASSWORd", hashed))

# print(create_access_token({"sub": "the_abc_id"}))
# print(decode_access_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aGVfYWJjX2lkIiwiZXhwIjoxNzU1MDY4MDg3LCJpYXQiOjE3NTUwNjQ0ODcsImlzcyI6ImFoYy1iYWNrZW5kIiwiYXVkIjoiYWhjLWFkbWluIn0.XAWcOWO2hi3KFejqKVqRPRWqnzwWz-OWTg8ZSFlARMI"))
