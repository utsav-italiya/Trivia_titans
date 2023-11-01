import functions_framework
from flask import request, jsonify
from firebase_admin import credentials, firestore, initialize_app

# Load the Firebase credentials
cred = credentials.Certificate('serviceAccountKey.json')

# Initialize the Firebase app
default_app = initialize_app(cred)

# Get a reference to the Firestore service
db = firestore.client()

@functions_framework.http
def insert_user_stats(request):
    """
    HTTP Cloud Function to insert user stats into Firestore.
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
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    request_json = request.get_json(silent=True)

    if request_json and 'team_name' in request_json and 'game_id' in request_json:

        team_name = request_json['team_name']
        game_id = request_json['game_id']

        # Create a reference to the userstats collection
        userstats_ref = db.collection(u'userstats')

        # Define the item to be inserted
        item = {
            'team_name': team_name,
            'game_id': game_id,
            'score': 0,
            'win': 0,
            'loss': 0,
            'draw': 0

        }

        # Insert the item into the Firestore collection
        try:
            userstats_ref.add(item)
            response = {'success': True, 'message': 'Team successfully inserted'}
            status_code = 200
        except Exception as e:
            response = {'success': False, 'message': f'Unable to insert item: {str(e)}'}
            status_code = 500

        headers = {'Access-Control-Allow-Origin': '*'}

        return jsonify(response), status_code, headers

    else:
        response = {'success': False, 'message': 'Invalid request: Missing team_name or game_id'}
        headers = {'Access-Control-Allow-Origin': '*'}
        return jsonify(response), 400, headers
