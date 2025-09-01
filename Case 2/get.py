import jwt
import datetime
import uuid
token = jwt.encode(
	{
		"iss": "e03e9687-9f8b-40ef-b77a-8a8ffd9f63b8",
		"exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
		"jti": str(uuid.uuid4()),
		"aud": "tableau",
		"sub": "muhammad.reidrisatria@langitkreasi.com",
		"scp": ["tableau:views:embed", "tableau:metrics:embed"]
,
"https://tableau.com/oda":"true",
"Region": "East"

	},
		"e03e9687-9f8b-40ef-b77a-8a8ffd9f63b8",
		algorithm = "HS256",
		headers = {
		'kid': "30c2a16a-9e26-43ab-a700-8fcf262c24e0",
		'iss': "b40d7zPWvgtRaaYRb9NKahVfG8mDYnPTIYk0heXC8iM="
        }
  )

print(token)