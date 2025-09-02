import datetime
import uuid
import jwt

# Replace the example values below (remove the brackets).
# Store secrets securely based on your team's best practices.
# See: https://help.tableau.com/current/online/en-us/connected_apps_direct.htm

with open("s.log", "r") as f:
    content = f.read()

creds = {}

exec(content, {}, creds)

secretId = creds['secretId']
secretValue = creds['secretValue']
clientId = creds['clientId']
username = creds['username']
tokenExpiryInMinutes = 10  # Max of 10 minutes.

# Remove 'tableau:views:embed_authoring' scope if Authoring is not needed.
# Remove 'tableau:insights:embed' scope if Pulse is not needed.
scopes = [
    "tableau:views:embed",
    "tableau:views:embed_authoring",
    "tableau:insights:embed",
]

kid = secretId
iss = clientId
sub = username
aud = "tableau"
exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=tokenExpiryInMinutes)
jti = str(uuid.uuid4())
scp = scopes

userAttributes = {
    # User attributes are optional.
    # Add entries to this dictionary if desired.
    # "[User Attribute Name]": "[User Attribute Value]",
}

payload = {
    "iss": clientId,
    "exp": exp,
    "jti": jti,
    "aud": aud,
    "sub": sub,
    "scp": scp,
} | userAttributes


def getJwt():
    token = jwt.encode(
        payload,
        secretValue,
        algorithm="HS256",
        headers={
            "kid": kid,
            "iss": iss,
        },
    )

    return token


if __name__ == "__main__":
    token = getJwt()
    print(token)