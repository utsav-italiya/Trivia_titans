import functions_framework
from flask import jsonify
from firebase_admin import credentials, firestore, initialize_app

# Load the Firebase credentials
cred = credentials.Certificate('serviceAccountKey.json')

# Initialize the Firebase app
default_app = initialize_app(cred)

# Get a reference to the Firestore service
db = firestore.client()

@functions_framework.http
def get_all_team_stats(request):
    """
    HTTP Cloud Function to get all team stats from Firestore.
    Args:
        request (flask.Request): The request object.
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`.
    """
    # Set CORS headers for preflight requests
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Create a reference to the teamstats collection
    teamstats_ref = db.collection(u'teamstats')

    # Get a list of all documents
    teams = teamstats_ref.stream()

    team_data = []
    for team in teams:
        team_data.append(team.to_dict())

    response = {'success': True, 'teamstats': team_data}
    headers = {'Access-Control-Allow-Origin': '*'}

    return jsonify(response), 200, headers
