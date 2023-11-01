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
def update_user_score(request):
    """
    HTTP Cloud Function to update user score in Firestore.
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

    if request_json and 'user_id' in request_json and 'game_id' in request_json and 'score' in request_json:
        user_id = request_json['user_id']
        game_id = request_json['game_id']
        score = request_json['score']

        # Create a reference to the userstats collection
        userstats_ref = db.collection(u'userstats')

        # Create a query against the collection
        query_ref = userstats_ref.where(u'user_id', u'==', user_id).where(u'game_id', u'==', game_id)

        # Get a list of all matching documents
        users = query_ref.stream()

        if users:
            # Update the score for the found item
            for user in users:
                user.reference.update({'score': score})
            
            response = {'success': True, 'message': 'User Score successfully updated'}
            status_code = 200
        else:
            response = {'success': False, 'message': 'Item not found'}
            status_code = 404

        headers = {'Access-Control-Allow-Origin': '*'}

        return jsonify(response), status_code, headers

    else:
        response = {'success': False, 'message': 'Invalid request: Missing user_id, game_id, or score'}
        headers = {'Access-Control-Allow-Origin': '*'}
        return jsonify(response), 400, headers
